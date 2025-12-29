interface PasswordGrantResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: string;
    email?: string;
  };
}

function getEnv(name: string): string | undefined {
  return process.env[name];
}

function resolveServiceRoleKey(): string | undefined {
  return (
    getEnv("SUPABASE_SERVICE_ROLE_KEY") ?? getEnv("PUBLIC_SUPABASE_SERVICE_ROLE_KEY") ?? getEnv("SERVICE_ROLE_KEY")
  );
}

export async function deleteSupabaseUserIfPossible(params: { email: string; password: string }): Promise<void> {
  const supabaseUrl = getEnv("PUBLIC_SUPABASE_URL");
  const supabaseAnonKey = getEnv("PUBLIC_SUPABASE_KEY");
  const supabaseServiceRoleKey = resolveServiceRoleKey();

  if (!supabaseUrl || !supabaseAnonKey) {
    return;
  }

  if (!supabaseServiceRoleKey) {
    return;
  }

  let userId: string | undefined;

  try {
    const tokenRes = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: {
        apikey: supabaseAnonKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: params.email,
        password: params.password,
      }),
    });

    if (!tokenRes.ok) return;

    const tokenJson = (await tokenRes.json()) as PasswordGrantResponse;
    userId = tokenJson.user?.id;

    if (!userId) {
      return;
    }
  } catch {
    return;
  }

  try {
    const deleteRes = await fetch(`${supabaseUrl}/auth/v1/admin/users/${userId}`, {
      method: "DELETE",
      headers: {
        apikey: supabaseServiceRoleKey,
        authorization: `Bearer ${supabaseServiceRoleKey}`,
      },
    });

    if (!deleteRes.ok) return;
  } catch {
    return;
  }
}
