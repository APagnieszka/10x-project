import type { APIRoute } from "astro";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/db/database.types";
import { createLogger } from "@/lib/logger";

export const prerender = false;

function jsonError(status: number, code: string, message: string) {
  return new Response(
    JSON.stringify({
      error: {
        code,
        message,
        timestamp: new Date().toISOString(),
      },
    }),
    {
      status,
      headers: { "Content-Type": "application/json" },
    }
  );
}

async function getUserSupabaseOrError(request: Request, locals: App.Locals, logger: ReturnType<typeof createLogger>) {
  const authHeader = request.headers.get("Authorization");

  let userId: string;
  let userSupabase: SupabaseClient<Database> = locals.supabase as unknown as SupabaseClient<Database>;

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.substring(7);

    const { data: userData, error: authError } = await locals.supabase.auth.getUser(token);
    if (authError || !userData.user) {
      logger.warn("Authentication failed: Invalid or expired token", { authError: authError?.message });
      return jsonError(401, "UNAUTHORIZED", "Invalid or expired token");
    }

    userId = userData.user.id;
    logger.addContext({ userId });

    userSupabase = createClient<Database>(import.meta.env.PUBLIC_SUPABASE_URL, import.meta.env.PUBLIC_SUPABASE_KEY, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    return { userId, userSupabase };
  }

  const { data: userData, error: authError } = await locals.supabase.auth.getUser();
  if (authError || !userData.user) {
    logger.warn("Unauthorized request: missing credentials (no Bearer token and no cookie session)", {
      authError: authError?.message,
    });
    return jsonError(401, "UNAUTHORIZED", "Missing credentials");
  }

  userId = userData.user.id;
  logger.addContext({ userId });

  return { userId, userSupabase };
}

export const PATCH: APIRoute = async ({ request, locals, params }) => {
  const logger = createLogger({
    method: "PATCH",
    path: "/api/products/:id",
    requestId: crypto.randomUUID(),
  });

  const idRaw = params.id;
  const id = Number(idRaw);
  if (!idRaw || !Number.isFinite(id) || id <= 0) {
    return jsonError(400, "BAD_REQUEST", "Invalid product id");
  }

  try {
    const auth = await getUserSupabaseOrError(request, locals, logger);
    if (auth instanceof Response) return auth;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonError(400, "BAD_REQUEST", "Invalid JSON in request body");
    }

    const action = (body as { action?: unknown } | null)?.action;
    if (action !== "spoiled" && action !== "opened") {
      return jsonError(400, "BAD_REQUEST", "Invalid action");
    }

    // Ensure the product exists and is accessible under RLS.
    const { data: existing, error: getError } = await auth.userSupabase
      .from("products")
      .select("id")
      .eq("id", id)
      .single();

    if (getError || !existing) {
      logger.warn("Product not found or inaccessible", { productId: id, error: getError?.message });
      return jsonError(404, "NOT_FOUND", "Product not found");
    }

    const updatePayload: Record<string, unknown> =
      action === "spoiled"
        ? { status: "spoiled" }
        : {
            opened: true,
            opened_date: (() => {
              const raw = (body as { opened_date?: unknown } | null)?.opened_date;
              if (typeof raw !== "string") return new Date().toISOString();
              const parsed = new Date(raw);
              if (Number.isNaN(parsed.getTime())) return new Date().toISOString();
              return parsed.toISOString();
            })(),
          };

    const { data, error } = await auth.userSupabase
      .from("products")
      .update(updatePayload)
      .eq("id", id)
      .select("*")
      .single();

    if (error || !data) {
      logger.error("Failed to update product status", error ?? new Error("Missing updated row"));
      return jsonError(500, "DATABASE_ERROR", "Failed to update product");
    }

    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    logger.error("Unexpected error during product update", error as Error);
    return jsonError(500, "INTERNAL_ERROR", "An unexpected error occurred");
  }
};

export const DELETE: APIRoute = async ({ request, locals, params }) => {
  const logger = createLogger({
    method: "DELETE",
    path: "/api/products/:id",
    requestId: crypto.randomUUID(),
  });

  const idRaw = params.id;
  const id = Number(idRaw);
  if (!idRaw || !Number.isFinite(id) || id <= 0) {
    return jsonError(400, "BAD_REQUEST", "Invalid product id");
  }

  try {
    const auth = await getUserSupabaseOrError(request, locals, logger);
    if (auth instanceof Response) return auth;

    // Ensure the product exists and is accessible under RLS.
    const { data: existing, error: getError } = await auth.userSupabase
      .from("products")
      .select("id")
      .eq("id", id)
      .single();

    if (getError || !existing) {
      logger.warn("Product not found or inaccessible", { productId: id, error: getError?.message });
      return jsonError(404, "NOT_FOUND", "Product not found");
    }

    // "Zjedzone" = remove from inventory.
    const { error: deleteError } = await auth.userSupabase.from("products").delete().eq("id", id);

    if (deleteError) {
      logger.error("Failed to delete product", deleteError);
      return jsonError(500, "DATABASE_ERROR", "Failed to delete product");
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    logger.error("Unexpected error during product delete", error as Error);
    return jsonError(500, "INTERNAL_ERROR", "An unexpected error occurred");
  }
};
