import { supabaseClient } from "@/db/supabase.client";
import { logger } from "@/lib/logger";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase().normalize("NFKC");
}

function serializeAuthErrorForLog(error: unknown): Record<string, unknown> | null {
  if (!error || typeof error !== "object") {
    return null;
  }

  const anyError = error as Record<string, unknown>;
  return {
    name: anyError.name,
    message: anyError.message,
    status: anyError.status,
    code: anyError.code,
  };
}

export function useAuth() {
  const login = async (email: string, password: string) => {
    if (import.meta.env.PUBLIC_SUPABASE_KEY?.startsWith("sb_publishable_")) {
      return new Error(
        "Błędna konfiguracja Supabase: PUBLIC_SUPABASE_KEY wygląda jak klucz publishable (sb_publishable_*). Do logowania/rejestracji potrzebujesz anon public key (JWT zaczynający się od eyJ...). Zaktualizuj .env.local lub usuń go, żeby użyć wartości z .env."
      );
    }

    const normalizedEmail = normalizeEmail(email);
    logger.info(`Attempting login for ${normalizedEmail}`);
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    logger.info("Login result", {
      user: !!data.user,
      session: !!data.session,
      error: serializeAuthErrorForLog(error),
    });
    return error;
  };

  const logout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    return error;
  };

  const register = async (email: string, password: string, householdName?: string) => {
    if (import.meta.env.PUBLIC_SUPABASE_KEY?.startsWith("sb_publishable_")) {
      return new Error(
        "Błędna konfiguracja Supabase: PUBLIC_SUPABASE_KEY wygląda jak klucz publishable (sb_publishable_*). Ten projekt wymaga anon public key do rejestracji (JWT zaczynający się od eyJ...). Zaktualizuj .env.local lub usuń go, żeby użyć wartości z .env."
      );
    }

    const normalizedEmail = normalizeEmail(email);
    const effectiveHouseholdName = (householdName ?? "").trim() || normalizedEmail;
    logger.info("Attempting registration", {
      email: normalizedEmail,
      emailDebug: { raw: JSON.stringify(email), normalized: JSON.stringify(normalizedEmail), length: email.length },
      householdName: effectiveHouseholdName,
    });

    // First, create the user account
    const { data: signUpData, error: signUpError } = await supabaseClient.auth.signUp({
      email: normalizedEmail,
      password,
    });

    if (signUpError) {
      logger.error("Registration failed", signUpError);
      return signUpError;
    }

    if (!signUpData.user) {
      logger.error("Registration succeeded but no user data returned");
      return new Error("Registration failed - no user data");
    }

    logger.info("User created successfully, creating household");

    try {
      const session = signUpData.session;

      // If email confirmation is enabled, signUp returns a user but no session.
      // In that case we can't create a household yet (RLS requires an authenticated user).
      if (!session) {
        logger.info(
          "Registration created user but no session; skipping household creation (email confirmation likely enabled)"
        );
        return null;
      }

      const { data: householdId, error: householdError } = await supabaseClient.rpc("create_household_and_link_user", {
        household_name: effectiveHouseholdName,
      });

      if (householdError) {
        const anyHouseholdError = householdError as unknown as { code?: string; message?: string };
        if (anyHouseholdError.code === "PGRST202") {
          logger.error("Household+link RPC missing (schema cache)", householdError);
          return new Error(
            "Brakuje funkcji bazy danych create_household_and_link_user (PGRST202). To oznacza, że migracje Supabase nie zostały zastosowane dla tego projektu/środowiska. Uruchom `npx supabase migration up` (dla lokalnego Supabase) albo wykonaj migracje na projekcie hostowanym."
          );
        }

        logger.error("Household+link RPC failed", householdError);
        return householdError;
      }

      if (!householdId) {
        logger.error("Household RPC succeeded but returned no id");
        return new Error("Household creation failed - no ID");
      }

      logger.info("Household created and user linked", { householdId });

      logger.info("Registration completed successfully");
      return null; // Success
    } catch (error) {
      logger.error("Unexpected error during household creation", error instanceof Error ? error : undefined);
      return error instanceof Error ? error : new Error("Unexpected error during registration");
    }
  };

  const resetPassword = async (email: string) => {
    if (import.meta.env.PUBLIC_SUPABASE_KEY?.startsWith("sb_publishable_")) {
      return new Error(
        "Błędna konfiguracja Supabase: PUBLIC_SUPABASE_KEY wygląda jak klucz publishable (sb_publishable_*). Do resetu hasła potrzebujesz anon public key (JWT zaczynający się od eyJ...). Zaktualizuj .env.local lub usuń go, żeby użyć wartości z .env."
      );
    }

    const normalizedEmail = normalizeEmail(email);
    const { error } = await supabaseClient.auth.resetPasswordForEmail(normalizedEmail);
    return error;
  };

  return { login, logout, register, resetPassword };
}
