import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ApiResponse, Listing } from '@/types/api'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// GET /api/listings/[id] - Get a single active listing
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const listing = await db.listings.findById(id)

    if (!listing || listing.status !== 'active') {
      const response: ApiResponse = {
        success: false,
        error: 'Listing not found'
      }
      return NextResponse.json(response, { status: 404 })
    }

    // Increment views
    await db.listings.incrementViews(id)

    const response: ApiResponse<Listing> = {
      success: true,
      data: listing
    }

    return NextResponse.json(response)
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch listing'
    }
    return NextResponse.json(response, { status: 500 })
  }
}
