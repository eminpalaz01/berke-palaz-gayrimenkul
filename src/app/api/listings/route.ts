import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ApiResponse, Listing } from '@/types/api'

// GET /api/listings - Get all active listings with optional filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') || undefined
    const search = searchParams.get('search') || undefined
    const locale = searchParams.get('locale') || 'tr'
    const propertyType = searchParams.get('propertyType') || undefined

    // Only return active listings for public API
    let listings = await db.listings.findAll({
      type,
      status: 'active',
      search,
      locale
    })

    // Filter by property type if provided
    if (propertyType) {
      listings = listings.filter(listing => listing.propertyType === propertyType)
    }

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
