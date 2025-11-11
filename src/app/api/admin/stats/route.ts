import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ApiResponse, DashboardStats, Listing, BlogPost } from '@/types/api'
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
    const allListings = (await db.listings.findAll()) as Listing[]
    const allBlogPosts = (await db.blog.findAll()) as BlogPost[]

    const activeListings = allListings.filter((l) => l.status === 'active')
    const publishedPosts = allBlogPosts.filter((p) => p.status === 'published')

    // Get page views with real-time calculations
    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) // Approximately 3 months
    
    const [threeMonthsViews, weeklyViews, monthlyViews] = await Promise.all([
      db.pageViews.getCount(threeMonthsAgo),
      db.pageViews.getCount(oneWeekAgo),
      db.pageViews.getCount(oneMonthAgo)
    ])
    
    console.trace('📊 [Stats API] Views:', { threeMonthsViews, weeklyViews, monthlyViews })
    // Get recent listings (last 3)
    const recentListings = allListings
      .sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 3)

    // Get recent blog posts (last 3)
    const recentBlogPosts = allBlogPosts
      .sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 3)

    const stats: DashboardStats = {
      totalListings: allListings.length,
      activeListings: activeListings.length,
      totalBlogPosts: allBlogPosts.length,
      publishedBlogPosts: publishedPosts.length,
      views: {
        threeMonths: threeMonthsViews,
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
