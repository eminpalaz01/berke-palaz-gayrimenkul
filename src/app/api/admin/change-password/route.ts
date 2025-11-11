import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { cookies } from 'next/headers'
import { verifyPassword, validatePasswordStrength } from '@/lib/password'
import { checkRateLimit, resetRateLimit, RateLimitPresets } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Oturum bulunamadı' },
        { status: 401 }
      )
    }

    const session = await db.admin.verifySession(token)
    if (!session.valid) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz oturum' },
        { status: 401 }
      )
    }

    // Get client IP for rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    
    // Check rate limit
    const rateLimitKey = `password-change:${clientIp}:${session.username}`
    const rateLimit = checkRateLimit(rateLimitKey, RateLimitPresets.PASSWORD_CHANGE)
    
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: rateLimit.error },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { currentPassword, newPassword, confirmPassword } = body

    // Validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'Tüm alanlar gereklidir' },
        { status: 400 }
      )
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'Yeni şifreler eşleşmiyor' },
        { status: 400 }
      )
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(newPassword)
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { success: false, error: passwordValidation.message },
        { status: 400 }
      )
    }

    // Check if new password is same as current password
    if (currentPassword === newPassword) {
      return NextResponse.json(
        { success: false, error: 'Yeni şifre mevcut şifre ile aynı olamaz' },
        { status: 400 }
      )
    }

    // Get current user
    const user = await db.admin.findByUsername(session.username!)

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      )
    }

    // Verify current password (supports both hashed and plain text)
    let isValidPassword = false
    
    if (user.password.startsWith('$2')) {
      // Hashed password
      isValidPassword = await verifyPassword(currentPassword, user.password)
    } else {
      // Plain text password (legacy)
      isValidPassword = user.password === currentPassword
    }

    if (!isValidPassword) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Mevcut şifre yanlış',
          remainingAttempts: rateLimit.remaining
        },
        { status: 400 }
      )
    }

    // Update password using the secure method
    await db.admin.updatePassword(session.username!, newPassword)

    // Reset rate limit on successful password change
    resetRateLimit(rateLimitKey)

    return NextResponse.json({
      success: true,
      message: 'Şifre başarıyla güncellendi'
    })
  } catch (error) {
    console.error('Change password error:', error)
    return NextResponse.json(
      { success: false, error: 'Şifre değiştirme sırasında bir hata oluştu' },
      { status: 500 }
    )
  }
}
