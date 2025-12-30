import { useState, useCallback } from "react";
import { createProduct } from "@/lib/services/products-client.service";
import type { CreateProductCommand, ProductDto } from "@/types";

interface UseProductFormResult {
  isSubmitting: boolean;
  error: string | null;
  success: boolean;
  submitProduct: (data: CreateProductCommand) => Promise<ProductDto | null>;
  clearError: () => void;
  clearSuccess: () => void;
}

interface ToastFunctions {
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
}

/**
 * Custom hook for handling product form submission
 * Manages submission state, error handling, and API integration
 */
export function useProductForm(toast?: ToastFunctions): UseProductFormResult {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitProduct = useCallback(
    async (data: CreateProductCommand): Promise<ProductDto | null> => {
      setIsSubmitting(true);
      setError(null);
      setSuccess(false);

      try {
        const result = await createProduct(data);
        setSuccess(true);
        toast?.success("Produkt dodany!", `${result.name} został dodany do spiżarni.`);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Wystąpił nieoczekiwany błąd";
        setError(errorMessage);
        toast?.error("Nie udało się dodać produktu", errorMessage);
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [toast]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearSuccess = useCallback(() => {
    setSuccess(false);
  }, []);

  return {
    isSubmitting,
    error,
    success,
    submitProduct,
    clearError,
    clearSuccess,
  };
}
