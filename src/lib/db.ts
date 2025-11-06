// In-memory database simulation for development
// In production, this would be replaced with a real database (PostgreSQL, MongoDB, etc.)

import { Listing, BlogPost } from '@/types/api'

// Mock data storage
const listings: Listing[] = [
  {
    id: '1',
    title: 'Modern Daire',
    description: 'Şehir merkezinde modern ve konforlu daire',
    location: 'Beşiktaş, İstanbul',
    price: 5800000,
    currency: '₺',
    type: 'sale',
    status: 'active',
    propertyType: 'apartment',
    area: 120,
    rooms: 3,
    bathrooms: 2,
    floor: 5,
    buildingAge: 2,
    features: ['Asansör', 'Otopark', 'Güvenlik'],
    images: [],
    coverImage: '/images/listings/listing-1.jpg',
    createdAt: new Date('2024-12-15').toISOString(),
    updatedAt: new Date('2024-12-15').toISOString(),
    views: 245,
    locale: 'tr'
  },
  {
    id: '2',
    title: 'Lüks Villa',
    description: 'Deniz manzaralı lüks villa',
    location: 'Çeşme, İzmir',
    price: 45000,
    currency: '₺',
    type: 'rent',
    status: 'active',
    propertyType: 'villa',
    area: 350,
    rooms: 5,
    bathrooms: 4,
    buildingAge: 1,
    features: ['Havuz', 'Bahçe', 'Deniz Manzarası'],
    images: [],
    coverImage: '/images/listings/listing-2.jpg',
    createdAt: new Date('2024-12-12').toISOString(),
    updatedAt: new Date('2024-12-12').toISOString(),
    views: 189,
    locale: 'tr'
  },
  {
    id: '3',
    title: 'Stüdyo Daire',
    description: 'Merkezi konumda stüdyo daire',
    location: 'Kadıköy, İstanbul',
    price: 1850000,
    currency: '₺',
    type: 'sale',
    status: 'inactive',
    propertyType: 'apartment',
    area: 45,
    rooms: 1,
    bathrooms: 1,
    floor: 3,
    buildingAge: 5,
    features: ['Asansör', 'Güvenlik'],
    images: [],
    coverImage: '/images/listings/listing-3.jpg',
    createdAt: new Date('2024-12-10').toISOString(),
    updatedAt: new Date('2024-12-10').toISOString(),
    views: 156,
    locale: 'tr'
  }
]

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Gayrimenkul Yatırımında Dikkat Edilmesi Gerekenler',
    slug: 'gayrimenkul-yatiriminda-dikkat-edilmesi-gerekenler',
    excerpt: 'Gayrimenkul yatırımı yaparken dikkat etmeniz gereken önemli noktalar',
    content: 'Gayrimenkul yatırımı, uzun vadeli ve güvenli bir yatırım aracıdır...',
    coverImage: '/images/blog/blog-1.jpg',
    author: 'Berke Palaz',
    status: 'published',
    views: 1250,
    tags: ['Yatırım', 'Gayrimenkul', 'Finans'],
    locale: 'tr',
    createdAt: new Date('2024-05-15').toISOString(),
    updatedAt: new Date('2024-05-15').toISOString(),
    publishedAt: new Date('2024-05-15').toISOString()
  },
  {
    id: '2',
    title: 'Konut Kredisi Alırken Nelere Dikkat Etmelisiniz?',
    slug: 'konut-kredisi-alirken-nelere-dikkat-etmelisiniz',
    excerpt: 'Konut kredisi başvurusu yaparken bilmeniz gerekenler',
    content: 'Konut kredisi almak ev sahibi olmanın en yaygın yollarından biridir...',
    coverImage: '/images/blog/blog-2.jpg',
    author: 'Berke Palaz',
    status: 'draft',
    views: 0,
    tags: ['Kredi', 'Konut', 'Finans'],
    locale: 'tr',
    createdAt: new Date('2024-05-08').toISOString(),
    updatedAt: new Date('2024-05-08').toISOString()
  },
  {
    id: '3',
    title: 'Ev Satışında Pazarlama Stratejileri',
    slug: 'ev-satisinda-pazarlama-stratejileri',
    excerpt: 'Evinizi hızlı ve karlı satmak için etkili pazarlama yöntemleri',
    content: 'Ev satışında başarılı olmak için doğru pazarlama stratejileri çok önemlidir...',
    coverImage: '/images/blog/blog-3.jpg',
    author: 'Berke Palaz',
    status: 'published',
    views: 890,
    tags: ['Satış', 'Pazarlama', 'Gayrimenkul'],
    locale: 'tr',
    createdAt: new Date('2024-05-01').toISOString(),
    updatedAt: new Date('2024-05-01').toISOString(),
    publishedAt: new Date('2024-05-01').toISOString()
  }
]

