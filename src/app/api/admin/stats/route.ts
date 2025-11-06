import { NextRequest, NextResponse } from 'next/server'
import { db, pageViewsDb } from '@/lib/db'
import { ApiResponse, DashboardStats } from '@/types/api'
import { verifyAdminAuth } from '@/lib/auth-helper'

// GET /api/admin/stats - Get dashboard statistics
export async function GET(request: NextRequest) {
  // Check authentication
  const auth = await verifyAdminAuth(request)
  if (!auth.authenticated) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const allListings = await db.listings.findAll()
    const allBlogPosts = await db.blogPosts.findAll()

    const activeListings = allListings.filter(l => l.status === 'active')
    const publishedPosts = allBlogPosts.filter(p => p.status === 'published')

    // Get page views with real-time calculations
    const totalViews = pageViewsDb.getTotalViews()
    const weeklyViews = pageViewsDb.getWeeklyViews()
    const monthlyViews = pageViewsDb.getMonthlyViews()
    
    console.log('📊 [Stats API] Views:', { totalViews, weeklyViews, monthlyViews })

    // Get recent listings (last 3)
    const recentListings = allListings
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3)

    // Get recent blog posts (last 3)
    const recentBlogPosts = allBlogPosts
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3)

    const stats: DashboardStats = {
      totalListings: allListings.length,
      activeListings: activeListings.length,
      totalBlogPosts: allBlogPosts.length,
      publishedBlogPosts: publishedPosts.length,
      views: {
        total: totalViews,
        weekly: weeklyViews,
        monthly: monthlyViews
      },
      recentListings,
      recentBlogPosts
    }

    const response: ApiResponse<DashboardStats> = {
      success: true,
      data: stats
    }

    return NextResponse.json(response)
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch statistics'
    }
    return NextResponse.json(response, { status: 500 })
  }
}
