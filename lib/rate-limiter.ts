// In-memory rate limiting store (resets on server restart)
// For production: Use Redis instead of in-memory storage
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const GUEST_RATE_LIMIT = 10; // 10 requests per minute for guests
const AUTH_RATE_LIMIT = 60; // 60 requests per minute for authenticated users
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds

/**
 * Check if an IP/user has exceeded rate limit
 * @param identifier - IP address or user ID
 * @param isAuthenticated - Whether user is authenticated (Google login)
 * @returns { allowed: boolean, remainingRequests: number, resetIn: number }
 */
export function checkRateLimit(identifier: string, isAuthenticated: boolean): {
  allowed: boolean;
  remainingRequests: number;
  resetIn: number;
} {
  const now = Date.now();
  const limit = isAuthenticated ? AUTH_RATE_LIMIT : GUEST_RATE_LIMIT;

  // Get or create rate limit record
  let record = rateLimitStore.get(identifier);

  // Reset if window has expired
  if (!record || now >= record.resetTime) {
    record = { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
    rateLimitStore.set(identifier, record);
  }

  // Increment request count
  record.count++;

  const allowed = record.count <= limit;
  const remainingRequests = Math.max(0, limit - record.count);
  const resetIn = Math.max(0, record.resetTime - now);

  console.log(`[RateLimit] ${identifier} (${isAuthenticated ? 'AUTH' : 'GUEST'}): ${record.count}/${limit} | Remaining: ${remainingRequests}s | Reset: ${Math.ceil(resetIn / 1000)}s`);

  return { allowed, remainingRequests, resetIn };
}

/**
 * Clean up old rate limit records (call periodically)
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now();
  let cleaned = 0;

  for (const [key, record] of rateLimitStore.entries()) {
    if (now >= record.resetTime) {
      rateLimitStore.delete(key);
      cleaned++;
    }
  }

  if (cleaned > 0) {
    console.log(`[RateLimit] Cleaned up ${cleaned} expired records`);
  }
}

// Cleanup every 5 minutes
setInterval(cleanupRateLimitStore, 5 * 60 * 1000);
