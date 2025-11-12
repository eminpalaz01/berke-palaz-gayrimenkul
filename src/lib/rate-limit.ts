/**
 * Simple in-memory rate limiter for API endpoints
 * For production, consider using Redis or a dedicated rate limiting service
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key)
    }
  }
}, 5 * 60 * 1000)

export interface RateLimitConfig {
  maxAttempts: number
  windowMs: number
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  resetTime: number
  error?: string
}

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier (e.g., IP address, username)
 * @param config - Rate limit configuration
 * @returns Rate limit result
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now()
  const entry = rateLimitStore.get(identifier)

  // No previous attempts or window expired
  if (!entry || entry.resetTime < now) {
    const resetTime = now + config.windowMs
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime
    })

    return {
      success: true,
      remaining: config.maxAttempts - 1,
      resetTime
    }
  }

  // Within rate limit window
  if (entry.count < config.maxAttempts) {
    entry.count++
    rateLimitStore.set(identifier, entry)

    return {
      success: true,
      remaining: config.maxAttempts - entry.count,
      resetTime: entry.resetTime
    }
  }

  // Rate limit exceeded
  return {
    success: false,
    remaining: 0,
    resetTime: entry.resetTime,
    error: `Çok fazla deneme. Lütfen ${Math.ceil((entry.resetTime - now) / 1000)} saniye sonra tekrar deneyin.`
  }
}

/**
 * Reset rate limit for an identifier
 * @param identifier - Unique identifier to reset
 */
export function resetRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier)
}

/**
 * Get current rate limit status
 * @param identifier - Unique identifier to check
 * @returns Current status or null if no entry exists
 */
export function getRateLimitStatus(identifier: string): RateLimitEntry | null {
  return rateLimitStore.get(identifier) || null
}

/**
 * Predefined rate limit configurations
 */
export const RateLimitPresets = {
  // Login attempts: 5 attempts per 15 minutes
  LOGIN: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000
  },
  // Password change: 3 attempts per 30 minutes
  PASSWORD_CHANGE: {
    maxAttempts: 3,
    windowMs: 30 * 60 * 1000
  },
  // General API: 100 requests per minute
  API: {
    maxAttempts: 100,
    windowMs: 60 * 1000
  }
}
