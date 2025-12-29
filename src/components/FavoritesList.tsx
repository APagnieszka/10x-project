"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getRecentProducts } from "@/lib/services/products-client.service";
import type { ProductDto } from "@/types";

interface FavoritesListProps {
  onSelectProduct: (product: ProductDto) => void;
  isVisible: boolean;
}

/**
 * FavoritesList component for quick product selection
 * Shows recently added products to speed up form filling
 */
export function FavoritesList({ onSelectProduct, isVisible }: FavoritesListProps) {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  // Check network connectivity
  const checkNetworkConnectivity = useCallback(async (): Promise<boolean> => {
    try {
      // Simple fetch to check connectivity
      const response = await fetch("/api/products?limit=1", {
        method: "HEAD",
        headers: { "Cache-Control": "no-cache" },
      });
      return response.ok || response.status === 401; // 401 is ok, means API is reachable but auth required
    } catch {
      return false;
    }
  }, []);

  // Exponential backoff delay calculation
  const getRetryDelay = useCallback((attempt: number): number => {
    return Math.min(1000 * Math.pow(2, attempt), 10000); // Max 10 seconds
  }, []);

  // Load recent products with retry logic
  const loadRecentProducts = useCallback(
    async (isRetry = false) => {
      if (isRetry) {
        setIsRetrying(true);
      } else {
        setIsLoading(true);
        setRetryCount(0);
      }
      setError(null);

      try {
        // Check network connectivity first
        const isOnline = await checkNetworkConnectivity();
        if (!isOnline) {
          throw new Error("Brak połączenia z internetem. Sprawdź sieć i spróbuj ponownie.");
        }

        const recentProducts = await getRecentProducts(10);
        setProducts(recentProducts);
        setRetryCount(0); // Reset on success
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Nie udało się wczytać ostatnich produktów";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
        setIsRetrying(false);
      }
    },
    [checkNetworkConnectivity]
  );

  // Retry with exponential backoff
  const retryWithBackoff = useCallback(async () => {
    const newRetryCount = retryCount + 1;
    setRetryCount(newRetryCount);

    if (newRetryCount > 3) {
      setError("Osiągnięto maksymalną liczbę prób. Spróbuj ponownie później.");
      return;
    }

    const delay = getRetryDelay(newRetryCount - 1);
    setTimeout(() => {
      loadRecentProducts(true);
    }, delay);
  }, [retryCount, getRetryDelay, loadRecentProducts]);

  // Load recent products when component becomes visible
  useEffect(() => {
    if (isVisible && products.length === 0) {
      loadRecentProducts();
    }
  }, [isVisible, products.length, loadRecentProducts]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "spoiled":
        return "bg-red-100 text-red-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const statusLabel = (status: string) => {
    if (status === "active") return "W lodówce";
    if (status === "draft") return "Szkic";
    if (status === "spoiled") return "Zepsute";
    return status;
  };

  if (!isVisible) return null;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Szybki wybór z ostatnich produktów</CardTitle>
        <CardDescription>Wybierz ostatnio dodane produkty, aby szybko uzupełnić formularz</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="text-center py-4">
            <p className="text-sm text-gray-600">Ładowanie ostatnich produktów...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-4">
            <p className="text-sm text-red-600 mb-2">{error}</p>
            <div className="flex gap-2 justify-center">
              {retryCount < 3 && (
                <Button variant="outline" size="sm" onClick={retryWithBackoff} disabled={isRetrying}>
                  {isRetrying ? "Ponawiam..." : `Spróbuj ponownie (${retryCount + 1}/3)`}
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => setError(null)}>
                Zamknij
              </Button>
            </div>
            {retryCount > 0 && retryCount < 3 && (
              <p className="text-xs text-gray-500 mt-2">
                Ponawiam za {Math.ceil(getRetryDelay(retryCount) / 1000)} s...
              </p>
            )}
          </div>
        )}

        {!isLoading && !error && products.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-gray-600">Brak ostatnich produktów</p>
            <p className="text-xs text-gray-500 mt-1">Najpierw dodaj produkty, aby pojawiły się tutaj</p>
          </div>
        )}

        {!isLoading && !error && products.length > 0 && (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {products.map((product) => (
              <Card
                key={product.id}
                className="cursor-pointer hover:bg-gray-50 transition-colors border-l-4 border-l-blue-500"
                onClick={() => onSelectProduct(product)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{product.name}</h3>
                      {product.brand && <p className="text-xs text-gray-600 mt-1">{product.brand}</p>}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {product.quantity} {product.unit}
                        </Badge>
                        <Badge className={`text-xs ${getStatusColor(product.status)}`}>
                          {statusLabel(product.status)}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Ważne do: {formatDate(product.expiration_date)}</p>
                    </div>
                    {product.main_image_url && (
                      <div className="ml-3">
                        <img
                          src={product.main_image_url}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && !error && products.length > 0 && (
          <div className="mt-4 text-center">
            <Button variant="outline" size="sm" onClick={() => loadRecentProducts()}>
              Odśwież listę
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
