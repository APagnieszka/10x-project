import { z } from "zod";

const emailSchema = z.string().trim().toLowerCase().email("Nieprawidłowy adres e-mail");

// Auth validation schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(8, "Hasło musi mieć co najmniej 8 znaków"),
});

export const registerSchema = z
  .object({
    email: emailSchema,
    password: z.string().min(8, "Hasło musi mieć co najmniej 8 znaków"),
    confirmPassword: z.string().min(8, "Powtórzone hasło musi mieć co najmniej 8 znaków"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła nie są takie same",
    path: ["confirmPassword"],
  });

export const resetPasswordSchema = z.object({
  email: emailSchema,
});

export const registerWithHouseholdSchema = z
  .object({
    email: emailSchema,
    password: z.string().min(8, "Hasło musi mieć co najmniej 8 znaków"),
    confirmPassword: z.string().min(8, "Powtórzone hasło musi mieć co najmniej 8 znaków"),
    householdName: z
      .string()
      .optional()
      .transform((value) => (value ?? "").trim())
      .refine((value) => value.length === 0 || value.length >= 2, {
        message: "Nazwa gospodarstwa musi mieć minimum 2 znaki",
      })
      .refine((value) => value.length === 0 || value.length <= 100, {
        message: "Nazwa gospodarstwa może mieć maksymalnie 100 znaków",
      })
      .refine((value) => value.length === 0 || /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ0-9\s\-_]+$/.test(value), {
        message: "Nazwa może zawierać tylko litery, cyfry, spacje i podstawowe znaki",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła nie są takie same",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type RegisterWithHouseholdInput = z.infer<typeof registerWithHouseholdSchema>;
