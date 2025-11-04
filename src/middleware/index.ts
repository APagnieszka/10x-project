import { defineMiddleware } from "astro:middleware";
import { z } from "zod";

import { supabaseClient } from "../db/supabase.client.ts";

const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  // Dodaj inne pola jeśli potrzebne
});

export const onRequest = defineMiddleware(async (context, next) => {
  context.locals.supabase = supabaseClient;

  // Sprawdź sesję dla chronionych tras
  if (context.url.pathname.startsWith("/products")) {
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();
    if (!user) {
      const redirectUrl = `/login?redirect=${encodeURIComponent(context.url.pathname)}`;
      return context.redirect(redirectUrl);
    }
  }

  // Server-side walidacja dla API
  if (context.url.pathname.startsWith("/api/")) {
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();
    if (!user || !userSchema.safeParse(user).success) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return next();
});
