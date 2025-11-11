import { defineMiddleware } from "astro:middleware";
import { createServerClient } from "@supabase/ssr";
import { z } from "zod";

const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  // Dodaj inne pola jeśli potrzebne
});

export const onRequest = defineMiddleware(async (context, next) => {
  const supabase = createServerClient(import.meta.env.PUBLIC_SUPABASE_URL, import.meta.env.PUBLIC_SUPABASE_KEY, {
    cookies: {
      get(name: string) {
        const cookieHeader = context.request.headers.get("cookie");
        if (!cookieHeader) return undefined;
        const cookie = cookieHeader.split(";").find((c) => c.trim().startsWith(`${name}=`));
        return cookie ? decodeURIComponent(cookie.split("=")[1]) : undefined;
      },
      set(name: string, value: string, options) {
        context.cookies.set(name, value, {
          path: "/",
          secure: import.meta.env.PROD,
          httpOnly: true,
          sameSite: "lax",
          ...options,
        });
      },
      remove(name: string, options) {
        context.cookies.delete(name, {
          path: "/",
          ...options,
        });
      },
    },
  });

  context.locals.supabase = supabase;

  // Sprawdź sesję dla chronionych tras i API PRZED wywołaniem next()
  if (context.url.pathname.startsWith("/products") || context.url.pathname.startsWith("/api/")) {
    // Dla API endpoints, pozwól na autoryzację przez Authorization header
    // API endpoint sam sprawdzi token
    if (context.url.pathname.startsWith("/api/")) {
      const authHeader = context.request.headers.get("Authorization");
      if (authHeader?.startsWith("Bearer ")) {
        return next();
      }
      // Brak tokena Bearer - sprawdź sesję z cookies jako fallback
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      // Dla stron - przekieruj do logowania
      if (context.url.pathname.startsWith("/products")) {
        const redirectUrl = `/login?redirect=${encodeURIComponent(context.url.pathname)}`;
        return context.redirect(redirectUrl);
      }

      // Dla API - zwróć 401
      if (context.url.pathname.startsWith("/api/")) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // Dodatkowa walidacja dla API
    if (context.url.pathname.startsWith("/api/") && !userSchema.safeParse(session?.user).success) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return next();
});
