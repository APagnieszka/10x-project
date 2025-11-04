import { z } from "zod";

// Product validation schemas
export const createProductSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(255, "Name must be less than 255 characters"),
    brand: z.string().max(255, "Brand must be less than 255 characters").optional(),
    barcode: z.string().max(255, "Barcode must be less than 255 characters").optional(),
    quantity: z.number().positive("Quantity must be greater than 0"),
    unit: z.enum(["kg", "g", "l", "ml", "pcs"], {
      errorMap: () => ({ message: "Unit must be one of: kg, g, l, ml, pcs" }),
    }),
    expiration_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Expiration date must be in YYYY-MM-DD format")
      .refine((date) => {
        const parsedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to start of today
        return !isNaN(parsedDate.getTime()) && parsedDate >= today;
      }, "Expiration date must be today or a future date"),
    status: z.enum(["draft", "active", "spoiled"]).optional().default("draft"),
    opened: z.boolean().optional().default(false),
    to_buy: z.boolean().optional().default(false),
    opened_date: z.string().optional(),
    main_image_url: z.string().url("Main image URL must be a valid URL").optional(),
  })
  .refine(
    (data) => {
      // If opened is true, opened_date is required
      if (data.opened && !data.opened_date) {
        return false;
      }
      return true;
    },
    {
      message: "Opened date is required when product is marked as opened",
      path: ["opened_date"],
    }
  )
  .refine(
    (data) => {
      // If opened_date is provided, it should be a valid ISO timestamp
      if (data.opened_date) {
        const parsedDate = new Date(data.opened_date);
        return !isNaN(parsedDate.getTime());
      }
      return true;
    },
    {
      message: "Opened date must be a valid ISO 8601 timestamp",
      path: ["opened_date"],
    }
  );

export type CreateProductInput = z.infer<typeof createProductSchema>;
