// API Client utilities for making requests to the backend
import { 
  ApiResponse, 
  Listing, 
  BlogPost, 
  DashboardStats,
  CreateListingDto,
  UpdateListingDto,
  CreateBlogPostDto,
  UpdateBlogPostDto
} from '@/types/api'

const ADMIN_API_BASE_URL = '/api/admin'
const PUBLIC_API_BASE_URL = '/api'

// Generic fetch wrapper with error handling
async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit,
  baseUrl: string = ADMIN_API_BASE_URL
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    const data: ApiResponse<T> = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Request failed')
    }

    return data
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

// Listings API
export const listingsApi = {
  getAll: async (filters?: {
    type?: string
    status?: string
    search?: string
    locale?: string
  }): Promise<ApiResponse<Listing[]>> => {
    const params = new URLSearchParams()
    if (filters?.type) params.append('type', filters.type)
    if (filters?.status) params.append('status', filters.status)
    if (filters?.search) params.append('search', filters.search)
    if (filters?.locale) params.append('locale', filters.locale)

    const query = params.toString()
    return fetchApi<Listing[]>(`/listings${query ? `?${query}` : ''}`)
  },

  getById: async (id: string): Promise<ApiResponse<Listing>> => {
    return fetchApi<Listing>(`/listings/${id}`)
  },

  create: async (data: CreateListingDto): Promise<ApiResponse<Listing>> => {
    return fetchApi<Listing>('/listings', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  update: async (id: string, data: UpdateListingDto): Promise<ApiResponse<Listing>> => {
    return fetchApi<Listing>(`/listings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },

  delete: async (id: string): Promise<ApiResponse> => {
    return fetchApi(`/listings/${id}`, {
      method: 'DELETE',
    })
  },
}

// Blog API
export const blogApi = {
  getAll: async (filters?: {
    status?: string
    search?: string
    locale?: string
  }): Promise<ApiResponse<BlogPost[]>> => {
    const params = new URLSearchParams()
    if (filters?.status) params.append('status', filters.status)
    if (filters?.search) params.append('search', filters.search)
    if (filters?.locale) params.append('locale', filters.locale)

    const query = params.toString()
    return fetchApi<BlogPost[]>(`/blog${query ? `?${query}` : ''}`)
  },

  getById: async (id: string): Promise<ApiResponse<BlogPost>> => {
    return fetchApi<BlogPost>(`/blog/${id}`)
  },

  create: async (data: CreateBlogPostDto): Promise<ApiResponse<BlogPost>> => {
    return fetchApi<BlogPost>('/blog', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  update: async (id: string, data: UpdateBlogPostDto): Promise<ApiResponse<BlogPost>> => {
    return fetchApi<BlogPost>(`/blog/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },

  delete: async (id: string): Promise<ApiResponse> => {
    return fetchApi(`/blog/${id}`, {
      method: 'DELETE',
    })
  },
}

// Stats API
export const statsApi = {
  getDashboard: async (): Promise<ApiResponse<DashboardStats>> => {
    return fetchApi<DashboardStats>('/stats')
  },
}

// Public Listings API
export const publicListingsApi = {
  getAll: async (filters?: {
    type?: string
    search?: string
    locale?: string
    propertyType?: string
  }): Promise<ApiResponse<Listing[]>> => {
    const params = new URLSearchParams()
    if (filters?.type) params.append('type', filters.type)
    if (filters?.search) params.append('search', filters.search)
    if (filters?.locale) params.append('locale', filters.locale)
    if (filters?.propertyType) params.append('propertyType', filters.propertyType)

    const query = params.toString()
    return fetchApi<Listing[]>(`/listings${query ? `?${query}` : ''}`, {}, PUBLIC_API_BASE_URL)
  },

  getById: async (id: string): Promise<ApiResponse<Listing>> => {
    return fetchApi<Listing>(`/listings/${id}`, {}, PUBLIC_API_BASE_URL)
  },
}

// Public Blog API
export const publicBlogApi = {
  getAll: async (filters?: {
    search?: string
    locale?: string
    tag?: string
  }): Promise<ApiResponse<BlogPost[]>> => {
    const params = new URLSearchParams()
    if (filters?.search) params.append('search', filters.search)
    if (filters?.locale) params.append('locale', filters.locale)
    if (filters?.tag) params.append('tag', filters.tag)

    const query = params.toString()
    return fetchApi<BlogPost[]>(`/blog${query ? `?${query}` : ''}`, {}, PUBLIC_API_BASE_URL)
  },

  getBySlug: async (slug: string): Promise<ApiResponse<BlogPost>> => {
    return fetchApi<BlogPost>(`/blog/${slug}`, {}, PUBLIC_API_BASE_URL)
  },
}
