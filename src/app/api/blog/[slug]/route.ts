import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ApiResponse, BlogPost } from '@/types/api'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// GET /api/blog/[slug] - Get a single published blog post by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const post = await db.blogPosts.findBySlug(slug)

    if (!post || post.status !== 'published') {
      const response: ApiResponse = {
        success: false,
        error: 'Blog post not found'
      }
      return NextResponse.json(response, { status: 404 })
    }

    // Increment views
    await db.blogPosts.incrementViews(post.id)

    const response: ApiResponse<BlogPost> = {
      success: true,
      data: post
    }

    return NextResponse.json(response)
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch blog post'
    }
    return NextResponse.json(response, { status: 500 })
  }
}
