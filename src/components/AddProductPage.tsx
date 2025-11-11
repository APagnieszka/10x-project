"use client";

import { useState, useCallback } from "react";
import { AddProductForm } from "./AddProductForm";
import { BarcodeScanner } from "./BarcodeScanner";
import { OcrScanner } from "./OcrScanner";
import { OcrConfirmationModal } from "./OcrConfirmationModal";
import { FavoritesList } from "./FavoritesList";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { fetchProductByBarcode } from "@/lib/services/open-food-facts.service";
import { useToast } from "./Toast";
import type { CreateProductCommand, ProductDto } from "@/types";

type ViewState = "form" | "barcode" | "ocr" | "favorites";

interface AddProductPageProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

/**
 * Main AddProductPage component that orchestrates all subcomponents
 * Manages the overall state and navigation between different views
 */
export function AddProductPage({ onSuccess, onCancel }: AddProductPageProps) {
  const [currentView, setCurrentView] = useState<ViewState>("form");
  const [formData, setFormData] = useState<Partial<CreateProductCommand>>({
    status: "draft",
    opened: false,
    to_buy: false,
  });
  const [ocrImageData, setOcrImageData] = useState<string>("");
  const [ocrResult, setOcrResult] = useState<{
    detectedDate: string | null;
    confidence: number;
  } | null>(null);
  const [_isLoadingProductData, setIsLoadingProductData] = useState(false);
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);

  const { success: showSuccessToast, error: showErrorToast } = useToast();

  // Handle barcode detection and Open Food Facts lookup
  const handleBarcodeDetected = useCallback(
    async (barcode: string) => {
      setCurrentView("form");
      setIsLoadingProductData(true);

      try {
        showSuccessToast("Barcode Scanned", `Looking up product information...`);

        const productData = await fetchProductByBarcode(barcode);

        if (productData) {
          // Populate form with fetched data
          setFormData((prev) => ({
            ...prev,
            name: productData.name || prev.name,
            brand: productData.brand || prev.brand,
            barcode: productData.barcode,
            main_image_url: productData.imageUrl || prev.main_image_url,
          }));

          showSuccessToast("Product Found", `Filled form with data for ${productData.name || "product"}`);
        } else {
          // No product found, just set the barcode
          setFormData((prev) => ({
            ...prev,
            barcode,
          }));

          showErrorToast(
            "Product Not Found",
            "Barcode scanned but no product data available. Please fill in the details manually."
          );
        }
      } catch {
        // Still set the barcode even if lookup fails
        setFormData((prev) => ({
          ...prev,
          barcode,
        }));

        showErrorToast(
          "Lookup Failed",
          "Barcode scanned but couldn't fetch product data. Please fill in the details manually."
        );
      } finally {
        setIsLoadingProductData(false);
      }
    },
    [showSuccessToast, showErrorToast]
  );

  // Handle OCR photo capture
  const handlePhotoTaken = useCallback((imageData: string) => {
    setOcrImageData(imageData);
    setIsOcrProcessing(true);

    // Simulate OCR processing (in real implementation, this would call an OCR service)
    setTimeout(() => {
      // Mock OCR result - in real implementation, this would come from Tesseract.js or an API
      const mockResult = {
        detectedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 7 days from now
        confidence: 85,
      };

      setOcrResult(mockResult);
      setIsOcrProcessing(false);
    }, 2000);
  }, []);

  // Handle OCR confirmation
  const handleOcrConfirm = useCallback(
    (detectedDate: string, _confidence: number) => {
      setFormData((prev) => ({
        ...prev,
        expiration_date: detectedDate,
      }));

      setCurrentView("form");
      showSuccessToast("Date Confirmed", `Expiration date set to ${new Date(detectedDate).toLocaleDateString()}`);
    },
    [showSuccessToast]
  );

  // Handle OCR rescan
  const handleOcrRescan = useCallback(() => {
    setOcrImageData("");
    setOcrResult(null);
    setCurrentView("ocr");
  }, []);

  // Handle product selection from favorites
  const handleProductSelect = useCallback(
    (product: ProductDto) => {
      setFormData({
        name: product.name,
        brand: product.brand,
        barcode: product.barcode,
        quantity: product.quantity,
        unit: product.unit as "kg" | "g" | "l" | "ml" | "pcs",
        expiration_date: product.expiration_date,
        status: product.status as "draft" | "active" | "spoiled",
        opened: product.opened,
        to_buy: product.to_buy,
        opened_date: product.opened_date,
        main_image_url: product.main_image_url,
      });

      setCurrentView("form");
      setShowFavorites(false);
      showSuccessToast("Product Selected", `Form filled with ${product.name}`);
    },
    [showSuccessToast]
  );

  // Handle successful form submission
  const handleFormSuccess = useCallback(() => {
    // Reset form data
    setFormData({
      status: "draft",
      opened: false,
      to_buy: false,
    });

    // Reset OCR state
    setOcrImageData("");
    setOcrResult(null);

    onSuccess?.();
  }, [onSuccess]);

  // Navigation handlers
  const handleScanBarcode = useCallback(() => setCurrentView("barcode"), []);
  const handleTakePhoto = useCallback(() => setCurrentView("ocr"), []);
  const handleShowFavorites = useCallback(() => setShowFavorites(true), []);

  // Cancel handlers
  const handleBarcodeCancel = useCallback(() => setCurrentView("form"), []);
  const handleOcrCancel = useCallback(() => setCurrentView("form"), []);
  const handleOcrModalClose = useCallback(() => {
    setOcrImageData("");
    setOcrResult(null);
  }, []);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Add New Product</h1>
          <p className="text-muted-foreground mt-2">
            Add a new product to your household inventory using barcode scanning, photo recognition, or manual entry.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content area */}
          <div className="lg:col-span-2">
            {currentView === "form" && (
              <div className="space-y-6">
                {/* Action buttons */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                    <CardDescription>Use these tools to quickly fill in product information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      <Button onClick={handleScanBarcode} variant="outline" className="flex-1 min-w-0">
                        📱 Scan Barcode
                      </Button>
                      <Button onClick={handleTakePhoto} variant="outline" className="flex-1 min-w-0">
                        📷 Take Date Photo
                      </Button>
                      <Button onClick={handleShowFavorites} variant="outline" className="flex-1 min-w-0">
                        ⭐ Quick Select
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Product form */}
                <AddProductForm
                  initialData={formData}
                  onSuccess={handleFormSuccess}
                  onCancel={onCancel}
                  toast={{ success: showSuccessToast, error: showErrorToast }}
                />
              </div>
            )}

            {currentView === "barcode" && (
              <BarcodeScanner
                onBarcodeDetected={handleBarcodeDetected}
                onCancel={handleBarcodeCancel}
                toast={{ success: showSuccessToast, error: showErrorToast }}
              />
            )}

            {currentView === "ocr" && <OcrScanner onPhotoTaken={handlePhotoTaken} onCancel={handleOcrCancel} />}
          </div>

          {/* Sidebar with favorites */}
          <div className="lg:col-span-1">
            <FavoritesList onSelectProduct={handleProductSelect} isVisible={showFavorites} />
          </div>
        </div>

        {/* OCR Confirmation Modal */}
        <OcrConfirmationModal
          isOpen={!!ocrResult && currentView === "form"}
          onClose={handleOcrModalClose}
          onConfirm={handleOcrConfirm}
          onRescan={handleOcrRescan}
          detectedDate={ocrResult?.detectedDate || null}
          confidence={ocrResult?.confidence || 0}
          imageData={ocrImageData}
          isProcessing={isOcrProcessing}
        />
      </div>
    </div>
  );
}
