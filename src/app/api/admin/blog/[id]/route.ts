import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ApiResponse, BlogPost, UpdateBlogPostDto } from '@/types/api'
import { verifyAdminAuth } from '@/lib/auth-helper'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// GET /api/admin/blog/[id] - Get a single blog post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check authentication
  const auth = await verifyAdminAuth(request)
  if (!auth.authenticated) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { id } = await params
    const post = await db.blogPosts.findById(id)

    if (!post) {
      const response: ApiResponse = {
        success: false,
        error: 'Blog post not found'
      }
      return NextResponse.json(response, { status: 404 })
    }

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

// PATCH /api/admin/blog/[id] - Update a blog post
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check authentication
  const auth = await verifyAdminAuth(request)
  if (!auth.authenticated) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { id } = await params
    const body: UpdateBlogPostDto = await request.json()

    // If slug is being updated, check if it already exists
    if (body.slug) {
      const existingPost = await db.blogPosts.findBySlug(body.slug)
      if (existingPost && existingPost.id !== id) {
        const response: ApiResponse = {
          success: false,
          error: 'A post with this slug already exists'
        }
        return NextResponse.json(response, { status: 400 })
      }
    }

    const updatedPost = await db.blogPosts.update(id, body)

    if (!updatedPost) {
      const response: ApiResponse = {
        success: false,
        error: 'Blog post not found'
      }
      return NextResponse.json(response, { status: 404 })
    }

    const response: ApiResponse<BlogPost> = {
      success: true,
      data: updatedPost,
      message: 'Blog post updated successfully'
    }

    return NextResponse.json(response)
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update blog post'
    }
    return NextResponse.json(response, { status: 500 })
  }
}

// DELETE /api/admin/blog/[id] - Delete a blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check authentication
  const auth = await verifyAdminAuth(request)
  if (!auth.authenticated) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { id } = await params
    const deleted = await db.blogPosts.delete(id)

    if (!deleted) {
      const response: ApiResponse = {
        success: false,
        error: 'Blog post not found'
      }
      return NextResponse.json(response, { status: 404 })
    }

    const response: ApiResponse = {
      success: true,
      message: 'Blog post deleted successfully'
    }

    return NextResponse.json(response)
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete blog post'
    }
    return NextResponse.json(response, { status: 500 })
  }
}
