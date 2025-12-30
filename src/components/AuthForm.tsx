"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  registerWithHouseholdSchema,
  resetPasswordSchema,
  type LoginInput,
  type RegisterWithHouseholdInput,
  type ResetPasswordInput,
} from "@/lib/validation/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/hooks/useAuth";
import { useToast } from "@/components/Toast";
import { getAuthErrorMessage } from "@/lib/auth-errors";

type AuthMode = "login" | "register" | "reset";

interface AuthFormProps {
  mode: AuthMode;
  isSubmitting?: boolean;
}

export function AuthForm({ mode, isSubmitting = false }: AuthFormProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const { login, register: authRegister, resetPassword } = useAuth();
  const { authError, success, error: showErrorToast } = useToast();
  const isLogin = mode === "login";
  const isRegister = mode === "register";
  const isReset = mode === "reset";

  const schema = isLogin ? loginSchema : isRegister ? registerWithHouseholdSchema : resetPasswordSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput | RegisterWithHouseholdInput | ResetPasswordInput>({
    resolver: zodResolver(schema),
  });

  const formErrors = errors as Record<string, { message?: string }>; // Type assertion for union types

  const onFormSubmit = async (data: LoginInput | RegisterWithHouseholdInput | ResetPasswordInput) => {
    let error;
    if (isLogin) {
      error = await login((data as LoginInput).email, (data as LoginInput).password);
    } else if (isRegister) {
      error = await authRegister(
        (data as RegisterWithHouseholdInput).email,
        (data as RegisterWithHouseholdInput).password,
        (data as RegisterWithHouseholdInput).householdName
      );
    } else if (isReset) {
      error = await resetPassword((data as ResetPasswordInput).email);
    }

    if (error) {
      const errorCode = (error as { code?: unknown } | null)?.code;
      if (typeof errorCode === "string" && errorCode.length > 0) {
        authError(getAuthErrorMessage(errorCode, "pl"));
        return;
      }

      showErrorToast("Błąd", error.message);
    } else {
      success(isLogin ? "Zalogowano pomyślnie" : isRegister ? "Konto utworzone" : "E-mail wysłany");
      // Przekierowanie po sukcesie - odczekaj chwilę na aktualizację stanu
      const urlParams = new URLSearchParams(window.location.search);
      const redirect = urlParams.get("redirect") || "/";
      setTimeout(() => {
        window.location.assign(redirect);
      }, 100);
    }
  };

  const title = isLogin ? "Zaloguj się" : isRegister ? "Utwórz konto" : "Reset hasła";
  const description = isLogin
    ? "Wpisz dane logowania, aby uzyskać dostęp do konta"
    : isRegister
      ? "Utwórz nowe konto, aby rozpocząć"
      : "Podaj adres e-mail, aby otrzymać link do resetu hasła";

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6" data-hydrated={isHydrated ? "true" : "false"}>
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">E-mail *</Label>
            <Input id="email" type="email" {...register("email")} placeholder="Wpisz adres e-mail" />
            {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
          </div>

          {/* Password - only for login and register */}
          {(isLogin || isRegister) && (
            <div className="space-y-2">
              <Label htmlFor="password">Hasło *</Label>
              <Input id="password" type="password" {...register("password")} placeholder="Wpisz hasło" />
              {formErrors.password && <p className="text-sm text-red-600">{formErrors.password.message}</p>}
            </div>
          )}

          {/* Confirm Password - only for register */}
          {isRegister && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Powtórz hasło *</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                placeholder="Powtórz hasło"
              />
              {formErrors.confirmPassword && (
                <p className="text-sm text-red-600">{formErrors.confirmPassword.message}</p>
              )}
            </div>
          )}

          {/* Household Name - only for register */}
          {isRegister && (
            <div className="space-y-2">
              <Label htmlFor="householdName">Nazwa gospodarstwa (opcjonalnie)</Label>
              <Input id="householdName" {...register("householdName")} placeholder="np. Rodzina Kowalskich" />
              {formErrors.householdName && <p className="text-sm text-red-600">{formErrors.householdName.message}</p>}
              <p className="text-xs text-muted-foreground">Jeśli zostawisz puste, domyślnie użyjemy Twojego e-maila.</p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting
              ? "Przetwarzanie..."
              : isLogin
                ? "Zaloguj się"
                : isRegister
                  ? "Utwórz konto"
                  : "Wyślij link do resetu"}
          </Button>
        </form>

        {/* Links */}
        <div className="mt-6 text-center space-y-2">
          {isLogin && (
            <>
              <p className="text-sm text-muted-foreground">
                Nie masz konta?{" "}
                <a href="/register" className="text-primary hover:underline">
                  Zarejestruj się
                </a>
              </p>
              <p className="text-sm text-muted-foreground">
                <a href="/reset-password" className="text-primary hover:underline">
                  Nie pamiętasz hasła?
                </a>
              </p>
            </>
          )}
          {isRegister && (
            <p className="text-sm text-muted-foreground">
              Masz już konto?{" "}
              <a href="/login" className="text-primary hover:underline">
                Zaloguj się
              </a>
            </p>
          )}
          {isReset && (
            <p className="text-sm text-muted-foreground">
              Pamiętasz hasło?{" "}
              <a href="/login" className="text-primary hover:underline">
                Zaloguj się
              </a>
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
