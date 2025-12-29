import { describe, expect, it } from "vitest";

import { createProductSchema } from "./products";

function formatDateYYYYMMDD(date: Date): string {
  return date.toISOString().slice(0, 10);
}

describe("createProductSchema", () => {
  describe("valid inputs", () => {
    it("should validate a complete valid product", () => {
      const future = new Date();
      future.setDate(future.getDate() + 7);

      const validProduct = {
        name: "Milk",
        brand: "Dairy Farm",
        barcode: "1234567890",
        quantity: 1.5,
        unit: "l",
        expiration_date: formatDateYYYYMMDD(future),
        status: "active",
        opened: false,
        to_buy: false,
        main_image_url: "https://example.com/image.jpg",
      };

      const result = createProductSchema.safeParse(validProduct);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("Milk");
        expect(result.data.quantity).toBe(1.5);
        expect(result.data.status).toBe("active");
      }
    });

    it("should validate minimal required fields", () => {
      const future = new Date();
      future.setDate(future.getDate() + 7);

      const minimalProduct = {
        name: "Bread",
        quantity: 2,
        unit: "pcs",
        expiration_date: formatDateYYYYMMDD(future),
      };

      const result = createProductSchema.safeParse(minimalProduct);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.status).toBe("draft"); // default value
        expect(result.data.opened).toBe(false); // default value
        expect(result.data.to_buy).toBe(false); // default value
      }
    });

    it("should accept all valid units", () => {
      const units = ["kg", "g", "l", "ml", "pcs"];

      const future = new Date();
      future.setDate(future.getDate() + 7);
      const expiration_date = formatDateYYYYMMDD(future);

      units.forEach((unit) => {
        const product = {
          name: "Test Product",
          quantity: 1,
          unit,
          expiration_date,
        };

        const result = createProductSchema.safeParse(product);
        expect(result.success).toBe(true);
      });
    });

    it("should accept all valid statuses", () => {
      const statuses = ["draft", "active", "spoiled"];

      const future = new Date();
      future.setDate(future.getDate() + 7);
      const expiration_date = formatDateYYYYMMDD(future);

      statuses.forEach((status) => {
        const product = {
          name: "Test Product",
          quantity: 1,
          unit: "pcs",
          expiration_date,
          status,
        };

        const result = createProductSchema.safeParse(product);
        expect(result.success).toBe(true);
      });
    });

    it("should validate product with opened=true and opened_date", () => {
      const future = new Date();
      future.setDate(future.getDate() + 7);

      const product = {
        name: "Yogurt",
        quantity: 1,
        unit: "pcs",
        expiration_date: formatDateYYYYMMDD(future),
        opened: true,
        opened_date: new Date().toISOString(),
      };

      const result = createProductSchema.safeParse(product);
      expect(result.success).toBe(true);
    });
  });

  describe("invalid inputs", () => {
    it("should reject missing required fields", () => {
      const invalidProduct = {
        name: "Test",
      };

      const result = createProductSchema.safeParse(invalidProduct);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });

    it("should reject empty name", () => {
      const future = new Date();
      future.setDate(future.getDate() + 7);

      const product = {
        name: "",
        quantity: 1,
        unit: "pcs",
        expiration_date: formatDateYYYYMMDD(future),
      };

      const result = createProductSchema.safeParse(product);
      expect(result.success).toBe(false);
      if (!result.success) {
        const nameError = result.error.issues.find((issue) => issue.path[0] === "name");
        expect(nameError).toBeDefined();
        expect(nameError?.message).toContain("required");
      }
    });

    it("should reject name longer than 255 characters", () => {
      const future = new Date();
      future.setDate(future.getDate() + 7);

      const product = {
        name: "A".repeat(256),
        quantity: 1,
        unit: "pcs",
        expiration_date: formatDateYYYYMMDD(future),
      };

      const result = createProductSchema.safeParse(product);
      expect(result.success).toBe(false);
      if (!result.success) {
        const nameError = result.error.issues.find((issue) => issue.path[0] === "name");
        expect(nameError?.message).toContain("255");
      }
    });

    it("should reject zero or negative quantity", () => {
      const invalidQuantities = [0, -1, -10.5];

      const future = new Date();
      future.setDate(future.getDate() + 7);
      const expiration_date = formatDateYYYYMMDD(future);

      invalidQuantities.forEach((quantity) => {
        const product = {
          name: "Test Product",
          quantity,
          unit: "pcs",
          expiration_date,
        };

        const result = createProductSchema.safeParse(product);
        expect(result.success).toBe(false);
        if (!result.success) {
          const quantityError = result.error.issues.find((issue) => issue.path[0] === "quantity");
          expect(quantityError).toBeDefined();
        }
      });
    });

    it("should reject invalid unit", () => {
      const future = new Date();
      future.setDate(future.getDate() + 7);

      const product = {
        name: "Test Product",
        quantity: 1,
        unit: "invalid_unit",
        expiration_date: formatDateYYYYMMDD(future),
      };

      const result = createProductSchema.safeParse(product);
      expect(result.success).toBe(false);
      if (!result.success) {
        const unitError = result.error.issues.find((issue) => issue.path[0] === "unit");
        expect(unitError?.message).toContain("kg, g, l, ml, pcs");
      }
    });

    it("should reject invalid expiration_date format", () => {
      const invalidDates = ["2025/12/31", "31-12-2025", "12-31-2025", "not-a-date"];

      invalidDates.forEach((date) => {
        const product = {
          name: "Test Product",
          quantity: 1,
          unit: "pcs",
          expiration_date: date,
        };

        const result = createProductSchema.safeParse(product);
        expect(result.success).toBe(false);
      });
    });

    it("should reject past expiration_date", () => {
      const past = new Date();
      past.setDate(past.getDate() - 7);

      const product = {
        name: "Test Product",
        quantity: 1,
        unit: "pcs",
        expiration_date: formatDateYYYYMMDD(past),
      };

      const result = createProductSchema.safeParse(product);
      expect(result.success).toBe(false);
      if (!result.success) {
        const dateError = result.error.issues.find((issue) => issue.path[0] === "expiration_date");
        expect(dateError?.message).toContain("future");
      }
    });

    it("should reject invalid status", () => {
      const future = new Date();
      future.setDate(future.getDate() + 7);

      const product = {
        name: "Test Product",
        quantity: 1,
        unit: "pcs",
        expiration_date: formatDateYYYYMMDD(future),
        status: "invalid_status",
      };

      const result = createProductSchema.safeParse(product);
      expect(result.success).toBe(false);
    });

    it("should reject opened=true without opened_date", () => {
      const future = new Date();
      future.setDate(future.getDate() + 7);

      const product = {
        name: "Test Product",
        quantity: 1,
        unit: "pcs",
        expiration_date: formatDateYYYYMMDD(future),
        opened: true,
      };

      const result = createProductSchema.safeParse(product);
      expect(result.success).toBe(false);
      if (!result.success) {
        const openedDateError = result.error.issues.find((issue) => issue.path[0] === "opened_date");
        expect(openedDateError?.message).toContain("required when product is marked as opened");
      }
    });

    it("should reject invalid opened_date format", () => {
      const product = {
        name: "Test Product",
        quantity: 1,
        unit: "pcs",
        expiration_date: "2025-12-31",
        opened: true,
        opened_date: "not-a-valid-date",
      };

      const result = createProductSchema.safeParse(product);
      expect(result.success).toBe(false);
      if (!result.success) {
        const openedDateError = result.error.issues.find((issue) => issue.path[0] === "opened_date");
        expect(openedDateError?.message).toContain("ISO 8601");
      }
    });

    it("should reject invalid main_image_url", () => {
      const product = {
        name: "Test Product",
        quantity: 1,
        unit: "pcs",
        expiration_date: "2025-12-31",
        main_image_url: "not-a-valid-url",
      };

      const result = createProductSchema.safeParse(product);
      expect(result.success).toBe(false);
      if (!result.success) {
        const urlError = result.error.issues.find((issue) => issue.path[0] === "main_image_url");
        expect(urlError?.message).toContain("valid URL");
      }
    });
  });

  describe("edge cases", () => {
    it("should accept today as expiration_date", () => {
      const today = new Date().toISOString().split("T")[0];
      const product = {
        name: "Test Product",
        quantity: 1,
        unit: "pcs",
        expiration_date: today,
      };

      const result = createProductSchema.safeParse(product);
      expect(result.success).toBe(true);
    });

    it("should handle decimal quantities", () => {
      const product = {
        name: "Test Product",
        quantity: 0.001,
        unit: "kg",
        expiration_date: "2025-12-31",
      };

      const result = createProductSchema.safeParse(product);
      expect(result.success).toBe(true);
    });

    it("should allow opened=false with opened_date", () => {
      const product = {
        name: "Test Product",
        quantity: 1,
        unit: "pcs",
        expiration_date: "2025-12-31",
        opened: false,
        opened_date: new Date().toISOString(),
      };

      const result = createProductSchema.safeParse(product);
      expect(result.success).toBe(true);
    });
  });
});
