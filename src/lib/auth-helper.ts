import { NextRequest } from 'next/server'
import { authDb } from './db'

export async function verifyAdminAuth(request: NextRequest): Promise<{ authenticated: boolean; error?: string }> {
  try {
    const token = request.cookies.get('admin_token')?.value

    if (!token) {
      return { authenticated: false, error: 'No authentication token' }
    }

    const result = await authDb.verifySession(token)

    if (!result.valid) {
      return { authenticated: false, error: 'Invalid or expired session' }
    }

    return { authenticated: true }
  } catch (error) {
    console.error('Auth verification error:', error)
    return { authenticated: false, error: 'Authentication verification failed' }
  }
}
