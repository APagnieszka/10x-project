import { useEffect, useRef, useState, useCallback } from "react";
import Quagga from "@ericblade/quagga2";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImageSourceSelector } from "./ImageSourceSelector";

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function isValidEanLikeChecksum(code: string) {
  if (!/^\d+$/.test(code)) return false;

  // Supports EAN-8, EAN-13 and UPC-A (12 digits) checksum validation.
  // EAN/UPC checksum:
  // - sum digits in alternating positions (from right, excluding check digit)
  // - multiply one group by 3
  // - check digit makes total a multiple of 10
  const len = code.length;
  if (len !== 8 && len !== 12 && len !== 13) return false;

  const digits = code.split("").map((c) => Number(c));
  const checkDigit = digits[len - 1];

  let sum = 0;
  // iterate from right-to-left excluding check digit
  // positionFromRight: 1 for the rightmost digit (just left of check digit)
  for (let i = len - 2, positionFromRight = 1; i >= 0; i -= 1, positionFromRight += 1) {
    const digit = digits[i];
    const shouldMultiplyBy3 = positionFromRight % 2 === 1;
    sum += digit * (shouldMultiplyBy3 ? 3 : 1);
  }

  const computedCheckDigit = (10 - (sum % 10)) % 10;
  return computedCheckDigit === checkDigit;
}

function shouldValidateChecksumForFormat(format?: string | null) {
  return format === "ean_13" || format === "ean_8" || format === "upc_a" || format === "upc_e";
}

interface ToastFunctions {
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
}

interface BarcodeScannerProps {
  onBarcodeDetected: (barcode: string) => void;
  onCancel: () => void;
  toast?: ToastFunctions;
}

type ViewMode = "select" | "camera" | "gallery";

