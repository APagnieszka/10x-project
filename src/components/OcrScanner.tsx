import { useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface OcrScannerProps {
  onPhotoTaken: (imageData: string) => void;
  onCancel: () => void;
}

/**
 * OcrScanner component for capturing photos of expiration dates
 * Uses native camera API to take photos for OCR processing
 */
export function OcrScanner({ onPhotoTaken, onCancel }: OcrScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  // Initialize camera
  const initCamera = useCallback(
    async (isRetry = false) => {
      if (!isRetry) {
        setIsInitializing(true);
        setError(null);
      }

      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment", // Use back camera on mobile
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          setStream(mediaStream);
          setIsInitializing(false);
          setRetryCount(0); // Reset retry count on success
        }
      } catch (err) {
        console.error("Camera access error:", err);
        const errorMessage =
          err instanceof Error && err.name === "NotAllowedError"
            ? "Camera access denied. Please grant camera permissions and try again."
            : err instanceof Error && err.name === "NotFoundError"
              ? "No camera found. Please check your camera connection."
              : `Failed to access camera (${retryCount + 1}/${maxRetries}). Please try again.`;

        setError(errorMessage);
        setIsInitializing(false);
      }
    },
    [retryCount, maxRetries]
  );

  const handleRetry = () => {
    if (retryCount < maxRetries) {
      setRetryCount((prev) => prev + 1);
      initCamera(true);
    }
  };

  // Start camera on mount
  useState(() => {
    initCamera();
  });

  // Cleanup camera on unmount
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  const handleCancel = () => {
    stopCamera();
    onCancel();
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data as base64
    const imageData = canvas.toDataURL("image/jpeg", 0.95);

    setPhotoTaken(true);
    stopCamera();
    onPhotoTaken(imageData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Video preview */}
      <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />

      {/* Hidden canvas for capturing photos */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Overlay with instructions and controls */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top section with tips */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-6 pointer-events-auto">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-white text-xl font-semibold mb-2">Capture Expiration Date</h2>
            <div className="text-white/80 text-sm space-y-1">
              <p>• Position the expiration date label in the frame</p>
              <p>• Ensure sharp focus and good lighting</p>
              <p>• Avoid shadows and glare</p>
              <p>• Hold the camera steady</p>
            </div>
          </div>
        </div>

        {/* Center capture frame */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-80 h-48 border-4 border-white/50 rounded-lg relative">
            {/* Corner markers */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-lg" />
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

            {/* Loading state */}
            {isInitializing && (
              <Card className="bg-white/90 p-4">
                <p className="text-gray-800 text-sm">Initializing camera...</p>
              </Card>
            )}

            {/* Photo taken confirmation */}
            {photoTaken && (
              <Card className="bg-green-500/90 border-green-600 p-4">
                <p className="text-white text-sm font-semibold">Photo captured! Processing...</p>
              </Card>
            )}

            {/* Control buttons */}
            <div className="flex gap-4">
              <Button onClick={handleCancel} variant="outline" className="flex-1 bg-white/90 hover:bg-white" size="lg">
                Cancel
              </Button>
              <Button
                onClick={handleCapture}
                disabled={isInitializing || error !== null || photoTaken}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                Capture Photo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
