import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { withApiSecurity, SecurityPresets } from '@/lib/api-security'

async function handler(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value

    if (token) {
      await db.admin.logout(token)
    }

    // Create response and clear cookie
    const response = NextResponse.json({
      success: true,
      message: 'Çıkış başarılı'
    })

    response.cookies.delete('admin_token')

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { success: false, error: 'Çıkış işlemi sırasında bir hata oluştu' },
      { status: 500 }
    )
  }
}

export const POST = withApiSecurity(handler, SecurityPresets.PUBLIC_READ_ONLY)
