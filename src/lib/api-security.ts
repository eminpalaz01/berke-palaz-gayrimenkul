import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, RateLimitPresets } from './rate-limit'

/**
 * API Security Middleware
 * Provides origin validation and rate limiting for API endpoints
 */

interface SecurityConfig {
  requireOriginValidation?: boolean
  rateLimit?: {
    maxAttempts: number
    windowMs: number
  }
  allowedOrigins?: string[]
}

/**
 * Get client identifier for rate limiting
 */
function getClientIdentifier(request: NextRequest): string {
  // Try to get IP from various headers (for proxies/load balancers)
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip')
  
  const ip = forwarded?.split(',')[0] || realIp || cfConnectingIp || 'unknown'
  
  return ip
}

/**
 * Validate request origin
 */
function validateOrigin(request: NextRequest, allowedOrigins: string[]): boolean {
  const origin = request.headers.get('origin')
  const referer = request.headers.get('referer')
  
  // Allow requests without origin/referer (direct API calls, server-side)
  if (!origin && !referer) {
    return true
  }
  
  // Check origin
  if (origin) {
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed === '*') return true
      if (allowed.includes('localhost') && origin.includes('localhost')) return true
      return origin === allowed || origin.startsWith(allowed)
    })
    
    if (!isAllowed) {
      return false
    }
  }
  
  // Check referer as fallback
  if (referer && !origin) {
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed === '*') return true
      if (allowed.includes('localhost') && referer.includes('localhost')) return true
      return referer.startsWith(allowed)
    })
    
    if (!isAllowed) {
      return false
    }
  }
  
  return true
}

/**
 * Get allowed origins from environment
 */
function getAllowedOrigins(): string[] {
  const origins: string[] = []
  
  // Add site URL from environment
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (siteUrl) {
    origins.push(siteUrl)
  }
  
  // Add localhost for development
  if (process.env.NODE_ENV === 'development') {
    origins.push('http://localhost:3000')
    origins.push('http://localhost:3001')
    origins.push('http://127.0.0.1:3000')
  }
  
  // Add custom allowed origins from environment
  const customOrigins = process.env.ALLOWED_ORIGINS
  if (customOrigins) {
    origins.push(...customOrigins.split(',').map(o => o.trim()))
  }
  
  // If no origins configured, allow all in development, restrict in production
  if (origins.length === 0) {
    if (process.env.NODE_ENV === 'development') {
      origins.push('*')
    }
  }
  
  return origins
}

/**
 * Apply security checks to API request
 */
export function withApiSecurity(
  handler: (request: NextRequest) => Promise<NextResponse>,
  config: SecurityConfig = {}
): (request: NextRequest) => Promise<NextResponse> {
  return async (request: NextRequest) => {
    try {
      // 1. Origin validation
      if (config.requireOriginValidation !== false) {
        const allowedOrigins = config.allowedOrigins || getAllowedOrigins()
        
        if (allowedOrigins.length > 0 && !allowedOrigins.includes('*')) {
          const isValidOrigin = validateOrigin(request, allowedOrigins)
          
          if (!isValidOrigin) {
            console.warn('🚫 [API Security] Invalid origin:', {
              origin: request.headers.get('origin'),
              referer: request.headers.get('referer'),
              path: request.nextUrl.pathname
            })
            
            return NextResponse.json(
              { success: false, error: 'Forbidden: Invalid origin' },
              { status: 403 }
            )
          }
        }
      }
      
      // 2. Rate limiting
      if (config.rateLimit) {
        const identifier = getClientIdentifier(request)
        const rateLimitResult = checkRateLimit(identifier, config.rateLimit)
        
        if (!rateLimitResult.success) {
          console.warn('🚫 [API Security] Rate limit exceeded:', {
            identifier,
            path: request.nextUrl.pathname
          })
          
          return NextResponse.json(
            { 
              success: false, 
              error: rateLimitResult.error || 'Too many requests'
            },
            { 
              status: 429,
              headers: {
                'X-RateLimit-Limit': config.rateLimit.maxAttempts.toString(),
                'X-RateLimit-Remaining': '0',
                'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString()
              }
            }
          )
        }
        
        // Add rate limit headers to successful response
        const response = await handler(request)
        response.headers.set('X-RateLimit-Limit', config.rateLimit.maxAttempts.toString())
        response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString())
        response.headers.set('X-RateLimit-Reset', new Date(rateLimitResult.resetTime).toISOString())
        
        return response
      }
      
      // 3. Execute handler
      return await handler(request)
      
    } catch (error) {
      console.error('❌ [API Security] Error:', error)
      return NextResponse.json(
        { success: false, error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
}

/**
 * Predefined security configurations
 */
export const SecurityPresets = {
  // Public API with rate limiting
  PUBLIC_API: {
    requireOriginValidation: true,
    rateLimit: RateLimitPresets.API
  },
  
  // Public API without rate limiting (for read-only endpoints)
  PUBLIC_READ_ONLY: {
    requireOriginValidation: true
  },
  
  // No security (for admin endpoints that have their own auth)
  NONE: {
    requireOriginValidation: false
  }
} as const
