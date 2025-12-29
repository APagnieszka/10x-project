import { useEffect, useRef, useState, useCallback } from "react";
import Quagga from "@ericblade/quagga2";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImageSourceSelector } from "./ImageSourceSelector";

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

/**
 * BarcodeScanner component using QuaggaJS for barcode detection
 * Supports both camera scanning and gallery image selection
 */
export function BarcodeScanner({ onBarcodeDetected, onCancel, toast }: BarcodeScannerProps) {
  const scannerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [detectedBarcode, setDetectedBarcode] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("select");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const maxRetries = 3;

  const initScanner = useCallback(
    async (isRetry = false) => {
      if (!scannerRef.current) return;

      if (!isRetry) {
        setIsInitializing(true);
        setError(null);
      }

      try {
        await Quagga.init(
          {
            inputStream: {
              name: "Live",
              type: "LiveStream",
              target: scannerRef.current,
              constraints: {
                width: { min: 640 },
                height: { min: 480 },
                facingMode: "environment", // Use back camera on mobile
                aspectRatio: { min: 1, max: 2 },
              },
            },
            decoder: {
              readers: [
                "ean_reader",
                "ean_8_reader",
                "code_128_reader",
                "code_39_reader",
                "upc_reader",
                "upc_e_reader",
              ],
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
        Quagga.onDetected((result) => {
          if (result.codeResult && result.codeResult.code) {
            const code = result.codeResult.code;
            setDetectedBarcode(code);
            toast?.success("Kod zeskanowany", `Wykryto kod: ${code}`);

            // Stop scanner and notify parent
            Quagga.stop();
            onBarcodeDetected(code);
          }
        });
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
    [retryCount, maxRetries, toast, onBarcodeDetected]
  );

  // Decode barcode from static image
  const decodeImageBarcode = useCallback(
    (imageData: string) => {
      setIsInitializing(true);
      setError(null);
      setSelectedImage(imageData);

      Quagga.decodeSingle(
        {
          src: imageData,
          numOfWorkers: 0,
          decoder: {
            readers: ["ean_reader", "ean_8_reader", "code_128_reader", "code_39_reader", "upc_reader", "upc_e_reader"],
          },
          locate: true,
          locator: {
            patchSize: "medium",
            halfSample: true,
          },
        },
        (result) => {
          setIsInitializing(false);

          if (result && result.codeResult && result.codeResult.code) {
            const code = result.codeResult.code;
            setDetectedBarcode(code);
            toast?.success("Wykryto kod", `Znaleziono kod: ${code}`);
          } else {
            const errorMsg = "Nie znaleziono kodu na wybranym zdjęciu. Spróbuj innego zdjęcia.";
            setError(errorMsg);
            toast?.error("Nie znaleziono kodu", errorMsg);
          }
        }
      );
    },
    [toast]
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
          // Use Quagga to decode barcode from static image
          decodeImageBarcode(imageData);
        }
      };
      reader.onerror = () => {
        const errorMsg = "Nie udało się odczytać wybranego zdjęcia. Spróbuj ponownie.";
        setError(errorMsg);
        toast?.error("Błąd odczytu", errorMsg);
      };
      reader.readAsDataURL(file);
    },
    [toast, decodeImageBarcode]
  );

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
      Quagga.offDetected();
    };
  }, [initScanner, viewMode]);
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
          {viewMode === "camera" && (
            <div ref={scannerRef} className="absolute inset-0" style={{ width: "100%", height: "100%" }} />
          )}

          {/* Gallery image preview */}
          {viewMode === "gallery" && selectedImage && (
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <img
                src={selectedImage}
                alt="Selected for barcode scanning"
                className="max-w-full max-h-full object-contain"
              />
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
                  {viewMode === "gallery" && <p>• Analizuję zdjęcie w poszukiwaniu kodu...</p>}
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
