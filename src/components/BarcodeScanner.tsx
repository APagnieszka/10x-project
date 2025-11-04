import { useEffect, useRef, useState, useCallback } from "react";
import Quagga from "@ericblade/quagga2";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ToastFunctions {
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
}

interface BarcodeScannerProps {
  onBarcodeDetected: (barcode: string) => void;
  onCancel: () => void;
  toast?: ToastFunctions;
}

/**
 * BarcodeScanner component using QuaggaJS for barcode detection
 * Provides full-screen camera overlay with scanning capabilities
 */
export function BarcodeScanner({ onBarcodeDetected, onCancel, toast }: BarcodeScannerProps) {
  const scannerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [detectedBarcode, setDetectedBarcode] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
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
                ? "Camera access denied. Please grant camera permissions and try again."
                : err.message?.includes("NotFoundError")
                  ? "No camera found. Please check your camera connection."
                  : `Failed to access camera (${retryCount + 1}/${maxRetries}). Please try again.`;

              setError(errorMessage);
              toast?.error("Camera Error", errorMessage);
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
            toast?.success("Barcode Scanned", `Detected barcode: ${code}`);

            // Stop scanner and notify parent
            Quagga.stop();
            onBarcodeDetected(code);
          }
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error && err.message.includes("getUserMedia")
            ? "Camera access failed. Please check permissions and try again."
            : `Scanner setup failed (${retryCount + 1}/${maxRetries}). Please try again.`;

        setError(errorMessage);
        toast?.error("Scanner Setup Failed", errorMessage);
        setIsInitializing(false);
      }
    },
    [retryCount, maxRetries, toast, onBarcodeDetected]
  );

  useEffect(() => {
    initScanner();

    // Cleanup on unmount
    return () => {
      Quagga.stop();
      Quagga.offDetected();
    };
  }, [initScanner]);
  const handleRetry = () => {
    if (retryCount < maxRetries) {
      setRetryCount((prev) => prev + 1);
      initScanner(true);
    }
  };

  const handleCancel = () => {
    Quagga.stop();
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Camera viewport */}
      <div ref={scannerRef} className="absolute inset-0" style={{ width: "100%", height: "100%" }} />

      {/* Overlay with instructions and controls */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top section with tips */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-6 pointer-events-auto">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-white text-xl font-semibold mb-2">Scan Barcode</h2>
            <div className="text-white/80 text-sm space-y-1">
              <p>• Position the barcode within the frame</p>
              <p>• Ensure good lighting</p>
              <p>• Hold the camera steady</p>
            </div>
          </div>
        </div>

        {/* Center scanning frame */}
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

        {/* Bottom section with controls and status */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pointer-events-auto">
          <div className="max-w-2xl mx-auto space-y-4">
            {/* Error message */}
            {error && (
              <Card className="bg-red-500/90 border-red-600 p-4">
                <p className="text-white text-sm mb-2">{error}</p>
                {retryCount < maxRetries && (
                  <Button
                    onClick={handleRetry}
                    variant="outline"
                    size="sm"
                    className="bg-white/20 border-white/40 text-white hover:bg-white/30"
                  >
                    Try Again ({retryCount + 1}/{maxRetries})
                  </Button>
                )}
              </Card>
            )}

            {/* Detected barcode */}
            {detectedBarcode && (
              <Card className="bg-green-500/90 border-green-600 p-4">
                <p className="text-white text-sm font-semibold">Barcode detected: {detectedBarcode}</p>
              </Card>
            )}

            {/* Loading state */}
            {isInitializing && (
              <Card className="bg-white/90 p-4">
                <p className="text-gray-800 text-sm">Initializing camera...</p>
              </Card>
            )}

            {/* Cancel button */}
            <Button onClick={handleCancel} variant="outline" className="w-full bg-white/90 hover:bg-white" size="lg">
              Cancel
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
  );
}
