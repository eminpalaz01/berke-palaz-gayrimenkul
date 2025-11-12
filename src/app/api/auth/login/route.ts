import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { checkRateLimit, resetRateLimit, RateLimitPresets } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Kullanıcı adı ve şifre gereklidir' },
        { status: 400 }
      )
    }

    // Get client IP for rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    
    // Check rate limit
    const rateLimitKey = `login:${clientIp}:${username}`
    const rateLimit = checkRateLimit(rateLimitKey, RateLimitPresets.LOGIN)
    
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: rateLimit.error },
        { status: 429 }
      )
    }

    // Attempt login
    const result = await db.admin.login(username, password)

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error,
          remainingAttempts: rateLimit.remaining
        },
        { status: 401 }
      )
    }

    // Reset rate limit on successful login
    resetRateLimit(rateLimitKey)

    // Create response with session cookie
    const response = NextResponse.json({
      success: true,
      message: 'Giriş başarılı'
    })

    // Set HTTP-only cookie for security
    response.cookies.set('admin_token', result.token!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/'
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Giriş işlemi sırasında bir hata oluştu' },
      { status: 500 }
    )
  }
}
