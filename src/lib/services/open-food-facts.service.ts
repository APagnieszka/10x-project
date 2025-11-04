/**
 * Service for integrating with Open Food Facts API
 * https://world.openfoodfacts.org/data
 */

interface OpenFoodFactsProduct {
  product_name?: string;
  brands?: string;
  image_url?: string;
  code?: string;
}

interface OpenFoodFactsResponse {
  status: number;
  status_verbose: string;
  product?: OpenFoodFactsProduct;
}

export interface ProductDataFromBarcode {
  name?: string;
  brand?: string;
  imageUrl?: string;
  barcode: string;
}

/**
 * Fetch product data from Open Food Facts API using barcode
 * @param barcode - The barcode to look up
 * @returns Product data if found, null if not found or error
 */
export async function fetchProductByBarcode(barcode: string): Promise<ProductDataFromBarcode | null> {
  try {
    const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`, {
      headers: {
        "User-Agent": "Foodzilla/1.0 (Food waste reduction app)",
      },
    });

    if (!response.ok) {
      return null;
    }

    const data: OpenFoodFactsResponse = await response.json();

    // Product not found
    if (data.status === 0 || !data.product) {
      return null;
    }

    const product = data.product;

    return {
      name: product.product_name || undefined,
      brand: product.brands || undefined,
      imageUrl: product.image_url || undefined,
      barcode,
    };
  } catch {
    // Network error or JSON parsing error
    return null;
  }
}

/**
 * Search for products by name in Open Food Facts
 * @param searchTerm - The product name to search for
 * @param limit - Maximum number of results (default 10)
 * @returns Array of product data
 */
export async function searchProductsByName(searchTerm: string, limit = 10): Promise<ProductDataFromBarcode[]> {
  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
        searchTerm
      )}&page_size=${limit}&json=1`,
      {
        headers: {
          "User-Agent": "Foodzilla/1.0 (Food waste reduction app)",
        },
      }
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();

    if (!data.products || !Array.isArray(data.products)) {
      return [];
    }

    return data.products
      .map((product: OpenFoodFactsProduct) => ({
        name: product.product_name || undefined,
        brand: product.brands || undefined,
        imageUrl: product.image_url || undefined,
        barcode: product.code || "",
      }))
      .filter((product: ProductDataFromBarcode) => product.name || product.brand);
  } catch {
    return [];
  }
}
