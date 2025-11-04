"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  type LoginInput,
  type RegisterInput,
  type ResetPasswordInput,
} from "@/lib/validation/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/hooks/useAuth";
import { useToast } from "@/components/Toast";

type AuthMode = "login" | "register" | "reset";

interface AuthFormProps {
  mode: AuthMode;
  isSubmitting?: boolean;
}

export function AuthForm({ mode, isSubmitting = false }: AuthFormProps) {
  const { login, register: authRegister, resetPassword } = useAuth();
  const { authError, success } = useToast();
  const isLogin = mode === "login";
  const isRegister = mode === "register";
  const isReset = mode === "reset";

  const schema = isLogin ? loginSchema : isRegister ? registerSchema : resetPasswordSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput | RegisterInput | ResetPasswordInput>({
    resolver: zodResolver(schema),
  });

  const formErrors = errors as Record<string, { message?: string }>; // Type assertion for union types

  const onFormSubmit = async (data: LoginInput | RegisterInput | ResetPasswordInput) => {
    let error;
    if (isLogin) {
      error = await login((data as LoginInput).email, (data as LoginInput).password);
    } else if (isRegister) {
      error = await authRegister((data as RegisterInput).email, (data as RegisterInput).password);
    } else if (isReset) {
      error = await resetPassword((data as ResetPasswordInput).email);
    }

    if (error) {
      authError(error.message);
    } else {
      success(isLogin ? "Zalogowano pomyślnie" : isRegister ? "Konto utworzone" : "E-mail wysłany");
      // Przekierowanie po sukcesie
      const urlParams = new URLSearchParams(window.location.search);
      const redirect = urlParams.get("redirect") || "/";
      window.location.assign(redirect);
    }
  };

  const title = isLogin ? "Sign In" : isRegister ? "Create Account" : "Reset Password";
  const description = isLogin
    ? "Enter your credentials to access your account"
    : isRegister
      ? "Create a new account to get started"
      : "Enter your email to receive a password reset link";

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" {...register("email")} placeholder="Enter your email" />
            {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
          </div>

          {/* Password - only for login and register */}
          {(isLogin || isRegister) && (
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input id="password" type="password" {...register("password")} placeholder="Enter your password" />
              {formErrors.password && <p className="text-sm text-red-600">{formErrors.password.message}</p>}
            </div>
          )}

          {/* Confirm Password - only for register */}
          {isRegister && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                placeholder="Confirm your password"
              />
              {formErrors.confirmPassword && (
                <p className="text-sm text-red-600">{formErrors.confirmPassword.message}</p>
              )}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : isLogin ? "Sign In" : isRegister ? "Create Account" : "Send Reset Link"}
          </Button>
        </form>

        {/* Links */}
        <div className="mt-6 text-center space-y-2">
          {isLogin && (
            <>
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <a href="/register" className="text-primary hover:underline">
                  Sign up
                </a>
              </p>
              <p className="text-sm text-muted-foreground">
                <a href="/reset-password" className="text-primary hover:underline">
                  Forgot your password?
                </a>
              </p>
            </>
          )}
          {isRegister && (
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <a href="/login" className="text-primary hover:underline">
                Sign in
              </a>
            </p>
          )}
          {isReset && (
            <p className="text-sm text-muted-foreground">
              Remember your password?{" "}
              <a href="/login" className="text-primary hover:underline">
                Sign in
              </a>
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
