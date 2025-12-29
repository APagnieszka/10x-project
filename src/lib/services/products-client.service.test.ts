import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createProduct, getRecentProducts } from "./products-client.service";

describe("products-client.service", () => {
  let fetchMock: ReturnType<typeof vi.fn<Parameters<typeof fetch>, Promise<Response>>>;

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
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockProductResponse,
      } as unknown as Response);

      const result = await createProduct(mockProductData);

      expect(global.fetch).toHaveBeenCalledWith("/api/products", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mockProductData),
      });
      expect(result).toEqual(mockProductResponse);
    });

    it("supports legacy wrapped response shape", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ data: mockProductResponse }),
      } as unknown as Response);

      const result = await createProduct(mockProductData);
      expect(result).toEqual(mockProductResponse);
    });

    it("throws error when not logged in", async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ error: { message: "Missing credentials" } }),
      } as unknown as Response);

      await expect(createProduct(mockProductData)).rejects.toThrow("You must be logged in to add a product");
    });

    it("throws error on API failure", async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ error: { message: "API Error" } }),
      } as unknown as Response);

      await expect(createProduct(mockProductData)).rejects.toThrow("API Error");
    });

    it("throws error on network failure", async () => {
      fetchMock.mockRejectedValue(new Error("Network error"));

      await expect(createProduct(mockProductData)).rejects.toThrow("Network error");
    });

    it("handles malformed API response", async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => {
          throw new Error("Invalid JSON");
        },
      } as unknown as Response);

      await expect(createProduct(mockProductData)).rejects.toThrow("Failed to add product");
    });
  });

  describe("getRecentProducts", () => {
    it("fetches recent products successfully", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ data: mockProductsList }),
      } as unknown as Response);

      const result = await getRecentProducts(5);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/products?limit=5&sort=created_at&order=desc"),
        {
          method: "GET",
          credentials: "same-origin",
        }
      );
      expect(result).toEqual(mockProductsList);
    });

    it("uses default limit of 10 when not specified", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ data: mockProductsList }),
      } as unknown as Response);

      await getRecentProducts();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/products?limit=10&sort=created_at&order=desc"),
        {
          method: "GET",
          credentials: "same-origin",
        }
      );
    });

    it("throws error when not logged in", async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ error: { message: "Missing credentials" } }),
      } as unknown as Response);

      await expect(getRecentProducts()).rejects.toThrow("You must be logged in to fetch products");
    });

    it("throws error on API failure", async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ error: { message: "Fetch Error" } }),
      } as unknown as Response);

      await expect(getRecentProducts()).rejects.toThrow("Fetch Error");
    });

    it("returns empty array when API returns no data", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ data: null }),
      } as unknown as Response);

      const result = await getRecentProducts();

      expect(result).toEqual([]);
    });

    it("handles network errors", async () => {
      fetchMock.mockRejectedValue(new Error("Network failure"));

      await expect(getRecentProducts()).rejects.toThrow("Network failure");
    });
  });
});
