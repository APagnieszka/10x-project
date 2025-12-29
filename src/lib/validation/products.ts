import { z } from "zod";

// Product validation schemas
export const createProductSchema = z
  .object({
    name: z.string().min(1, "Nazwa jest wymagana").max(255, "Nazwa nie może mieć więcej niż 255 znaków"),
    brand: z.string().max(255, "Marka nie może mieć więcej niż 255 znaków").optional(),
    barcode: z.string().max(255, "Kod kreskowy nie może mieć więcej niż 255 znaków").optional(),
    quantity: z.number().positive("Ilość musi być większa od 0"),
    unit: z.enum(["kg", "g", "l", "ml", "pcs"], {
      errorMap: () => ({ message: "Jednostka musi być jedną z: kg, g, l, ml, pcs" }),
    }),
    expiration_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Data ważności musi być w formacie RRRR-MM-DD")
      .refine((date) => {
        const parsedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to start of today
        return !isNaN(parsedDate.getTime()) && parsedDate >= today;
      }, "Data ważności musi być dzisiaj lub w przyszłości"),
    status: z.enum(["draft", "active", "spoiled"]).optional().default("draft"),
    opened: z.boolean().optional().default(false),
    to_buy: z.boolean().optional().default(false),
    opened_date: z.string().optional(),
    main_image_url: z.preprocess((value) => {
      if (typeof value !== "string") return value;
      const trimmed = value.trim();
      return trimmed.length === 0 ? undefined : trimmed;
    }, z.string().url("URL głównego zdjęcia musi być poprawnym adresem URL").optional()),
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
      message: "Data otwarcia jest wymagana, gdy produkt jest oznaczony jako otwarty",
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
      message: "Data otwarcia musi być poprawnym znacznikiem czasu ISO 8601",
      path: ["opened_date"],
    }
  );

export type CreateProductInput = z.infer<typeof createProductSchema>;
