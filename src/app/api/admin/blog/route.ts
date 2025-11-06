import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ApiResponse, BlogPost, CreateBlogPostDto } from '@/types/api'
import { verifyAdminAuth } from '@/lib/auth-helper'

// GET /api/admin/blog - Get all blog posts with optional filters
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
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') || undefined
    const search = searchParams.get('search') || undefined
    const locale = searchParams.get('locale') || undefined

    const posts = await db.blogPosts.findAll({
      status,
      search,
      locale
    })

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

// POST /api/admin/blog - Create a new blog post
export async function POST(request: NextRequest) {
  // Check authentication
  const auth = await verifyAdminAuth(request)
  if (!auth.authenticated) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const body: CreateBlogPostDto = await request.json()

    // Validation
    if (!body.title || !body.slug || !body.content || !body.author) {
      const response: ApiResponse = {
        success: false,
        error: 'Missing required fields'
      }
      return NextResponse.json(response, { status: 400 })
    }

    // Check if slug already exists
    const existingPost = await db.blogPosts.findBySlug(body.slug)
    if (existingPost) {
      const response: ApiResponse = {
        success: false,
        error: 'A post with this slug already exists'
      }
      return NextResponse.json(response, { status: 400 })
    }

    const newPost = await db.blogPosts.create({
      ...body,
      tags: body.tags || [],
      status: body.status || 'draft'
    })

    const response: ApiResponse<BlogPost> = {
      success: true,
      data: newPost,
      message: 'Blog post created successfully'
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create blog post'
    }
    return NextResponse.json(response, { status: 500 })
  }
}
