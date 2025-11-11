import { useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImageSourceSelector } from "./ImageSourceSelector";

interface OcrScannerProps {
  onPhotoTaken: (imageData: string) => void;
  onCancel: () => void;
}

type ViewMode = "select" | "camera" | "gallery";

/**
 * OcrScanner component for capturing photos of expiration dates
 * Supports both camera capture and gallery selection for OCR processing
 */
export function OcrScanner({ onPhotoTaken, onCancel }: OcrScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("select");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{ date: string; confidence: number } | null>(null);
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

  // Handle file selection from gallery
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      if (imageData) {
        setSelectedImage(imageData);
        setPhotoTaken(true);
      }
    };
    reader.onerror = () => {
      setError("Failed to read the selected image. Please try again.");
    };
    reader.readAsDataURL(file);
  }, []);

  // Handle mode selection
  const handleSelectCamera = useCallback(() => {
    setViewMode("camera");
    setIsInitializing(true);
    initCamera();
  }, [initCamera]);

  const handleSelectGallery = useCallback(() => {
    setViewMode("gallery");
    fileInputRef.current?.click();
  }, []);

  // Start camera on camera mode
  useState(() => {
    if (viewMode === "camera") {
      initCamera();
    }
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
    setSelectedImage(null);
    setPhotoTaken(false);
    setScanResult(null);
    setIsScanning(false);
    onCancel();
  };

  const handleConfirmPhoto = () => {
    if (selectedImage) {
      onPhotoTaken(selectedImage);
    }
  };

  const handleQuickScan = useCallback(() => {
    if (!selectedImage) return;

    setIsScanning(true);
    setScanResult(null);
    setError(null);

    // Simulate OCR processing - in real implementation, use Tesseract.js or API
    setTimeout(() => {
      // Mock result - in production, this would be actual OCR
      const mockResult = {
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        confidence: Math.floor(Math.random() * 30) + 70, // Random confidence 70-100
      };

      setScanResult(mockResult);
      setIsScanning(false);
    }, 1500);
  }, [selectedImage]);

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
    <>
      {/* Hidden file input for gallery selection */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Select image from gallery"
      />

      {/* Source selection view */}
      {viewMode === "select" && (
        <ImageSourceSelector
          onSelectCamera={handleSelectCamera}
          onSelectGallery={handleSelectGallery}
          onCancel={onCancel}
          title="Capture Expiration Date"
          description="Choose how you want to capture the expiration date photo for OCR processing."
        />
      )}

      {/* Camera view */}
      {viewMode === "camera" && (
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
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="flex-1 bg-white/90 hover:bg-white"
                    size="lg"
                  >
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
      )}

      {/* Gallery image preview view */}
      {viewMode === "gallery" && selectedImage && (
        <div className="fixed inset-0 z-50 bg-black">
          {/* Image preview */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <img src={selectedImage} alt="Selected for OCR scanning" className="max-w-full max-h-full object-contain" />
          </div>

          {/* Overlay with instructions and controls */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Top section with info */}
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-6 pointer-events-auto">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-white text-xl font-semibold mb-2">Selected Photo</h2>
                <div className="text-white/80 text-sm">
                  <p>• Review the image to ensure the expiration date is clearly visible</p>
                  <p>• Confirm to proceed with OCR processing</p>
                </div>
              </div>
            </div>

            {/* Bottom section with controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pointer-events-auto">
              <div className="max-w-2xl mx-auto space-y-4">
                {/* Photo confirmation message */}
                {photoTaken && !scanResult && !isScanning && (
                  <Card className="bg-blue-500/90 border-blue-600 p-4">
                    <p className="text-white text-sm font-semibold">Photo selected! Ready to process.</p>
                    <p className="text-white/80 text-xs mt-1">
                      Tip: Use &quot;Scan Date&quot; to preview the quality before proceeding
                    </p>
                  </Card>
                )}

                {/* Scanning in progress */}
                {isScanning && (
                  <Card className="bg-yellow-500/90 border-yellow-600 p-4">
                    <p className="text-white text-sm font-semibold">Scanning date from image...</p>
                    <p className="text-white/90 text-xs mt-1">Please wait while we analyze the photo</p>
                  </Card>
                )}

                {/* Scan result */}
                {scanResult && (
                  <Card
                    className={`${scanResult.confidence >= 80 ? "bg-green-500/90 border-green-600" : "bg-orange-500/90 border-orange-600"} p-4`}
                  >
                    <div className="space-y-2">
                      <div>
                        <p className="text-white text-sm font-semibold">
                          Detected Date: {new Date(scanResult.date).toLocaleDateString()}
                        </p>
                        <p className="text-white/90 text-xs">Confidence: {scanResult.confidence}%</p>
                      </div>
                      {scanResult.confidence < 80 && (
                        <p className="text-white/80 text-xs mt-2">
                          ⚠️ Low confidence. Consider retaking the photo with better lighting or focus.
                        </p>
                      )}
                      {scanResult.confidence >= 80 && (
                        <p className="text-white/80 text-xs mt-2">✓ Good quality! You can proceed with this photo.</p>
                      )}
                    </div>
                  </Card>
                )}

                {/* Control buttons */}
                <div className="flex flex-col gap-3">
                  {/* Scan Date button - only show before scanning */}
                  {!scanResult && !isScanning && (
                    <Button
                      onClick={handleQuickScan}
                      variant="outline"
                      className="w-full bg-yellow-500/90 hover:bg-yellow-600 text-white border-yellow-600"
                      size="lg"
                    >
                      🔍 Scan Date (Preview Quality)
                    </Button>
                  )}

                  {/* Rescan button - show after scan result */}
                  {scanResult && (
                    <Button
                      onClick={handleQuickScan}
                      variant="outline"
                      className="w-full bg-yellow-500/90 hover:bg-yellow-600 text-white border-yellow-600"
                      size="lg"
                      disabled={isScanning}
                    >
                      🔄 Scan Again
                    </Button>
                  )}

                  <div className="flex gap-3">
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      className="flex-1 bg-white/90 hover:bg-white"
                      size="lg"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleConfirmPhoto}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      size="lg"
                      disabled={isScanning}
                    >
                      Use This Photo
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
