"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface OcrConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (detectedDate: string, confidence: number) => void;
  onRescan: () => void;
  detectedDate: string | null;
  confidence: number;
  imageData: string;
  isProcessing?: boolean;
  error?: string | null;
}

/**
 * Modal for confirming OCR results with confidence slider
 * Allows user to adjust confidence level and confirm or rescan
 */
export function OcrConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  onRescan,
  detectedDate,
  confidence,
  imageData,
  isProcessing = false,
  error = null,
}: OcrConfirmationModalProps) {
  const [adjustedConfidence, setAdjustedConfidence] = useState(confidence);

  // Validate detected date
  const validateDetectedDate = (date: string | null): { isValid: boolean; message?: string } => {
    if (!date) {
      return { isValid: false, message: "No date was detected in the image" };
    }

    const detectedDate = new Date(date);
    const now = new Date();
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(now.getFullYear() + 1);

    // Check if date is in the past (with 1 day buffer for timezone issues)
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    if (detectedDate < yesterday) {
      return { isValid: false, message: "Detected date appears to be in the past" };
    }

    // Check if date is too far in the future
    if (detectedDate > oneYearFromNow) {
      return { isValid: false, message: "Detected date seems too far in the future" };
    }

    return { isValid: true };
  };

  const dateValidation = validateDetectedDate(detectedDate);

  const handleConfirm = () => {
    if (detectedDate) {
      onConfirm(detectedDate, adjustedConfidence);
    }
    onClose();
  };

  const handleRescan = () => {
    onRescan();
    onClose();
  };

  const getConfidenceColor = (value: number) => {
    if (value >= 80) return "text-green-600";
    if (value >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getConfidenceLabel = (value: number) => {
    if (value >= 80) return "High Confidence";
    if (value >= 60) return "Medium Confidence";
    return "Low Confidence";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Expiration Date</DialogTitle>
          <DialogDescription>
            Review the detected expiration date from the photo. Adjust the confidence level if needed.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Error message */}
          {error && (
            <Card className="p-3 bg-red-50 border-red-200">
              <p className="text-sm text-red-800">❌ {error}</p>
            </Card>
          )}

          {/* Processing state */}
          {isProcessing && (
            <Card className="p-3 bg-blue-50 border-blue-200">
              <p className="text-sm text-blue-800">🔄 Processing image...</p>
            </Card>
          )}

          {/* Captured image preview */}
          <Card className="p-4">
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <img src={imageData} alt="" className="w-full h-full object-cover" />
            </div>
          </Card>

          {/* Detected date */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Detected Date</Label>
            <div
              className={`p-3 rounded-lg ${dateValidation.isValid ? "bg-gray-50" : "bg-red-50 border border-red-200"}`}
            >
              <p className="text-lg font-mono">
                {detectedDate ? new Date(detectedDate).toLocaleDateString() : "No date detected"}
              </p>
              {!dateValidation.isValid && dateValidation.message && (
                <p className="text-sm text-red-600 mt-1">⚠️ {dateValidation.message}</p>
              )}
            </div>
          </div>

          {/* Confidence slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium">Confidence Level</Label>
              <span className={`text-sm font-medium ${getConfidenceColor(adjustedConfidence)}`}>
                {adjustedConfidence}% - {getConfidenceLabel(adjustedConfidence)}
              </span>
            </div>
            <Slider
              value={[adjustedConfidence]}
              onValueChange={(value) => setAdjustedConfidence(value[0])}
              max={100}
              min={0}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Warning for low confidence */}
          {adjustedConfidence < 60 && (
            <Card className="p-3 bg-yellow-50 border-yellow-200">
              <p className="text-sm text-yellow-800">
                ⚠️ Low confidence detection. Consider rescanning or manually entering the date.
              </p>
            </Card>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleRescan} disabled={isProcessing}>
            Rescan
          </Button>
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!detectedDate || isProcessing}
            className="bg-green-600 hover:bg-green-700"
          >
            {isProcessing ? "Processing..." : "Confirm Date"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
