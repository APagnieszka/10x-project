import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createProduct, getRecentProducts } from "./products-client.service";

// Mock Supabase client
vi.mock("@/db/supabase.client", () => ({
  supabaseClient: {
    auth: {
      getSession: vi.fn(),
    },
  },
}));

import { supabaseClient } from "@/db/supabase.client";

const mockSupabaseClient = vi.mocked(supabaseClient);

describe("products-client.service", () => {
  let fetchMock: ReturnType<typeof vi.fn<Parameters<typeof fetch>, Promise<Response>>>;

  const mockSession = {
    data: {
      session: {
        access_token: "mock-token",
      },
    },
    error: null,
  };

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

  const mockProductsList = [
    {
      id: 1,
      household_id: 1,
      name: "Product 1",
      brand: "Brand 1",
      barcode: "111111",
      quantity: 1,
      unit: "pcs",
      expiration_date: "2025-12-15",
      status: "active" as const,
      opened: false,
      to_buy: false,
      created_at: "2025-11-01T10:00:00Z",
      main_image_url: undefined,
    },
    {
      id: 2,
      household_id: 1,
      name: "Product 2",
      brand: undefined,
      barcode: undefined,
      quantity: 2,
      unit: "kg",
      expiration_date: "2025-12-20",
      status: "active" as const,
      opened: false,
      to_buy: true,
      created_at: "2025-11-02T10:00:00Z",
      main_image_url: "https://example.com/image.jpg",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock fetch globally
    fetchMock = vi.fn<Parameters<typeof fetch>, Promise<Response>>();
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("createProduct", () => {
    it("creates product successfully", async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue(mockSession);
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => mockProductResponse,
      } as unknown as Response);

      const result = await createProduct(mockProductData);

      expect(mockSupabaseClient.auth.getSession).toHaveBeenCalled();
      expect(global.fetch).toHaveBeenCalledWith("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mockSession.data.session.access_token}`,
        },
        body: JSON.stringify(mockProductData),
      });
      expect(result).toEqual(mockProductResponse);
    });

    it("supports legacy wrapped response shape", async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue(mockSession);
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({ data: mockProductResponse }),
      } as unknown as Response);

      const result = await createProduct(mockProductData);
      expect(result).toEqual(mockProductResponse);
    });

    it("throws error when not logged in", async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({ data: { session: null }, error: null });

      await expect(createProduct(mockProductData)).rejects.toThrow("You must be logged in to add a product");
    });

    it("throws error on API failure", async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue(mockSession);
      fetchMock.mockResolvedValue({
        ok: false,
        json: async () => ({ error: { message: "API Error" } }),
      } as unknown as Response);

      await expect(createProduct(mockProductData)).rejects.toThrow("API Error");
    });

    it("throws error on network failure", async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue(mockSession);
      fetchMock.mockRejectedValue(new Error("Network error"));

      await expect(createProduct(mockProductData)).rejects.toThrow("Network error");
    });

    it("handles malformed API response", async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue(mockSession);
      fetchMock.mockResolvedValue({
        ok: false,
        json: async () => {
          throw new Error("Invalid JSON");
        },
      } as unknown as Response);

      await expect(createProduct(mockProductData)).rejects.toThrow("Failed to add product");
    });
  });

  describe("getRecentProducts", () => {
    it("fetches recent products successfully", async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue(mockSession);
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({ data: mockProductsList }),
      } as unknown as Response);

      const result = await getRecentProducts(5);

      expect(mockSupabaseClient.auth.getSession).toHaveBeenCalled();
      expect(global.fetch).toHaveBeenCalledWith("/api/products?limit=5&sort=created_at&order=desc", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${mockSession.data.session.access_token}`,
        },
      });
      expect(result).toEqual(mockProductsList);
    });

    it("uses default limit of 10 when not specified", async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue(mockSession);
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({ data: mockProductsList }),
      } as unknown as Response);

      await getRecentProducts();

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/products?limit=10&sort=created_at&order=desc",
        expect.any(Object)
      );
    });

    it("throws error when not logged in", async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({ data: { session: null }, error: null });

      await expect(getRecentProducts()).rejects.toThrow("You must be logged in to fetch products");
    });

    it("throws error on API failure", async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue(mockSession);
      fetchMock.mockResolvedValue({
        ok: false,
        json: async () => ({ error: { message: "Fetch Error" } }),
      } as unknown as Response);

      await expect(getRecentProducts()).rejects.toThrow("Fetch Error");
    });

    it("returns empty array when API returns no data", async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue(mockSession);
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({ data: null }),
      } as unknown as Response);

      const result = await getRecentProducts();

      expect(result).toEqual([]);
    });

    it("handles network errors", async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue(mockSession);
      fetchMock.mockRejectedValue(new Error("Network failure"));

      await expect(getRecentProducts()).rejects.toThrow("Network failure");
    });
  });
});
