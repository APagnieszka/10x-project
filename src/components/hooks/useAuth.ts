import { supabaseClient } from "@/db/supabase.client";
import { logger } from "@/lib/logger";

export function useAuth() {
  const login = async (email: string, password: string) => {
    logger.info(`Attempting login for ${email}`);
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    logger.info("Login result", { user: !!data.user, session: !!data.session, error: !!error });
    return error;
  };

  const logout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    return error;
  };

  const register = async (email: string, password: string, householdName: string) => {
    logger.info("Attempting registration", { email, householdName });

    // First, create the user account
    const { data: signUpData, error: signUpError } = await supabaseClient.auth.signUp({
      email,
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
      // Create the household
      const { data: householdData, error: householdError } = await supabaseClient
        .from("households")
        .insert({ name: householdName })
        .select("id")
        .single();

      if (householdError) {
        logger.error("Household creation failed", householdError);
        // Note: User account was created but household creation failed
        // This is an edge case that should be handled gracefully
        return householdError;
      }

      if (!householdData?.id) {
        logger.error("Household created but no ID returned");
        return new Error("Household creation failed - no ID");
      }

      logger.info("Household created, linking user", { householdId: householdData.id });

      // Link user to household
      const { error: linkError } = await supabaseClient.from("user_households").insert({
        user_id: signUpData.user.id,
        household_id: householdData.id,
      });

      if (linkError) {
        logger.error("User-household linking failed", linkError);
        return linkError;
      }

      logger.info("Registration completed successfully");
      return null; // Success
    } catch (error) {
      logger.error("Unexpected error during household creation", error instanceof Error ? error : undefined);
      return error instanceof Error ? error : new Error("Unexpected error during registration");
    }
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email);
    return error;
  };

  return { login, logout, register, resetPassword };
}
