import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ApiResponse, BlogPost } from '@/types/api'

// GET /api/blog - Get all published blog posts with optional filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || undefined
    const locale = searchParams.get('locale') || 'tr'
    const tag = searchParams.get('tag') || undefined

    // Only return published posts for public API
    let posts = await db.blogPosts.findAll({
      status: 'published',
      search,
      locale
    })

    // Filter by tag if provided
    if (tag) {
      posts = posts.filter(post => 
        post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
      )
    }

    const response: ApiResponse<BlogPost[]> = {
      success: true,
      data: posts
    }

    return NextResponse.json(response)
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch blog posts'
    }
    return NextResponse.json(response, { status: 500 })
  }
}