// Helper function to generate unique IDs
let listingIdCounter = 4
let blogIdCounter = 4

export const generateId = (type: 'listing' | 'blog'): string => {
  if (type === 'listing') {
    return String(listingIdCounter++)
  }
  return String(blogIdCounter++)
}

// Listing operations
export const db = {
  listings: {
    findAll: async (filters?: {
      type?: string
      status?: string
      search?: string
      locale?: string
    }): Promise<Listing[]> => {
      let filtered = [...listings]

      if (filters?.type) {
        filtered = filtered.filter(l => l.type === filters.type)
      }
      if (filters?.status) {
        filtered = filtered.filter(l => l.status === filters.status)
      }
      if (filters?.search) {
        const search = filters.search.toLowerCase()
        filtered = filtered.filter(l =>
          l.title.toLowerCase().includes(search) ||
          l.location.toLowerCase().includes(search)
        )
      }
      if (filters?.locale) {
        filtered = filtered.filter(l => l.locale === filters.locale)
      }

      return filtered.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    },

    findById: async (id: string): Promise<Listing | null> => {
      return listings.find(l => l.id === id) || null
    },

    create: async (data: Omit<Listing, 'id' | 'createdAt' | 'updatedAt' | 'views'>): Promise<Listing> => {
      const newListing: Listing = {
        ...data,
        id: generateId('listing'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0
      }
      listings.push(newListing)
      return newListing
    },

    update: async (id: string, data: Partial<Listing>): Promise<Listing | null> => {
      const index = listings.findIndex(l => l.id === id)
      if (index === -1) return null

      listings[index] = {
        ...listings[index],
        ...data,
        updatedAt: new Date().toISOString()
      }
      return listings[index]
    },

    delete: async (id: string): Promise<boolean> => {
      const index = listings.findIndex(l => l.id === id)
      if (index === -1) return false

      listings.splice(index, 1)
      return true
    },

    incrementViews: async (id: string): Promise<void> => {
      const listing = listings.find(l => l.id === id)
      if (listing) {
        listing.views++
      }
    }
  },

  blogPosts: {
    findAll: async (filters?: {
      status?: string
      search?: string
      locale?: string
    }): Promise<BlogPost[]> => {
      let filtered = [...blogPosts]

      if (filters?.status) {
        filtered = filtered.filter(p => p.status === filters.status)
      }
      if (filters?.search) {
        const search = filters.search.toLowerCase()
        filtered = filtered.filter(p =>
          p.title.toLowerCase().includes(search) ||
          p.excerpt.toLowerCase().includes(search)
        )
      }
      if (filters?.locale) {
        filtered = filtered.filter(p => p.locale === filters.locale)
      }

      return filtered.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    },

    findById: async (id: string): Promise<BlogPost | null> => {
      return blogPosts.find(p => p.id === id) || null
    },

    findBySlug: async (slug: string): Promise<BlogPost | null> => {
      return blogPosts.find(p => p.slug === slug) || null
    },

    create: async (data: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'views'>): Promise<BlogPost> => {
      const newPost: BlogPost = {
        ...data,
        id: generateId('blog'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0
      }
      blogPosts.push(newPost)
      return newPost
    },

    update: async (id: string, data: Partial<BlogPost>): Promise<BlogPost | null> => {
      const index = blogPosts.findIndex(p => p.id === id)
      if (index === -1) return null

      blogPosts[index] = {
        ...blogPosts[index],
        ...data,
        updatedAt: new Date().toISOString()
      }

      // Set publishedAt when status changes to published
      if (data.status === 'published' && !blogPosts[index].publishedAt) {
        blogPosts[index].publishedAt = new Date().toISOString()
      }

      return blogPosts[index]
    },

    delete: async (id: string): Promise<boolean> => {
      const index = blogPosts.findIndex(p => p.id === id)
      if (index === -1) return false

      blogPosts.splice(index, 1)
      return true
    },

    incrementViews: async (id: string): Promise<void> => {
      const post = blogPosts.find(p => p.id === id)
      if (post) {
        post.views++
      }
    }
  }
}
