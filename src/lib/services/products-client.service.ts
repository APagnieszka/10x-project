import type { CreateProductCommand, ProductDto } from "@/types";

/**
 * Create a new product
 * @param productData - Product data to create
 * @returns Created product
 * @throws Error if creation fails
 */
export async function createProduct(productData: CreateProductCommand): Promise<ProductDto> {
  // Submit the product data
  const response = await fetch("/api/products", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });

  if (response.status === 401) {
    throw new Error("You must be logged in to add a product");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: { message: "Failed to add product" } }));
    throw new Error(errorData.error?.message || "Failed to add product");
  }

  const result: unknown = await response.json();

  // POST /api/products currently returns the product directly (not wrapped in { data: ... }).
  // Keep compatibility with both shapes.
  const maybeWrapped = result as { data?: unknown } | null;
  const product =
    maybeWrapped && typeof maybeWrapped === "object" && "data" in maybeWrapped ? maybeWrapped.data : result;

  if (!product || typeof product !== "object") {
    throw new Error("Failed to add product");
  }

  return product as ProductDto;
}

/**
 * Get recent products for quick selection
 * @param limit - Number of recent products to fetch (default: 10)
 * @returns Array of recent products
 * @throws Error if fetch fails
 */
export async function getRecentProducts(limit = 10, status?: ProductDto["status"]): Promise<ProductDto[]> {
  // Fetch recent products
  const url = new URL("/api/products", window.location.origin);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("sort", "created_at");
  url.searchParams.set("order", "desc");
  if (status) url.searchParams.set("status", status);

  const response = await fetch(url.toString(), {
    method: "GET",
    credentials: "same-origin",
  });

  if (response.status === 401) {
    throw new Error("You must be logged in to fetch products");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: { message: "Failed to fetch recent products" } }));
    throw new Error(errorData.error?.message || "Failed to fetch recent products");
  }

  const result = await response.json();
  return result.data || [];
}

/**
 * Get recent products with optional status and to_buy filtering.
 * This is a thin wrapper over GET /api/products.
 */
export async function getRecentProductsFiltered(
  limit = 10,
  options?: { status?: ProductDto["status"]; to_buy?: boolean }
): Promise<ProductDto[]> {
  const { status, to_buy } = options ?? {};

  const url = new URL("/api/products", window.location.origin);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("sort", "created_at");
  url.searchParams.set("order", "desc");
  if (status) url.searchParams.set("status", status);
  if (typeof to_buy === "boolean") url.searchParams.set("to_buy", String(to_buy));

  const response = await fetch(url.toString(), {
    method: "GET",
    credentials: "same-origin",
  });

  if (response.status === 401) {
    throw new Error("You must be logged in to fetch products");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: { message: "Failed to fetch recent products" } }));
    throw new Error(errorData.error?.message || "Failed to fetch recent products");
  }

  const result = await response.json();
  return result.data || [];
}

export async function markProductSpoiled(productId: number): Promise<ProductDto> {
  const response = await fetch(`/api/products/${productId}`, {
    method: "PATCH",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action: "spoiled" }),
  });

  if (response.status === 401) {
    throw new Error("You must be logged in to update a product");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: { message: "Failed to update product" } }));
    throw new Error(errorData.error?.message || "Failed to update product");
  }

  const result: unknown = await response.json();
  const dataWrapped = result as { data?: unknown } | null;
  const product = dataWrapped && typeof dataWrapped === "object" && "data" in dataWrapped ? dataWrapped.data : result;

  if (!product || typeof product !== "object") {
    throw new Error("Failed to update product");
  }

  return product as ProductDto;
}

export async function markProductOpened(productId: number): Promise<ProductDto> {
  const response = await fetch(`/api/products/${productId}`, {
    method: "PATCH",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action: "opened", opened_date: new Date().toISOString() }),
  });

  if (response.status === 401) {
    throw new Error("You must be logged in to update a product");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: { message: "Failed to update product" } }));
    throw new Error(errorData.error?.message || "Failed to update product");
  }

  const result: unknown = await response.json();
  const dataWrapped = result as { data?: unknown } | null;
  const product = dataWrapped && typeof dataWrapped === "object" && "data" in dataWrapped ? dataWrapped.data : result;

  if (!product || typeof product !== "object") {
    throw new Error("Failed to update product");
  }

  return product as ProductDto;
}

export async function deleteProduct(productId: number): Promise<void> {
  const response = await fetch(`/api/products/${productId}`, {
    method: "DELETE",
    credentials: "same-origin",
  });

  if (response.status === 401) {
    throw new Error("You must be logged in to delete a product");
  }

  if (response.status === 204) return;

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: { message: "Failed to delete product" } }));
    throw new Error(errorData.error?.message || "Failed to delete product");
  }
}
