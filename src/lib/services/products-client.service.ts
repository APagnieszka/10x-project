import { supabaseClient } from "@/db/supabase.client";
import type { CreateProductCommand, ProductDto } from "@/types";

/**
 * Create a new product
 * @param productData - Product data to create
 * @returns Created product
 * @throws Error if creation fails
 */
export async function createProduct(productData: CreateProductCommand): Promise<ProductDto> {
  // Get the current session
  const { data: sessionData, error: sessionError } = await supabaseClient.auth.getSession();

  if (sessionError || !sessionData.session) {
    throw new Error("You must be logged in to add a product");
  }

  const token = sessionData.session.access_token;

  // Submit the product data
  const response = await fetch("/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: { message: "Failed to add product" } }));
    throw new Error(errorData.error?.message || "Failed to add product");
  }

  const result = await response.json();
  return result.data;
}

/**
 * Get recent products for quick selection
 * @param limit - Number of recent products to fetch (default: 10)
 * @returns Array of recent products
 * @throws Error if fetch fails
 */
export async function getRecentProducts(limit = 10): Promise<ProductDto[]> {
  // Get the current session
  const { data: sessionData, error: sessionError } = await supabaseClient.auth.getSession();

  if (sessionError || !sessionData.session) {
    throw new Error("You must be logged in to fetch products");
  }

  const token = sessionData.session.access_token;

  // Fetch recent products
  const response = await fetch(`/api/products?limit=${limit}&sort=created_at&order=desc`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: { message: "Failed to fetch recent products" } }));
    throw new Error(errorData.error?.message || "Failed to fetch recent products");
  }

  const result = await response.json();
  return result.data || [];
}