interface Roi {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface RoiInteraction {
  mode: "draw" | "move";
  startX: number;
  startY: number;
  originRoi?: Roi;
  moveOffsetX?: number;
  moveOffsetY?: number;
}

interface QuaggaDetectedResult {
  codeResult?: {
    code?: string | null;
    format?: string | null;
  };
}

/**
 * BarcodeScanner component using QuaggaJS for barcode detection
 * Supports both camera scanning and gallery image selection
 */
export function BarcodeScanner({ onBarcodeDetected, onCancel, toast }: BarcodeScannerProps) {
  const scannerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryImageRef = useRef<HTMLImageElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [detectedBarcode, setDetectedBarcode] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("select");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [roi, setRoi] = useState<Roi | null>(null);
  const stableCodeRef = useRef<{ code: string; count: number } | null>(null);
  const roiInteractionRef = useRef<RoiInteraction | null>(null);
  const maxRetries = 3;
  const requiredStableDetections = 1;

  const handleQuaggaDetected = useCallback(
    (result: QuaggaDetectedResult) => {
      const code = result?.codeResult?.code;
      if (!code) return;

      const format = result?.codeResult?.format;
      if (shouldValidateChecksumForFormat(format) && !isValidEanLikeChecksum(code)) {
        return;
      }

      const accept = () => {
        setDetectedBarcode(code);
        toast?.success("Kod zeskanowany", `Wykryto kod: ${code}`);

        Quagga.stop();
        onBarcodeDetected(code);
      };

      const previous = stableCodeRef.current;
      if (!previous || previous.code !== code) {
        stableCodeRef.current = { code, count: 1 };

        if (requiredStableDetections <= 1) {
          accept();
        }

        return;
      }

      previous.count += 1;
      if (previous.count < requiredStableDetections) return;

      accept();
    },
    [onBarcodeDetected, requiredStableDetections, toast]
  );

  const decodeBarcodeFromImageData = useCallback(
    (imageData: string, options?: { quality?: "default" | "high" }) => {
      const startQuality = options?.quality ?? "default";

      const run = (quality: "default" | "high") => {
        Quagga.decodeSingle(
          {
            src: imageData,
            numOfWorkers: 0,
            inputStream: {
              size: quality === "high" ? 1600 : 800,
            },
            decoder: {
              readers: ["ean_reader", "ean_8_reader"],
            },
            locate: true,
            locator: {
              patchSize: quality === "high" ? "large" : "medium",
              halfSample: quality === "high" ? false : true,
            },
          },
          (result) => {
            if (result && result.codeResult && result.codeResult.code) {
              const code = result.codeResult.code;
              setIsInitializing(false);
              setDetectedBarcode(code);
              toast?.success("Wykryto kod", `Znaleziono kod: ${code}`);
              return;
            }

            if (quality === "default") {
              run("high");
              return;
            }

            setIsInitializing(false);
            const errorMsg = "Nie znaleziono kodu na wybranym zdjęciu. Zaznacz kod ramką i spróbuj ponownie.";
            setError(errorMsg);
            toast?.error("Nie znaleziono kodu", errorMsg);
          }
        );
      };

      run(startQuality);
    },
    [toast]
  );

  const cropSelectedImageToRoi = useCallback(async (imageData: string, selection: Roi) => {
    const img = new Image();
    img.src = imageData;

    // Ensure the image is decoded before reading natural sizes.
    await img.decode();

    const naturalW = img.naturalWidth;
    const naturalH = img.naturalHeight;

    const sx = Math.round(clamp01(selection.x) * naturalW);
    const sy = Math.round(clamp01(selection.y) * naturalH);
    const sw = Math.round(clamp01(selection.w) * naturalW);
    const sh = Math.round(clamp01(selection.h) * naturalH);

    // Guard against tiny/invalid rectangles.
    if (sw < 10 || sh < 10) {
      return imageData;
    }

    // Upscale small crops to improve decoder reliability on real photos.
    const minOutputWidth = 900;
    const scale = Math.min(4, Math.max(1, minOutputWidth / sw));
    const outW = Math.round(sw * scale);
    const outH = Math.round(sh * scale);

    const canvas = document.createElement("canvas");
    canvas.width = outW;
    canvas.height = outH;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return imageData;
    }

    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, outW, outH);
    return canvas.toDataURL("image/jpeg", 0.92);
  }, []);

  const initScanner = useCallback(
    async (isRetry = false) => {
      if (!scannerRef.current) return;

      if (!isRetry) {
        setIsInitializing(true);
        setError(null);
      }

      try {
        stableCodeRef.current = null;
        Quagga.stop();
        await Quagga.init(
          {
            inputStream: {
              name: "Live",
              type: "LiveStream",
              target: scannerRef.current,
              constraints: {
                width: { ideal: 1280, min: 640 },
                height: { ideal: 720, min: 480 },
                facingMode: { ideal: "environment" },
              },
            },
            decoder: {
              readers: ["ean_reader", "ean_8_reader"],
              multiple: false,
            },
            locate: true,
            locator: {
              patchSize: "medium",
              halfSample: true,
            },
            numOfWorkers: 2,
            frequency: 10,
          },
          (err) => {
            if (err) {
              const errorMessage = err.message?.includes("Permission denied")
                ? "Brak dostępu do aparatu. Przyznaj uprawnienia i spróbuj ponownie."
                : err.message?.includes("NotFoundError")
                  ? "Nie znaleziono aparatu. Sprawdź, czy kamera jest dostępna."
                  : `Nie udało się uruchomić aparatu (${retryCount + 1}/${maxRetries}). Spróbuj ponownie.`;

              setError(errorMessage);
              toast?.error("Błąd aparatu", errorMessage);
              setIsInitializing(false);
              return;
            }
            Quagga.start();
            setIsInitializing(false);
            setRetryCount(0); // Reset retry count on success
          }
        );

        // Handle barcode detection
        Quagga.offDetected(handleQuaggaDetected);
        Quagga.onDetected(handleQuaggaDetected);
      } catch (err) {
        const errorMessage =
          err instanceof Error && err.message.includes("getUserMedia")
            ? "Nie udało się uzyskać dostępu do aparatu. Sprawdź uprawnienia i spróbuj ponownie."
            : `Nie udało się uruchomić skanera (${retryCount + 1}/${maxRetries}). Spróbuj ponownie.`;

        setError(errorMessage);
        toast?.error("Nie udało się uruchomić skanera", errorMessage);
        setIsInitializing(false);
      }
    },
    [retryCount, maxRetries, toast, handleQuaggaDetected]
  );

  const decodeFullSelectedImage = useCallback(
    (imageData: string) => {
      setIsInitializing(true);
      setError(null);
      setDetectedBarcode(null);
      setSelectedImage(imageData);
      setRoi(null);
      decodeBarcodeFromImageData(imageData, { quality: "default" });
    },
    [decodeBarcodeFromImageData]
  );

  // Handle file selection from gallery
  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Check if file is an image
      if (!file.type.startsWith("image/")) {
        setError("Wybierz poprawny plik obrazu.");
        toast?.error("Nieprawidłowy plik", "Wybierz poprawny plik obrazu.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        if (imageData) {
          decodeFullSelectedImage(imageData);
        }
      };
      reader.onerror = () => {
        const errorMsg = "Nie udało się odczytać wybranego zdjęcia. Spróbuj ponownie.";
        setError(errorMsg);
        toast?.error("Błąd odczytu", errorMsg);
      };
      reader.readAsDataURL(file);
    },
    [toast, decodeFullSelectedImage]
  );

  const handleDecodeSelection = useCallback(async () => {
    if (!selectedImage || !roi) return;

    setIsInitializing(true);
    setError(null);
    setDetectedBarcode(null);

    try {
      const cropped = await cropSelectedImageToRoi(selectedImage, roi);
      decodeBarcodeFromImageData(cropped, { quality: "high" });
    } catch {
      const errorMsg = "Nie udało się przetworzyć zaznaczenia. Spróbuj ponownie.";
      setIsInitializing(false);
      setError(errorMsg);
      toast?.error("Błąd", errorMsg);
    }
  }, [cropSelectedImageToRoi, decodeBarcodeFromImageData, roi, selectedImage, toast]);

  const toLocalPoint = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) {
      return { x: 0, y: 0 };
    }

    const x = clamp01((event.clientX - rect.left) / rect.width);
    const y = clamp01((event.clientY - rect.top) / rect.height);
    return { x, y };
  }, []);

  const isPointInsideRoi = useCallback((point: { x: number; y: number }, selection: Roi) => {
    return (
      point.x >= selection.x &&
      point.x <= selection.x + selection.w &&
      point.y >= selection.y &&
      point.y <= selection.y + selection.h
    );
  }, []);

  const handleRoiPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!selectedImage) return;
      event.currentTarget.setPointerCapture(event.pointerId);

      const point = toLocalPoint(event);

      if (roi && isPointInsideRoi(point, roi)) {
        roiInteractionRef.current = {
          mode: "move",
          startX: point.x,
          startY: point.y,
          originRoi: roi,
          moveOffsetX: point.x - roi.x,
          moveOffsetY: point.y - roi.y,
        };
        return;
      }

      roiInteractionRef.current = { mode: "draw", startX: point.x, startY: point.y };
      setRoi({ x: point.x, y: point.y, w: 0, h: 0 });
    },
    [isPointInsideRoi, roi, selectedImage, toLocalPoint]
  );

  const handleRoiPointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const interaction = roiInteractionRef.current;
      if (!interaction) return;

      const point = toLocalPoint(event);

      if (
        interaction.mode === "move" &&
        interaction.originRoi &&
        typeof interaction.moveOffsetX === "number" &&
        typeof interaction.moveOffsetY === "number"
      ) {
        const nextX = clamp01(point.x - interaction.moveOffsetX);
        const nextY = clamp01(point.y - interaction.moveOffsetY);

        const maxX = 1 - interaction.originRoi.w;
        const maxY = 1 - interaction.originRoi.h;

        setRoi({
          ...interaction.originRoi,
          x: Math.min(maxX, Math.max(0, nextX)),
          y: Math.min(maxY, Math.max(0, nextY)),
        });
        return;
      }

      if (interaction.mode === "draw") {
        const x1 = interaction.startX;
        const y1 = interaction.startY;
        const x2 = point.x;
        const y2 = point.y;

        const x = Math.min(x1, x2);
        const y = Math.min(y1, y2);
        const w = Math.abs(x2 - x1);
        const h = Math.abs(y2 - y1);

        setRoi({ x, y, w, h });
      }
    },
    [toLocalPoint]
  );

  const handleRoiPointerUp = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (roiInteractionRef.current) {
      roiInteractionRef.current = null;
    }

    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // ignore
    }

    setRoi((current) => {
      if (!current) return null;
      // If selection is too small, discard it.
      if (current.w < 0.02 || current.h < 0.02) return null;
      return current;
    });
  }, []);

  // Handle mode selection
  const handleSelectCamera = useCallback(() => {
    setViewMode("camera");
    setIsInitializing(true);
  }, []);

  const handleSelectGallery = useCallback(() => {
    setViewMode("gallery");
    fileInputRef.current?.click();
  }, []);

  useEffect(() => {
    if (viewMode === "camera") {
      initScanner();
    }

    // Cleanup on unmount
    return () => {
      Quagga.stop();
      Quagga.offDetected(handleQuaggaDetected);
    };
  }, [initScanner, viewMode, handleQuaggaDetected]);
  const handleRetry = () => {
    if (retryCount < maxRetries) {
      setRetryCount((prev) => prev + 1);
      initScanner(true);
    }
  };

  const handleCancel = () => {
    Quagga.stop();
    setSelectedImage(null);
    setDetectedBarcode(null);
    setRoi(null);
    onCancel();
  };

  const handleApplyBarcode = () => {
    if (detectedBarcode) {
      onBarcodeDetected(detectedBarcode);
    }
  };

  return (
    <>
      {/* Hidden file input for gallery selection */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Wybierz zdjęcie z galerii"
      />

      {/* Source selection view */}
      {viewMode === "select" && (
        <ImageSourceSelector
          onSelectCamera={handleSelectCamera}
          onSelectGallery={handleSelectGallery}
          onCancel={onCancel}
          title="Skanuj kod kreskowy"
          description="Wybierz sposób skanowania kodu: użyj aparatu albo wybierz istniejące zdjęcie."
        />
      )}

      {/* Camera view or processing view */}
      {(viewMode === "camera" || viewMode === "gallery") && (
        <div className="fixed inset-0 z-50 bg-black">
          {/* Camera viewport */}
          {viewMode === "camera" && <div ref={scannerRef} className="absolute inset-0 quagga-scanner" />}

          {/* Gallery image preview */}
          {viewMode === "gallery" && selectedImage && (
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="relative">
                <img
                  ref={galleryImageRef}
                  src={selectedImage}
                  alt="Selected for barcode scanning"
                  className="block max-w-full max-h-full object-contain"
                />

                {/* ROI overlay for manually selecting barcode area */}
                <div
                  className="absolute inset-0 pointer-events-auto touch-none"
                  role="application"
                  aria-label="Zaznacz obszar kodu kreskowego"
                  onPointerDown={handleRoiPointerDown}
                  onPointerMove={handleRoiPointerMove}
                  onPointerUp={handleRoiPointerUp}
                >
                  {roi && (
                    <div
                      className="absolute border-2 border-green-500 bg-green-500/10"
                      style={{
                        left: `${roi.x * 100}%`,
                        top: `${roi.y * 100}%`,
                        width: `${roi.w * 100}%`,
                        height: `${roi.h * 100}%`,
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Overlay with instructions and controls */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Top section with tips */}
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-6 pointer-events-auto">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-white text-xl font-semibold mb-2">
                  {viewMode === "camera" ? "Skanuj kod kreskowy" : "Przetwarzanie zdjęcia"}
                </h2>
                <div className="text-white/80 text-sm space-y-1">
                  {viewMode === "camera" && (
                    <>
                      <p>• Ustaw kod w ramce</p>
                      <p>• Zadbaj o dobre oświetlenie</p>
                      <p>• Trzymaj aparat nieruchomo</p>
                    </>
                  )}
                  {viewMode === "gallery" && (
                    <>
                      <p>• Jeśli kod nie został wykryty, zaznacz go ramką</p>
                      <p>• Następnie kliknij: Skanuj zaznaczenie</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Center scanning frame - only for camera mode */}
            {viewMode === "camera" && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-64 h-40 border-4 border-white/50 rounded-lg relative">
                  {/* Corner markers */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-500 rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-500 rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-500 rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-500 rounded-br-lg" />

                  {/* Scanning line animation */}
                  {!error && !detectedBarcode && (
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-green-500 animate-scan" />
                  )}
                </div>
              </div>
            )}

            {/* Bottom section with controls and status */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pointer-events-auto">
              <div className="max-w-2xl mx-auto space-y-4">
                {/* Error message */}
                {error && (
                  <Card className="bg-red-500/90 border-red-600 p-4">
                    <p className="text-white text-sm mb-2">{error}</p>
                    {retryCount < maxRetries && viewMode === "camera" && (
                      <Button
                        onClick={handleRetry}
                        variant="outline"
                        size="sm"
                        className="bg-white/20 border-white/40 text-white hover:bg-white/30"
                      >
                        Spróbuj ponownie ({retryCount + 1}/{maxRetries})
                      </Button>
                    )}
                  </Card>
                )}

                {/* Detected barcode */}
                {detectedBarcode && (
                  <Card className="bg-green-500/90 border-green-600 p-4">
                    <p className="text-white text-sm font-semibold mb-2">Kod kreskowy wykryty: {detectedBarcode}</p>
                    <p className="text-white/90 text-xs">Dane produktu zostały wczytane na podstawie kodu kreskowego</p>
                  </Card>
                )}

                {/* Loading state */}
                {isInitializing && (
                  <Card className="bg-white/90 p-4">
                    <p className="text-gray-800 text-sm">
                      {viewMode === "camera" ? "Uruchamianie aparatu..." : "Przetwarzanie zdjęcia..."}
                    </p>
                  </Card>
                )}

                {/* Manual decode for selected region - gallery only */}
                {viewMode === "gallery" && selectedImage && (
                  <Button
                    onClick={handleDecodeSelection}
                    variant="outline"
                    className="w-full bg-white/90 hover:bg-white"
                    size="lg"
                    disabled={!roi || isInitializing}
                  >
                    Skanuj zaznaczenie
                  </Button>
                )}

                {/* Apply barcode button - only for gallery mode with detected barcode */}
                {viewMode === "gallery" && detectedBarcode && (
                  <Button
                    onClick={handleApplyBarcode}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    size="lg"
                  >
                    Zastosuj kod kreskowy
                  </Button>
                )}

                {/* Cancel button */}
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="w-full bg-white/90 hover:bg-white"
                  size="lg"
                >
                  Anuluj
                </Button>
              </div>
            </div>
          </div>

          {/* Custom animation for scanning line */}
          <style>{`
            .quagga-scanner,
            .quagga-scanner > * {
              width: 100% !important;
              height: 100% !important;
            }

            /* Quagga injects video + canvases with fixed dimensions; force them to cover the viewport */
            .quagga-scanner video {
              position: absolute !important;
              inset: 0 !important;
              width: 100% !important;
              height: 100% !important;
              object-fit: cover;
            }

            .quagga-scanner canvas {
              position: absolute !important;
              inset: 0 !important;
              width: 100% !important;
              height: 100% !important;
            }

            @keyframes scan {
              0% {
                top: 0;
              }
              50% {
                top: 100%;
              }
              100% {
                top: 0;
              }
            }
            .animate-scan {
              animation: scan 2s linear infinite;
            }
          `}</style>
        </div>
      )}
    </>
  );
}
