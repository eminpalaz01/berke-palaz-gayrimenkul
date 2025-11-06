import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ApiResponse, Listing, UpdateListingDto } from '@/types/api'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// GET /api/admin/listings/[id] - Get a single listing
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const listing = await db.listings.findById(id)

    if (!listing) {
      const response: ApiResponse = {
        success: false,
        error: 'Listing not found'
      }
      return NextResponse.json(response, { status: 404 })
    }

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

// PATCH /api/admin/listings/[id] - Update a listing
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body: UpdateListingDto = await request.json()

    const updatedListing = await db.listings.update(id, body)

    if (!updatedListing) {
      const response: ApiResponse = {
        success: false,
        error: 'Listing not found'
      }
      return NextResponse.json(response, { status: 404 })
    }

    const response: ApiResponse<Listing> = {
      success: true,
      data: updatedListing,
      message: 'Listing updated successfully'
    }

    return NextResponse.json(response)
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update listing'
    }
    return NextResponse.json(response, { status: 500 })
  }
}

// DELETE /api/admin/listings/[id] - Delete a listing
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const deleted = await db.listings.delete(id)

    if (!deleted) {
      const response: ApiResponse = {
        success: false,
        error: 'Listing not found'
      }
      return NextResponse.json(response, { status: 404 })
    }

    const response: ApiResponse = {
      success: true,
      message: 'Listing deleted successfully'
    }

    return NextResponse.json(response)
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete listing'
    }
    return NextResponse.json(response, { status: 500 })
  }
}
