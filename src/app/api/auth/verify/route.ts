import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, authenticated: false },
        { status: 401 }
      )
    }

    const result = await db.admin.verifySession(token)

    if (!result.valid) {
      return NextResponse.json(
        { success: false, authenticated: false },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      username: result.username
    })
  } catch (error) {
    console.error('Verify error:', error)
    return NextResponse.json(
      { success: false, authenticated: false },
      { status: 500 }
    )
  }
}
