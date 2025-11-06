import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ApiResponse, Listing, CreateListingDto } from '@/types/api'

// GET /api/admin/listings - Get all listings with optional filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') || undefined
    const status = searchParams.get('status') || undefined
    const search = searchParams.get('search') || undefined
    const locale = searchParams.get('locale') || undefined

    const listings = await db.listings.findAll({
      type,
      status,
      search,
      locale
    })

    const response: ApiResponse<Listing[]> = {
      success: true,
      data: listings
    }

    return NextResponse.json(response)
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch listings'
    }
    return NextResponse.json(response, { status: 500 })
  }
}

// POST /api/admin/listings - Create a new listing
export async function POST(request: NextRequest) {
  try {
    const body: CreateListingDto = await request.json()

    // Validation
    if (!body.title || !body.description || !body.location || !body.price) {
      const response: ApiResponse = {
        success: false,
        error: 'Missing required fields'
      }
      return NextResponse.json(response, { status: 400 })
    }

    const newListing = await db.listings.create({
      ...body,
      features: body.features || [],
      images: body.images || [],
      status: body.status || 'active'
    })

    const response: ApiResponse<Listing> = {
      success: true,
      data: newListing,
      message: 'Listing created successfully'
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create listing'
    }
    return NextResponse.json(response, { status: 500 })
  }
}
