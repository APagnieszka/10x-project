import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/db/database.types";
import { ProductsService } from "@/lib/services/products.service";
import { createLogger } from "@/lib/logger";
import { checkRateLimit } from "@/lib/rate-limit";
import { createProductSchema } from "@/lib/validation/products";

export const prerender = false;

// Rate limit configuration for product creation
// Allow 20 requests per minute per household
const RATE_LIMIT_MAX_REQUESTS = 20;
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute

export const POST: APIRoute = async ({ request, locals }) => {
  // Create logger with request context
  const logger = createLogger({
    method: "POST",
    path: "/api/products",
    requestId: crypto.randomUUID(),
  });

  logger.info("Product creation request received");

  try {
    // Get the Authorization header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      logger.warn("Unauthorized request: Missing or invalid authorization header");
      return new Response(
        JSON.stringify({
          error: {
            code: "UNAUTHORIZED",
            message: "Missing or invalid authorization header",
            timestamp: new Date().toISOString(),
          },
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Verify the JWT token and get user
    const { data: userData, error: authError } = await locals.supabase.auth.getUser(token);

    if (authError || !userData.user) {
      logger.warn("Authentication failed: Invalid or expired token", { authError: authError?.message });
      return new Response(
        JSON.stringify({
          error: {
            code: "UNAUTHORIZED",
            message: "Invalid or expired token",
            timestamp: new Date().toISOString(),
          },
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const userId = userData.user.id;

    // Add user context to logger
    logger.addContext({ userId });
    logger.info("User authenticated successfully");

    // Create a Supabase client with the user's JWT token
    // This ensures RLS policies work correctly with auth.uid()
    const userSupabase = createClient<Database>(
      import.meta.env.PUBLIC_SUPABASE_URL,
      import.meta.env.PUBLIC_SUPABASE_KEY,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    // Get household ID for rate limiting
    // We need the household ID early to enforce per-household rate limits
    const productsService = new ProductsService(userSupabase);
    let householdId: number;
    try {
      const { data: userHousehold, error: householdError } = await userSupabase
        .from("user_households")
        .select("household_id")
        .eq("user_id", userId)
        .single();

      if (householdError || !userHousehold) {
        logger.warn("User is not a member of any household", { error: householdError?.message });
        return new Response(
          JSON.stringify({
            error: {
              code: "FORBIDDEN",
              message: "User is not a member of any household",
              timestamp: new Date().toISOString(),
            },
          }),
          {
            status: 403,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      householdId = userHousehold.household_id;
      logger.addContext({ householdId });
      logger.info("Household identified for user");
    } catch (error) {
      logger.error("Failed to retrieve household information", error as Error);
      return new Response(
        JSON.stringify({
          error: {
            code: "INTERNAL_ERROR",
            message: "Failed to retrieve household information",
            timestamp: new Date().toISOString(),
          },
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Check rate limit per household
    const rateLimitResult = checkRateLimit({
      identifier: `household-${householdId}`,
      endpoint: "POST:/api/products",
      maxRequests: RATE_LIMIT_MAX_REQUESTS,
      windowMs: RATE_LIMIT_WINDOW_MS,
    });

    if (!rateLimitResult.allowed) {
      logger.warn("Rate limit exceeded", {
        householdId,
        remaining: rateLimitResult.remaining,
        resetAt: new Date(rateLimitResult.resetAt).toISOString(),
      });
      const resetDate = new Date(rateLimitResult.resetAt);
      return new Response(
        JSON.stringify({
          error: {
            code: "RATE_LIMIT_EXCEEDED",
            message: "Too many requests. Please try again later.",
            details: {
              retryAfter: Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000),
              resetAt: resetDate.toISOString(),
            },
            timestamp: new Date().toISOString(),
          },
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000)),
            "X-RateLimit-Limit": String(RATE_LIMIT_MAX_REQUESTS),
            "X-RateLimit-Remaining": String(rateLimitResult.remaining),
            "X-RateLimit-Reset": resetDate.toISOString(),
          },
        }
      );
    }

    // Parse and validate request body
    let requestBody: unknown;
    try {
      requestBody = await request.json();
    } catch (error) {
      logger.warn("Invalid JSON in request body", { error: (error as Error).message });
      return new Response(
        JSON.stringify({
          error: {
            code: "BAD_REQUEST",
            message: "Invalid JSON in request body",
            timestamp: new Date().toISOString(),
          },
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Validate input data
    const validationResult = createProductSchema.safeParse(requestBody);
    if (!validationResult.success) {
      logger.warn("Validation failed", { errors: validationResult.error.format() });
      return new Response(
        JSON.stringify({
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid input data",
            details: validationResult.error.format(),
            timestamp: new Date().toISOString(),
          },
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Create product using service (service already initialized above for household check)
    logger.info("Creating product", { productName: validationResult.data.name });
    const product = await productsService.createProduct(userId, validationResult.data);

    logger.info("Product created successfully", { productId: product.id });

    // Return success response with rate limit headers
    const resetDate = new Date(rateLimitResult.resetAt);
    return new Response(JSON.stringify(product), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
        "X-RateLimit-Limit": String(RATE_LIMIT_MAX_REQUESTS),
        "X-RateLimit-Remaining": String(rateLimitResult.remaining),
        "X-RateLimit-Reset": resetDate.toISOString(),
      },
    });
  } catch (error) {
    // Handle specific service errors
    if (error instanceof Error) {
      if (error.message === "User is not a member of any household") {
        logger.warn("User attempted to create product without household membership");
        return new Response(
          JSON.stringify({
            error: {
              code: "FORBIDDEN",
              message: "User is not a member of any household",
              timestamp: new Date().toISOString(),
            },
          }),
          {
            status: 403,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      if (error.message === "Barcode already exists for this household") {
        logger.warn("Duplicate barcode detected", { barcode: (error as Error & { barcode?: string }).barcode });
        return new Response(
          JSON.stringify({
            error: {
              code: "CONFLICT",
              message: "Barcode already exists for this household",
              timestamp: new Date().toISOString(),
            },
          }),
          {
            status: 409,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      if (error.message.includes("Failed to create product")) {
        logger.error("Product creation failed in database", error);
        return new Response(
          JSON.stringify({
            error: {
              code: "INTERNAL_ERROR",
              message: "Failed to create product",
              timestamp: new Date().toISOString(),
            },
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    // Generic error - log with full error details
    logger.error("Unexpected error during product creation", error as Error);
    return new Response(
      JSON.stringify({
        error: {
          code: "INTERNAL_ERROR",
          message: "An unexpected error occurred",
          timestamp: new Date().toISOString(),
        },
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export const HEAD: APIRoute = async () => {
  // Simple health check endpoint that doesn't require authentication
  // Used by client-side code to verify API connectivity
  const logger = createLogger({
    method: "HEAD",
    path: "/api/products",
    requestId: crypto.randomUUID(),
  });

  logger.info("Health check request received");

  // Return 200 OK to indicate API is reachable
  // No authentication required for HEAD requests
  return new Response(null, {
    status: 200,
    headers: {
      "Cache-Control": "no-cache",
    },
  });
};

export const GET: APIRoute = async ({ request, locals, url }) => {
  // Create logger with request context
  const logger = createLogger({
    method: "GET",
    path: "/api/products",
    requestId: crypto.randomUUID(),
  });

  logger.info("Product list request received");

  try {
    // Get the Authorization header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      logger.warn("Unauthorized request: Missing or invalid authorization header");
      return new Response(
        JSON.stringify({
          error: {
            code: "UNAUTHORIZED",
            message: "Missing or invalid authorization header",
            timestamp: new Date().toISOString(),
          },
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Verify the JWT token and get user
    const { data: userData, error: authError } = await locals.supabase.auth.getUser(token);

    if (authError || !userData.user) {
      logger.warn("Authentication failed: Invalid or expired token", { authError: authError?.message });
      return new Response(
        JSON.stringify({
          error: {
            code: "UNAUTHORIZED",
            message: "Invalid or expired token",
            timestamp: new Date().toISOString(),
          },
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const userId = userData.user.id;

    // Add user context to logger
    logger.addContext({ userId });
    logger.info("User authenticated successfully");

    // Create a Supabase client with the user's JWT token
    const userSupabase = createClient<Database>(
      import.meta.env.PUBLIC_SUPABASE_URL,
      import.meta.env.PUBLIC_SUPABASE_KEY,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    // Parse query parameters
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "10"), 50); // Max 50
    const sort = url.searchParams.get("sort") || "created_at";
    const order = url.searchParams.get("order") === "asc" ? "asc" : "desc";

    // Validate sort field for security
    const allowedSortFields = ["created_at", "name", "expiration_date"];
    if (!allowedSortFields.includes(sort)) {
      logger.warn("Invalid sort field", { sort });
      return new Response(
        JSON.stringify({
          error: {
            code: "BAD_REQUEST",
            message: "Invalid sort field",
            timestamp: new Date().toISOString(),
          },
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Get household ID
    const productsService = new ProductsService(userSupabase);
    let householdId: number;

    try {
      householdId = await productsService.getHouseholdIdPublic(userId);
    } catch {
      // User is not a member of any household - return empty list
      logger.info("User is not a member of any household, returning empty list", { userId });
      return new Response(
        JSON.stringify({
          data: [],
          pagination: {
            limit,
            total: 0,
          },
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Fetch products
    const { data, error } = await userSupabase
      .from("products")
      .select("*")
      .eq("household_id", householdId)
      .order(sort, { ascending: order === "asc" })
      .limit(limit);

    if (error) {
      logger.error("Failed to fetch products", error);
      return new Response(
        JSON.stringify({
          error: {
            code: "DATABASE_ERROR",
            message: "Failed to fetch products",
            timestamp: new Date().toISOString(),
          },
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Format response
    const products = data.map((product) => ({
      id: product.id,
      household_id: product.household_id,
      name: product.name,
      brand: product.brand || undefined,
      barcode: product.barcode || undefined,
      quantity: product.quantity,
      unit: product.unit,
      expiration_date: product.expiration_date,
      status: product.status as "draft" | "active" | "spoiled",
      opened: product.opened,
      to_buy: product.to_buy,
      opened_date: product.opened_date || undefined,
      created_at: product.created_at,
      main_image_url: product.main_image_url || undefined,
    }));

    logger.info("Products fetched successfully", { count: products.length });

    return new Response(
      JSON.stringify({
        data: products,
        pagination: {
          limit,
          total: products.length, // For simplicity, return actual count
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    // Generic error - log with full error details
    logger.error("Unexpected error during product fetch", error as Error);
    return new Response(
      JSON.stringify({
        error: {
          code: "INTERNAL_ERROR",
          message: "An unexpected error occurred",
          timestamp: new Date().toISOString(),
        },
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
