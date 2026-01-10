/**
 * Redis tabanlı rate limiting
 * Not: Redis kullanmak için önce Redis sunucusu kurulmalı ve .env dosyasına REDIS_URL eklenmeli
 * Örnek: REDIS_URL=redis://localhost:6379
 */

// Redis kullanımı opsiyonel - eğer kurulu değilse in-memory rate limiting kullanılır
let redis: any = null

try {
  // Redis kuruluysa kullan
  const Redis = require('ioredis')
  redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')
} catch (error) {
  console.warn('Redis not available, using in-memory rate limiting')
}

// Fallback: In-memory rate limiting
const memoryStore = new Map<string, { count: number; resetTime: number }>()

export async function checkRateLimit(
  identifier: string,
  maxAttempts: number,
  windowMs: number
): Promise<{ success: boolean; remaining: number; resetTime: number }> {
  const key = `rate_limit:${identifier}`
  const now = Date.now()
  const resetTime = now + windowMs

  // Redis kullanılabiliyorsa
  if (redis) {
    try {
      const current = await redis.incr(key)
      
      if (current === 1) {
        await redis.pexpire(key, windowMs)
      }
      
      if (current > maxAttempts) {
        const ttl = await redis.pttl(key)
        return { 
          success: false, 
          remaining: 0,
          resetTime: now + ttl
        }
      }
      
      return { 
        success: true, 
        remaining: maxAttempts - current,
        resetTime
      }
    } catch (error) {
      console.error('Redis error, falling back to memory store:', error)
      // Redis hatası varsa in-memory'ye düş
    }
  }

  // In-memory fallback
  const entry = memoryStore.get(key)

  if (!entry || entry.resetTime < now) {
    memoryStore.set(key, {
      count: 1,
      resetTime
    })
    return {
      success: true,
      remaining: maxAttempts - 1,
      resetTime
    }
  }

  if (entry.count < maxAttempts) {
    entry.count++
    memoryStore.set(key, entry)
    return {
      success: true,
      remaining: maxAttempts - entry.count,
      resetTime: entry.resetTime
    }
  }

  return {
    success: false,
    remaining: 0,
    resetTime: entry.resetTime
  }
}

/**
 * Rate limit'i sıfırla
 */
export async function resetRateLimit(identifier: string): Promise<void> {
  const key = `rate_limit:${identifier}`
  
  if (redis) {
    try {
      await redis.del(key)
      return
    } catch (error) {
      console.error('Redis error:', error)
    }
  }
  
  memoryStore.delete(key)
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
  // File upload: 10 uploads per minute
  UPLOAD: {
    maxAttempts: 10,
    windowMs: 60 * 1000
  },
  // General API: 100 requests per minute
  API: {
    maxAttempts: 100,
    windowMs: 60 * 1000
  }
}

// Cleanup old entries every 5 minutes (only for in-memory store)
if (!redis) {
  setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of memoryStore.entries()) {
      if (entry.resetTime < now) {
        memoryStore.delete(key)
      }
    }
  }, 5 * 60 * 1000)
}
