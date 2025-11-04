/**
 * Rate Limiting Utilities
 *
 * Simple in-memory rate limiting implementation for API endpoints.
 * For production, consider using Redis or a dedicated rate limiting service.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

/**
 * In-memory store for rate limit tracking
 * Key format: `${identifier}:${endpoint}`
 */
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Configuration for rate limiting
 */
export interface RateLimitConfig {
  /** Maximum number of requests allowed in the time window */
  maxRequests: number;
  /** Time window in milliseconds */
  windowMs: number;
  /** Identifier for the rate limit (e.g., userId, householdId, IP) */
  identifier: string;
  /** Endpoint name for scoping */
  endpoint: string;
}

/**
 * Check if a request should be rate limited
 *
 * @param config Rate limit configuration
 * @returns Object with allowed status and reset time
 */
export function checkRateLimit(config: RateLimitConfig): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
} {
  const key = `${config.identifier}:${config.endpoint}`;
  const now = Date.now();

  // Clean up expired entries periodically (simple cleanup strategy)
  if (Math.random() < 0.01) {
    cleanupExpiredEntries();
  }

  let entry = rateLimitStore.get(key);

  // Initialize or reset if window expired
  if (!entry || entry.resetAt <= now) {
    entry = {
      count: 0,
      resetAt: now + config.windowMs,
    };
    rateLimitStore.set(key, entry);
  }

  // Check if limit exceeded
  if (entry.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  // Increment counter
  entry.count++;

  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetAt: entry.resetAt,
  };
}

/**
 * Clean up expired rate limit entries
 * This prevents memory leaks in long-running processes
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt <= now) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Reset rate limit for a specific identifier and endpoint
 * Useful for testing or manual intervention
 */
export function resetRateLimit(identifier: string, endpoint: string): void {
  const key = `${identifier}:${endpoint}`;
  rateLimitStore.delete(key);
}

/**
 * Get current rate limit status without incrementing
 */
export function getRateLimitStatus(
  identifier: string,
  endpoint: string,
  maxRequests: number
): {
  remaining: number;
  resetAt: number;
} {
  const key = `${identifier}:${endpoint}`;
  const entry = rateLimitStore.get(key);
  const now = Date.now();

  if (!entry || entry.resetAt <= now) {
    return {
      remaining: maxRequests,
      resetAt: now,
    };
  }

  return {
    remaining: Math.max(0, maxRequests - entry.count),
    resetAt: entry.resetAt,
  };
}
