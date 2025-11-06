import { NextRequest, NextResponse } from 'next/server'
import { pageViewsDb } from '@/lib/db'
import { ApiResponse } from '@/types/api'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// POST /api/track-view - Track page view
export async function POST(request: NextRequest) {
  try {
    console.log('📊 [Track View] API called')
    
    // Track page view (no rate limiting)
    pageViewsDb.incrementView()
    
    const totalViews = pageViewsDb.getTotalViews()
    const weeklyViews = pageViewsDb.getWeeklyViews()
    const monthlyViews = pageViewsDb.getMonthlyViews()
    
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
