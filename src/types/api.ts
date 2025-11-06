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
  type: 'sale' | 'rent'
  status: 'active' | 'inactive' | 'sold' | 'rented'
  propertyType: 'apartment' | 'villa' | 'office' | 'land' | 'commercial'
  area: number
  rooms?: number
  bathrooms?: number
  floor?: number
  buildingAge?: number
  features: string[]
  images: string[]
  coverImage?: string
  createdAt: string
  updatedAt: string
  views: number
  locale: string
}

export interface CreateListingDto {
  title: string
  description: string
  location: string
  price: number
  currency: string
  type: 'sale' | 'rent'
  propertyType: 'apartment' | 'villa' | 'office' | 'land' | 'commercial'
  area: number
  rooms?: number
  bathrooms?: number
  floor?: number
  buildingAge?: number
  features?: string[]
  images?: string[]
  coverImage?: string
  status?: 'active' | 'inactive' | 'sold' | 'rented'
  locale: string
}

export interface UpdateListingDto extends Partial<CreateListingDto> {
  status?: 'active' | 'inactive' | 'sold' | 'rented'
}

// Blog Types
export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage?: string
  author: string
  status: 'draft' | 'published' | 'archived'
  views: number
  tags: string[]
  locale: string
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

export interface CreateBlogPostDto {
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage?: string
  author: string
  tags?: string[]
  status?: 'draft' | 'published' | 'archived'
  locale: string
}

export interface UpdateBlogPostDto extends Partial<CreateBlogPostDto> {
  status?: 'draft' | 'published' | 'archived'
}

// Stats Types
export interface ViewStats {
  total: number
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
