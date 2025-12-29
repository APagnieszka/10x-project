import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useProductForm } from "../hooks/useProductForm";

// Mock the products client service
vi.mock("@/lib/services/products-client.service", () => ({
  createProduct: vi.fn(),
}));

import { createProduct } from "@/lib/services/products-client.service";

const mockCreateProduct = vi.mocked(createProduct);

describe("useProductForm", () => {
  const mockProductData = {
    name: "Test Product",
    brand: "Test Brand",
    barcode: "123456789",
    quantity: 1,
    unit: "pcs" as const,
    expiration_date: "2025-12-15",
    status: "active" as const,
    opened: false,
    to_buy: false,
  };

  const mockProductResponse = {
    id: 1,
    household_id: 1,
    ...mockProductData,
    created_at: "2025-11-04T10:00:00Z",
    main_image_url: undefined,
    images: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initializes with correct default state", () => {
    const { result } = renderHook(() => useProductForm());

    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.success).toBe(false);
  });

  it("submits product successfully and shows success state", async () => {
    mockCreateProduct.mockResolvedValue(mockProductResponse);

    const { result } = renderHook(() => useProductForm());

    let submitResult: typeof mockProductResponse | null = null;

    await act(async () => {
      submitResult = await result.current.submitProduct(mockProductData);
    });

    expect(mockCreateProduct).toHaveBeenCalledWith(mockProductData);
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.success).toBe(true);
    expect(submitResult).toEqual(mockProductResponse);
  });

  it("handles submission error and shows error state", async () => {
    const errorMessage = "Failed to add product";
    mockCreateProduct.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useProductForm());

    let submitResult: typeof mockProductResponse | null = null;

    await act(async () => {
      submitResult = await result.current.submitProduct(mockProductData);
    });

    expect(mockCreateProduct).toHaveBeenCalledWith(mockProductData);
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.success).toBe(false);
    expect(submitResult).toBe(null);
  });

  it("sets submitting state during submission", async () => {
    mockCreateProduct.mockImplementation(
      () => new Promise<typeof mockProductResponse>((resolve) => setTimeout(() => resolve(mockProductResponse), 100))
    );

    const { result } = renderHook(() => useProductForm());

    act(() => {
      result.current.submitProduct(mockProductData);
    });

    expect(result.current.isSubmitting).toBe(true);
    expect(result.current.error).toBe(null);
    expect(result.current.success).toBe(false);

    await waitFor(() => {
      expect(result.current.isSubmitting).toBe(false);
    });
  });

  it("clears error when clearError is called", async () => {
    mockCreateProduct.mockRejectedValue(new Error("Test error"));

    const { result } = renderHook(() => useProductForm());

    await act(async () => {
      await result.current.submitProduct(mockProductData);
    });

    expect(result.current.error).toBe("Test error");

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBe(null);
  });

  it("clears success when clearSuccess is called", async () => {
    mockCreateProduct.mockResolvedValue(mockProductResponse);

    const { result } = renderHook(() => useProductForm());

    await act(async () => {
      await result.current.submitProduct(mockProductData);
    });

    expect(result.current.success).toBe(true);

    act(() => {
      result.current.clearSuccess();
    });

    expect(result.current.success).toBe(false);
  });

  it("handles generic error objects", async () => {
    mockCreateProduct.mockRejectedValue("String error");

    const { result } = renderHook(() => useProductForm());

    await act(async () => {
      await result.current.submitProduct(mockProductData);
    });

    expect(result.current.error).toBe("An unexpected error occurred");
  });

  it("resets state on new submission", async () => {
    mockCreateProduct.mockRejectedValueOnce(new Error("First error"));
    mockCreateProduct.mockResolvedValueOnce(mockProductResponse);

    const { result } = renderHook(() => useProductForm());

    // First submission fails
    await act(async () => {
      await result.current.submitProduct(mockProductData);
    });

    expect(result.current.error).toBe("First error");
    expect(result.current.success).toBe(false);

    // Second submission succeeds
    await act(async () => {
      await result.current.submitProduct(mockProductData);
    });

    expect(result.current.error).toBe(null);
    expect(result.current.success).toBe(true);
  });
});
