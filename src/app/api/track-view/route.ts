import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ApiResponse } from '@/types/api'
import { withApiSecurity, SecurityPresets } from '@/lib/api-security'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// POST /api/track-view - Track page view
async function handler(request: NextRequest) {
  try {
    console.log('📊 [Track View] API called')
    
    // Track page view
    await db.pageViews.track()
    
    // Get view counts
    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    
    const [totalViews, weeklyViews, monthlyViews] = await Promise.all([
      db.pageViews.getCount(),
      db.pageViews.getCount(oneWeekAgo),
      db.pageViews.getCount(oneMonthAgo)
    ])
    
    console.log('📊 [Track View] Success!')
    console.log('   Total:', totalViews)
    console.log('   Weekly:', weeklyViews)
    console.log('   Monthly:', monthlyViews)
    
    const response: ApiResponse = {
      success: true,
      message: 'View tracked successfully'
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('❌ [Track View] Error:', error)
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to track view'
    }
    return NextResponse.json(response, { status: 500 })
  }
}

export const POST = withApiSecurity(handler, SecurityPresets.PUBLIC_API)
