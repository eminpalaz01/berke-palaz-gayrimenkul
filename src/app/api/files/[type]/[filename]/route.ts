import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { withApiSecurity, SecurityPresets } from '@/lib/api-security'

// İzin verilen dosya tipleri
const ALLOWED_TYPES = ['listing', 'blog'] as const
type UploadType = typeof ALLOWED_TYPES[number]

// Güvenli path kontrolü
function isPathSafe(type: string, filename: string): boolean {
  // Type kontrolü
  if (!ALLOWED_TYPES.includes(type as UploadType)) {
    return false
  }

  // Filename kontrolü - sadece güvenli karakterler
  const safeFilenameRegex = /^[a-zA-Z0-9\-_.]+\.(jpg|jpeg|png|webp|gif)$/
  if (!safeFilenameRegex.test(filename)) {
    return false
  }

  // Path traversal kontrolü
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return false
  }

  return true
}

// Cache control headers
function getCacheHeaders() {
  return {
    'Cache-Control': 'public, max-age=31536000, immutable',
    'X-Content-Type-Options': 'nosniff',
  }
}

async function handler(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; filename: string }> }
) {
  try {
    const { type, filename } = await params

    // Güvenlik kontrolü
    if (!isPathSafe(type, filename)) {
      return new NextResponse('Invalid file path', { status: 400 })
    }

    // Dosya yolu (root/uploads)
    const filepath = join(process.cwd(), 'uploads', type, filename)

    // Dosya var mı kontrol et
    if (!existsSync(filepath)) {
      return new NextResponse('File not found', { status: 404 })
    }

    // Dosyayı oku
    const fileBuffer = await readFile(filepath)

    // Content-Type belirleme
    const ext = filename.split('.').pop()?.toLowerCase()
    const contentTypeMap: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
      gif: 'image/gif',
    }
    const contentType = contentTypeMap[ext || ''] || 'application/octet-stream'

    // Response oluştur
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        ...getCacheHeaders(),
      },
    })
  } catch (error) {
    console.error('File serving error:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; filename: string }> }
) {
  return withApiSecurity(async (req: NextRequest) => {
    return handler(req, { params })
  }, SecurityPresets.PUBLIC_READ_ONLY)(request)
}
