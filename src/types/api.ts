// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Listing Types
export interface Listing {
  id: string
  title: string
  description: string
  location: string
  price: number
  currency: string
  type: string
  status: string
  propertyType: string
  area: number
  rooms?: number | null
  bathrooms?: number | null
  floor?: number | null
  buildingAge?: number | null
  features: string[]
  images: string[]
  coverImage?: string | null
  createdAt: Date
  updatedAt: Date
  views: number
  locale: string
}

export interface CreateListingDto {
  title: string
  description: string
  location: string
  price: number
  currency: string
  type: string
  propertyType: string
  area: number
  rooms?: number | null
  bathrooms?: number | null
  floor?: number | null
  buildingAge?: number | null
  features?: string[]
  images?: string[]
  coverImage?: string | null
  status?: string
  locale: string
}

export interface UpdateListingDto extends Partial<CreateListingDto> {
  status?: string
}

// Blog Types
export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage?: string | null
  author: string
  status: string
  views: number
  tags: string[]
  locale: string
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date | null
}

export interface CreateBlogPostDto {
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage?: string | null
  author: string
  tags?: string[]
  status?: string
  locale: string
}

export interface UpdateBlogPostDto extends Partial<CreateBlogPostDto> {
  status?: string
}

// Stats Types
export interface ViewStats {
  threeMonths: number
  weekly: number
  monthly: number
}

export interface DashboardStats {
  totalListings: number
  activeListings: number
  totalBlogPosts: number
  publishedBlogPosts: number
  views: ViewStats
  recentListings: Listing[]
  recentBlogPosts: BlogPost[]
}

// Pagination Types
export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  search?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Filter Types
export interface ListingFilters extends PaginationParams {
  type?: 'sale' | 'rent'
  status?: 'active' | 'inactive' | 'sold' | 'rented'
  propertyType?: string
  minPrice?: number
  maxPrice?: number
  locale?: string
}

export interface BlogFilters extends PaginationParams {
  status?: 'draft' | 'published' | 'archived'
  author?: string
  tag?: string
  locale?: string
}
