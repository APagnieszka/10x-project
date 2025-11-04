import { supabaseClient } from "@/db/supabase.client";

export function useAuth() {
  const login = async (email: string, password: string) => {
    console.log(`[AUTH] Attempting login for ${email}`);
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    console.log(`[AUTH] Login result:`, { user: !!data.user, session: !!data.session, error });
    return error;
  };

  const logout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    return error;
  };

  const register = async (email: string, password: string) => {
    const { error } = await supabaseClient.auth.signUp({
      email,
      password,
    });
    return error;
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email);
    return error;
  };

  return { login, logout, register, resetPassword };
}
