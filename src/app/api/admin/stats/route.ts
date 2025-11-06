import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ApiResponse, DashboardStats } from '@/types/api'

// GET /api/admin/stats - Get dashboard statistics
export async function GET() {
  try {
    const allListings = await db.listings.findAll()
    const allBlogPosts = await db.blogPosts.findAll()

    const activeListings = allListings.filter(l => l.status === 'active')
    const publishedPosts = allBlogPosts.filter(p => p.status === 'published')

    // Calculate monthly views (sum of all views)
    const monthlyViews = allListings.reduce((sum, l) => sum + l.views, 0) +
                        allBlogPosts.reduce((sum, p) => sum + p.views, 0)

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
      monthlyViews,
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
