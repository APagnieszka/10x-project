import { z } from "zod";

// Auth validation schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Password confirmation must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const registerWithHouseholdSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Password confirmation must be at least 8 characters"),
    householdName: z
      .string()
      .min(2, "Nazwa gospodarstwa musi mieć minimum 2 znaki")
      .max(100, "Nazwa gospodarstwa może mieć maksymalnie 100 znaków")
      .regex(
        /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ0-9\s\-_]+$/,
        "Nazwa może zawierać tylko litery, cyfry, spacje i podstawowe znaki"
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type RegisterWithHouseholdInput = z.infer<typeof registerWithHouseholdSchema>;
