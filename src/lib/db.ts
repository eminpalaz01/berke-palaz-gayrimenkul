import { Listing, PrismaClient } from '@prisma/client'
import { hashPassword, verifyPassword } from './password'
import { BlogPost } from '@/types/api'
import { deleteImageFile } from './upload-helper'

// Prisma Client singleton
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Type helpers
type ListingWhereInput = {
  type?: string
  status?: string
  locale?: string
  OR?: Array<{
    title?: { contains: string }
    description?: { contains: string }
    location?: { contains: string }
  }>
}

type BlogWhereInput = {
  status?: string
  locale?: string
  OR?: Array<{
    title?: { contains: string }
    excerpt?: { contains: string }
    content?: { contains: string }
  }>
}

// Helper functions for database operations
export const db = {
  // Listings operations
  listings: {
    async findAll(filters?: {
      type?: string
      status?: string
      search?: string
      locale?: string
      limit?: number
    }) {
      const where: ListingWhereInput = {}

      if (filters?.type) where.type = filters.type
      if (filters?.status) where.status = filters.status
      if (filters?.locale) where.locale = filters.locale
      if (filters?.search) {
        where.OR = [
          { title: { contains: filters.search } },
          { description: { contains: filters.search } },
          { location: { contains: filters.search } }
        ]
      }

      const listings = await prisma.listing.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: filters?.limit
      })

      // JSON string olan alanları parse ederek tip uyumlu hale getiriyoruz
      return listings.map(listing => ({
        ...listing,
        features: listing.features ? JSON.parse(listing.features) : [],
        images: listing.images ? JSON.parse(listing.images) : []
      })) satisfies Listing[]
    },


    async findById(id: string) {
      const listing = await prisma.listing.findUnique({
        where: { id }
      })

      if (!listing) return null

      return {
        ...listing,
        features: listing.features ? JSON.parse(listing.features) : [],
        images: listing.images ? JSON.parse(listing.images) : []
      } satisfies Listing
    },

    async create(data: {
      title: string
      description: string
      location: string
      price: number
      currency?: string
      type: string
      status?: string
      propertyType: string
      area: number
      rooms?: number | null
      bathrooms?: number | null
      floor?: number | null
      buildingAge?: number | null
      features?: string[]
      images?: string[]
      coverImage?: string | null
      locale?: string
    }) {
      const listing = await prisma.listing.create({
        data: {
          ...data,
          features: JSON.stringify(data.features || []),
          images: JSON.stringify(data.images || [])
        }
      })

      return {
        ...listing,
        features: JSON.parse(listing.features),
        images: JSON.parse(listing.images)
      }
    },

    async update(
      id: string,
      data: Partial<{
        title: string
        description: string
        location: string
        price: number
        currency: string
        type: string
        status: string
        propertyType: string
        area: number
        rooms: number | null
        bathrooms: number | null
        floor: number | null
        buildingAge: number | null
        features: string[]
        images: string[]
        coverImage: string | null
        locale: string
      }>
    ) {
      const updateData: Record<string, unknown> = { ...data }

      // Stringify for saving
      if (data.features) {
        updateData.features = JSON.stringify(data.features)
      }
      if (data.images) {
        updateData.images = JSON.stringify(data.images)
      }

      const listing = await prisma.listing.update({
        where: { id },
        data: updateData
      })

      return {
        ...listing,
        features: listing.features ? JSON.parse(listing.features) : [],
        images: listing.images ? JSON.parse(listing.images) : []
      } satisfies Listing
    },

    async delete(id: string) {
      try {
        // First, check if the listing exists
        const listing = await prisma.listing.findUnique({
          where: { id }
        })

        if (!listing) {
          return false
        }

        // Delete cover image if exists
        if (listing.coverImage) {
          await deleteImageFile(listing.coverImage)
        }

        // Delete all images in the images array
        if (listing.images) {
          const images = JSON.parse(listing.images) as string[]
          for (const imageUrl of images) {
            await deleteImageFile(imageUrl)
          }
        }

        // Delete related view tracking records first
        await prisma.viewTracking.deleteMany({
          where: {
            entityType: 'listing',
            entityId: id
          }
        })

        // Then delete the listing
        await prisma.listing.delete({
          where: { id }
        })

        return true
      } catch (error) {
        console.error('Error deleting listing:', error)
        return false
      }
    },

    async incrementViews(id: string) {
      await prisma.listing.update({
        where: { id },
        data: { views: { increment: 1 } }
      })
    }
  },

  // Blog operations
  blog: {
    async findAll(filters?: {
      status?: string
      search?: string
      locale?: string
      limit?: number
    }) {
      const where: BlogWhereInput = {}

      if (filters?.status) where.status = filters.status
      if (filters?.locale) where.locale = filters.locale
      if (filters?.search) {
        where.OR = [
          { title: { contains: filters.search } },
          { excerpt: { contains: filters.search } },
          { content: { contains: filters.search } }
        ]
      }

      const posts = await prisma.blogPost.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: filters?.limit
      })

      return posts.map((post: { tags: string; [key: string]: unknown }) => ({
        ...post,
        tags: JSON.parse(post.tags) as string[]
      })) as BlogPost[] 
    },

    async findById(id: string) {
      const post = await prisma.blogPost.findUnique({
        where: { id }
      })

      if (!post) return null

      return {
        ...post,
        tags: JSON.parse(post.tags)
      }
    },

    async findBySlug(slug: string) {
      const post = await prisma.blogPost.findUnique({
        where: { slug }
      })

      if (!post) return null

      return {
        ...post,
        tags: JSON.parse(post.tags)
      }
    },

    async create(data: {
      title: string
      slug: string
      excerpt: string
      content: string
      coverImage?: string | null
      author: string
      status?: string
      tags?: string[]
      locale?: string
      publishedAt?: Date
    }) {
      const post = await prisma.blogPost.create({
        data: {
          ...data,
          tags: JSON.stringify(data.tags || [])
        }
      })

      return {
        ...post,
        tags: JSON.parse(post.tags)
      }
    },

    async update(id: string, data: Partial<{
      title: string
      slug: string
      excerpt: string
      content: string
      coverImage: string | null
      author: string
      status: string
      tags: string[]
      locale: string
      publishedAt: Date
    }>) {
      const updateData: Record<string, unknown> = { ...data }
      
      if (data.tags) {
        updateData.tags = JSON.stringify(data.tags)
      }

      const post = await prisma.blogPost.update({
        where: { id },
        data: updateData
      })

      return {
        ...post,
        tags: JSON.parse(post.tags)
      }
    },

    async delete(id: string) {
      try {
        // First, check if the blog post exists
        const post = await prisma.blogPost.findUnique({
          where: { id }
        })

        if (!post) {
          return false
        }

        // Delete cover image if exists
        if (post.coverImage) {
          await deleteImageFile(post.coverImage)
        }

        // Delete related view tracking records first
        await prisma.viewTracking.deleteMany({
          where: {
            entityType: 'blog',
            entityId: id
          }
        })

        // Then delete the blog post
        await prisma.blogPost.delete({
          where: { id }
        })

        return true
      } catch (error) {
        console.error('Error deleting blog post:', error)
        return false
      }
    },

    async incrementViews(id: string) {
      await prisma.blogPost.update({
        where: { id },
        data: { views: { increment: 1 } }
      })
    }
  },

  // Admin operations
  admin: {
    async findByUsername(username: string) {
      return await prisma.adminUser.findUnique({
        where: { username }
      })
    },

    async create(data: { username: string; password: string }) {
      return await prisma.adminUser.create({
        data
      })
    },

    async login(username: string, password: string) {
      const user = await prisma.adminUser.findUnique({
        where: { username }
      })

      if (!user) {
        return { success: false, error: 'Geçersiz kullanıcı adı veya şifre' }
      }

      // Verify password (supports both hashed and plain text for migration)
      let isValidPassword = false
      
      // Check if password is hashed (bcrypt hashes start with $2a$, $2b$, or $2y$)
      if (user.password.startsWith('$2')) {
        isValidPassword = await verifyPassword(password, user.password)
      } else {
        // Legacy plain text password - still support but should be migrated
        isValidPassword = user.password === password
        
        // Auto-migrate to hashed password on successful login
        if (isValidPassword) {
          const hashedPassword = await hashPassword(password)
          await prisma.adminUser.update({
            where: { username },
            data: { password: hashedPassword }
          })
        }
      }

      if (!isValidPassword) {
        return { success: false, error: 'Geçersiz kullanıcı adı veya şifre' }
      }

      // Create session
      const token = Math.random().toString(36).substring(2) + Date.now().toString(36)
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

      await prisma.session.create({
        data: {
          token,
          username,
          expiresAt
        }
      })

      return { success: true, token }
    },

    async updatePassword(username: string, newPassword: string) {
      const hashedPassword = await hashPassword(newPassword)
      
      await prisma.adminUser.update({
        where: { username },
        data: { password: hashedPassword }
      })

      return { success: true }
    },

    async verifySession(token: string) {
      const session = await prisma.session.findUnique({
        where: { token }
      })

      if (!session) {
        return { valid: false, error: 'Session not found' }
      }

      if (session.expiresAt < new Date()) {
        await prisma.session.delete({ where: { token } })
        return { valid: false, error: 'Session expired' }
      }

      return { valid: true, username: session.username }
    },

    async logout(token: string) {
      try {
        await prisma.session.delete({ where: { token } })
        return { success: true }
      } catch {
        return { success: false, error: 'Session not found' }
      }
    }
  },

  // Session operations
  sessions: {
    async create(data: { token: string; username: string; expiresAt: Date }) {
      return await prisma.session.create({
        data
      })
    },

    async findByToken(token: string) {
      return await prisma.session.findUnique({
        where: { token }
      })
    },

    async delete(token: string) {
      await prisma.session.delete({
        where: { token }
      })
    },

    async deleteExpired() {
      await prisma.session.deleteMany({
        where: {
          expiresAt: {
            lt: new Date()
          }
        }
      })
    }
  },

  // View tracking operations
  viewTracking: {
    async canView(entityType: string, entityId: string, identifier: string): Promise<boolean> {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)

      const recentView = await prisma.viewTracking.findFirst({
        where: {
          entityType,
          entityId,
          identifier,
          timestamp: {
            gte: oneHourAgo
          }
        }
      })

      return !recentView
    },

    async track(entityType: string, entityId: string, identifier: string) {
      await prisma.viewTracking.create({
        data: {
          entityType,
          entityId,
          identifier
        }
      })
    },

    async cleanup() {
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      
      await prisma.viewTracking.deleteMany({
        where: {
          timestamp: {
            lt: oneWeekAgo
          }
        }
      })
    }
  },

  // Page view tracking
  pageViews: {
    async track() {
      await prisma.pageView.create({
        data: {}
      })
    },

    async getCount(since?: Date) {
      const where = since ? {
        timestamp: {
          gte: since
        }
      } : undefined

      return await prisma.pageView.count({ where })
    }
  },

  // Stats operations
  stats: {
    async getOverview() {
      const [
        totalListings,
        activeListings,
        totalBlogPosts,
        publishedBlogPosts,
        totalViews
      ] = await Promise.all([
        prisma.listing.count(),
        prisma.listing.count({ where: { status: 'active' } }),
        prisma.blogPost.count(),
        prisma.blogPost.count({ where: { status: 'published' } }),
        prisma.pageView.count()
      ])

      return {
        totalListings,
        activeListings,
        totalBlogPosts,
        publishedBlogPosts,
        totalViews
      }
    }
  }
}

export default db
