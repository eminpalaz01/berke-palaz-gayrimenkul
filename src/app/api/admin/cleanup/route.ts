import { NextRequest, NextResponse } from 'next/server'
import { db, prisma } from '@/lib/db'
import { ApiResponse } from '@/types/api'
import { verifyAdminAuth } from '@/lib/auth-helper'

// DELETE /api/admin/cleanup - Delete old page views
export async function DELETE(request: NextRequest) {
  // Check authentication
  const auth = await verifyAdminAuth(request)
  if (!auth.authenticated) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const threeMonthsAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // Approximately 3 months

    const result = await prisma.pageView.deleteMany({
      where: {
        timestamp: {
          lt: threeMonthsAgo
        }
      }
    })

    console.trace(`🧹 [Cleanup API] Deleted ${result.count} old page views.`)

    const response: ApiResponse = {
      success: true,
      message: `Deleted ${result.count} page views older than 3 months.`
    }

    return NextResponse.json(response)
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to cleanup old page views'
    }
    return NextResponse.json(response, { status: 500 })
  }
}
