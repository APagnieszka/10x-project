"use client";

import { useState, useCallback, useEffect } from "react";
import { AddProductForm } from "./AddProductForm";
import { BarcodeScanner } from "./BarcodeScanner";
import { FavoritesList } from "./FavoritesList";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { fetchProductByBarcode } from "@/lib/services/open-food-facts.service";
import { useToast } from "./Toast";
import type { CreateProductCommand, ProductDto } from "@/types";

type ViewState = "form" | "barcode" | "favorites";

interface AddProductPageProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

/**
 * Main AddProductPage component that orchestrates all subcomponents
 * Manages the overall state and navigation between different views
 */
export function AddProductPage({ onSuccess, onCancel }: AddProductPageProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>("form");
  const [formData, setFormData] = useState<Partial<CreateProductCommand>>({
    status: "draft",
    opened: false,
    to_buy: false,
  });
  const [_isLoadingProductData, setIsLoadingProductData] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);

  const { success: showSuccessToast, error: showErrorToast } = useToast();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Handle barcode detection and Open Food Facts lookup
  const handleBarcodeDetected = useCallback(
    async (barcode: string) => {
      setCurrentView("form");
      setIsLoadingProductData(true);

      try {
        showSuccessToast("Kod zeskanowany", "Wyszukuję informacje o produkcie...");

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

          showSuccessToast("Znaleziono produkt", `Uzupełniono formularz danymi: ${productData.name || "produkt"}`);
        } else {
          // No product found, just set the barcode
          setFormData((prev) => ({
            ...prev,
            barcode,
          }));

          showErrorToast(
            "Nie znaleziono produktu",
            "Zeskanowano kod, ale brak danych o produkcie. Uzupełnij szczegóły ręcznie."
          );
        }
      } catch {
        // Still set the barcode even if lookup fails
        setFormData((prev) => ({
          ...prev,
          barcode,
        }));

        showErrorToast(
          "Nie udało się wyszukać",
          "Zeskanowano kod, ale nie udało się pobrać danych produktu. Uzupełnij szczegóły ręcznie."
        );
      } finally {
        setIsLoadingProductData(false);
      }
    },
    [showSuccessToast, showErrorToast]
  );

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
      showSuccessToast("Wybrano produkt", `Uzupełniono formularz: ${product.name}`);
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

    onSuccess?.();
  }, [onSuccess]);

  // Navigation handlers
  const handleScanBarcode = useCallback(() => setCurrentView("barcode"), []);
  const handleShowFavorites = useCallback(() => setShowFavorites(true), []);

  // Cancel handlers
  const handleBarcodeCancel = useCallback(() => setCurrentView("form"), []);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8" data-hydrated={isHydrated ? "true" : "false"}>
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Dodaj nowy produkt</h1>
          <p className="text-muted-foreground mt-2">
            Dodaj nowy produkt do domowej spiżarni, skanując kod kreskowy albo wpisując dane ręcznie.
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
                    <CardTitle className="text-lg">Szybkie akcje</CardTitle>
                    <CardDescription>Użyj tych narzędzi, aby szybko uzupełnić informacje o produkcie</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      <Button onClick={handleScanBarcode} variant="outline" className="flex-1 min-w-0">
                        📱 Skanuj kod kreskowy
                      </Button>
                      <Button onClick={handleShowFavorites} variant="outline" className="flex-1 min-w-0">
                        ⭐ Szybki wybór
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
          </div>

          {/* Sidebar with favorites */}
          <div className="lg:col-span-1">
            <FavoritesList onSelectProduct={handleProductSelect} isVisible={showFavorites} />
          </div>
        </div>
      </div>
    </div>
  );
}
