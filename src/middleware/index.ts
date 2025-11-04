import { defineMiddleware } from "astro:middleware";
import { createServerClient } from "@supabase/ssr";
import { z } from "zod";

const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  // Dodaj inne pola jeśli potrzebne
});

export const onRequest = defineMiddleware(async (context, next) => {
  const cookieHeader = context.request.headers.get("cookie");
  console.log(`[MIDDLEWARE] Cookie header:`, cookieHeader);

  const supabase = createServerClient(import.meta.env.PUBLIC_SUPABASE_URL, import.meta.env.PUBLIC_SUPABASE_KEY, {
    cookies: {
      get(name: string) {
        const cookieHeader = context.request.headers.get("cookie");
        if (!cookieHeader) return undefined;
        const cookie = cookieHeader.split(";").find((c) => c.trim().startsWith(`${name}=`));
        const value = cookie ? decodeURIComponent(cookie.split("=")[1]) : undefined;
        console.log(`[MIDDLEWARE] Getting cookie ${name}:`, value ? "present" : "not found");
        return value;
      },
      set(name: string, value: string, options) {
        console.log(`[MIDDLEWARE] Setting cookie ${name}`);
        context.cookies.set(name, value, {
          path: "/",
          secure: import.meta.env.PROD,
          httpOnly: true,
          sameSite: "lax",
          ...options,
        });
      },
      remove(name: string, options) {
        console.log(`[MIDDLEWARE] Removing cookie ${name}`);
        context.cookies.delete(name, {
          path: "/",
          ...options,
        });
      },
    },
  });

  context.locals.supabase = supabase;

  // Sprawdź sesję dla chronionych tras
  if (context.url.pathname.startsWith("/products")) {
    console.log(`[MIDDLEWARE] Checking session for ${context.url.pathname}`);
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    console.log(`[MIDDLEWARE] Session result:`, { session: !!session, error: sessionError });
    if (!session) {
      console.log(`[MIDDLEWARE] No session, redirecting to login`);
      const redirectUrl = `/login?redirect=${encodeURIComponent(context.url.pathname)}`;
      return context.redirect(redirectUrl);
    }
    console.log(`[MIDDLEWARE] Session found, proceeding`);
  }

  // Server-side walidacja dla API
  if (context.url.pathname.startsWith("/api/")) {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session || !userSchema.safeParse(session.user).success) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return next();
});
