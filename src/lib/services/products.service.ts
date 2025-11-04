import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../db/database.types.ts";
import type { ProductDto } from "../../types.ts";
import type { CreateProductInput } from "../validation/products.ts";

export class ProductsService {
  constructor(private supabase: SupabaseClient<Database>) {}

  /**
   * Get household ID for the authenticated user
   */
  private async getHouseholdId(userId: string): Promise<number> {
    const { data, error } = await this.supabase
      .from("user_households")
      .select("household_id")
      .eq("user_id", userId)
      .single();

    if (error || !data) {
      throw new Error("User is not a member of any household");
    }

    return data.household_id;
  }

  /**
   * Check if barcode is unique within the household
   */
  private async isBarcodeUnique(householdId: number, barcode: string | null): Promise<boolean> {
    if (!barcode) return true;

    const { data, error } = await this.supabase
      .from("products")
      .select("id")
      .eq("household_id", householdId)
      .eq("barcode", barcode)
      .limit(1);

    if (error) {
      throw new Error("Failed to check barcode uniqueness");
    }

    return data.length === 0;
  }

  /**
   * Create a new product
   */
  async createProduct(userId: string, input: CreateProductInput): Promise<ProductDto> {
    // Get household ID for the user
    const householdId = await this.getHouseholdId(userId);

    // Check barcode uniqueness
    if (!(await this.isBarcodeUnique(householdId, input.barcode || null))) {
      throw new Error("Barcode already exists for this household");
    }

    // Prepare product data
    const productData = {
      household_id: householdId,
      name: input.name,
      brand: input.brand || null,
      barcode: input.barcode || null,
      quantity: input.quantity,
      unit: input.unit,
      expiration_date: input.expiration_date,
      status: input.status || "draft",
      opened: input.opened || false,
      to_buy: input.to_buy || false,
      opened_date: input.opened_date || null,
      main_image_url: input.main_image_url || null,
    };

    // Insert product
    const { data, error } = await this.supabase.from("products").insert(productData).select().single();

    if (error) {
      throw new Error(`Failed to create product: ${error.message}`);
    }

    // Return formatted product DTO
    return {
      id: data.id,
      household_id: data.household_id,
      name: data.name,
      brand: data.brand || undefined,
      barcode: data.barcode || undefined,
      quantity: data.quantity,
      unit: data.unit,
      expiration_date: data.expiration_date,
      status: data.status as "draft" | "active" | "spoiled",
      opened: data.opened,
      to_buy: data.to_buy,
      opened_date: data.opened_date || undefined,
      created_at: data.created_at,
      main_image_url: data.main_image_url || undefined,
    };
  }
}
