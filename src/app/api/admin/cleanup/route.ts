import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminAuth } from '@/lib/auth-helper'
import { readdir, unlink, stat } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { db } from '@/lib/db'
import { withApiSecurity, SecurityPresets } from '@/lib/api-security'

/**
 * Cleanup orphaned files - Veritabanında referansı olmayan dosyaları temizler
 * GET /api/admin/cleanup?dryRun=true - Sadece rapor gösterir
 * POST /api/admin/cleanup - Gerçekten siler
 */

interface OrphanedFile {
  path: string
  type: 'listing' | 'blog'
  filename: string
  size: number
}

async function findOrphanedFiles(): Promise<OrphanedFile[]> {
  const orphanedFiles: OrphanedFile[] = []
  const uploadsDir = join(process.cwd(), 'uploads')

  // Check listing files
  const listingDir = join(uploadsDir, 'listing')
  if (existsSync(listingDir)) {
    const listingFiles = await readdir(listingDir)
    const allListings = await db.listings.findAll({})
    
    // Tüm listing'lerdeki tüm resimleri topla
    const usedListingImages = new Set<string>()
    for (const listing of allListings) {
      if (listing.coverImage) {
        const filename = listing.coverImage.split('/').pop()
        if (filename) usedListingImages.add(filename)
      }
      if (listing.images && Array.isArray(listing.images)) {
        for (const img of listing.images) {
          const filename = img.split('/').pop()
          if (filename) usedListingImages.add(filename)
        }
      }
    }

    // Kullanılmayan dosyaları bul
    for (const file of listingFiles) {
      if (file === '.gitkeep') continue
      if (!usedListingImages.has(file)) {
        const filePath = join(listingDir, file)
        const stats = await stat(filePath)
        orphanedFiles.push({
          path: filePath,
          type: 'listing',
          filename: file,
          size: stats.size
        })
      }
    }
  }

  // Check blog files
  const blogDir = join(uploadsDir, 'blog')
  if (existsSync(blogDir)) {
    const blogFiles = await readdir(blogDir)
    const allPosts = await db.blog.findAll({})
    
    // Tüm blog post'lardaki tüm resimleri topla
    const usedBlogImages = new Set<string>()
    for (const post of allPosts) {
      if (post.coverImage) {
        const filename = post.coverImage.split('/').pop()
        if (filename) usedBlogImages.add(filename)
      }
    }

    // Kullanılmayan dosyaları bul
    for (const file of blogFiles) {
      if (file === '.gitkeep') continue
      if (!usedBlogImages.has(file)) {
        const filePath = join(blogDir, file)
        const stats = await stat(filePath)
        orphanedFiles.push({
          path: filePath,
          type: 'blog',
          filename: file,
          size: stats.size
        })
      }
    }
  }

  return orphanedFiles
}

// GET - Dry run, sadece rapor göster
async function getHandler(request: NextRequest) {
  const auth = await verifyAdminAuth(request)
  if (!auth.authenticated) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const orphanedFiles = await findOrphanedFiles()
    
    const totalSize = orphanedFiles.reduce((sum, file) => sum + file.size, 0)
    const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2)

    return NextResponse.json({
      success: true,
      data: {
        orphanedFiles: orphanedFiles.map(f => ({
          type: f.type,
          filename: f.filename,
          size: f.size,
          sizeMB: (f.size / (1024 * 1024)).toFixed(2)
        })),
        summary: {
          totalFiles: orphanedFiles.length,
          totalSize: totalSize,
          totalSizeMB: totalSizeMB,
          byType: {
            listing: orphanedFiles.filter(f => f.type === 'listing').length,
            blog: orphanedFiles.filter(f => f.type === 'blog').length
          }
        }
      }
    })
  } catch (error) {
    console.error('Cleanup scan error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to scan for orphaned files' },
      { status: 500 }
    )
  }
}

// POST - Gerçekten sil
async function postHandler(request: NextRequest) {
  const auth = await verifyAdminAuth(request)
  if (!auth.authenticated) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const orphanedFiles = await findOrphanedFiles()
    
    const deletedFiles: string[] = []
    const failedFiles: Array<{ filename: string; error: string }> = []

    for (const file of orphanedFiles) {
      try {
        await unlink(file.path)
        deletedFiles.push(file.filename)
        console.log(`Deleted orphaned file: ${file.filename}`)
      } catch (error) {
        console.error(`Failed to delete ${file.filename}:`, error)
        failedFiles.push({
          filename: file.filename,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        deletedCount: deletedFiles.length,
        deletedFiles,
        failedCount: failedFiles.length,
        failedFiles
      },
      message: `Successfully deleted ${deletedFiles.length} orphaned files`
    })
  } catch (error) {
    console.error('Cleanup error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to cleanup orphaned files' },
      { status: 500 }
    )
  }
}

export const GET = withApiSecurity(getHandler, SecurityPresets.PUBLIC_READ_ONLY)
export const POST = withApiSecurity(postHandler, SecurityPresets.PUBLIC_READ_ONLY)
