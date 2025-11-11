import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ApiResponse } from '@/types/api'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// POST /api/track-view - Track page view
export async function POST(request: NextRequest) {
  try {
    console.trace('📊 [Track View] API called')
    
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
    
    console.trace('📊 [Track View] Success!')
    console.trace('   Total:', totalViews)
    console.trace('   Weekly:', weeklyViews)
    console.trace('   Monthly:', monthlyViews)
    
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
