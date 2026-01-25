import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir, unlink } from 'fs/promises'
import { join, normalize } from 'path'
import { existsSync } from 'fs'
import sharp from 'sharp'
import crypto from 'crypto'
import { fileTypeFromBuffer } from 'file-type'
import { verifyAdminAuth } from '@/lib/auth-helper'
import { withApiSecurity, SecurityPresets } from '@/lib/api-security'

const MAX_FILE_SIZE = 25 * 1024 * 1024 // 20MB
const MAX_IMAGE_PIXELS = 40_000_000 // ~40MP (pixel bomb koruması)

const ALLOWED_IMAGE_FORMATS = ['jpeg', 'png', 'webp', 'heic', 'heif']
const ALLOWED_TYPES = ['listing', 'blog'] as const

function generateSecureFilename(): string {
  const hash = crypto.randomBytes(16).toString('hex')
  return `${Date.now()}-${hash}.jpg`
}

async function isRealImage(buffer: Buffer): Promise<boolean> {
  // 1️⃣ Magic bytes kontrolü
  const fileType = await fileTypeFromBuffer(buffer)
  if (!fileType || !fileType.mime.startsWith('image/')) return false

  try {
    // 2️⃣ Sharp parse
    const metadata = await sharp(buffer).metadata()
    if (!metadata.format) return false

    // 3️⃣ Allow-list
    if (!ALLOWED_IMAGE_FORMATS.includes(metadata.format)) return false

    // 4️⃣ Pixel bomb koruması
    if (
      metadata.width &&
      metadata.height &&
      metadata.width * metadata.height > MAX_IMAGE_PIXELS
    ) {
      return false
    }
  } catch {
    return false
  }

  return true
}

/**
 * Geçici dosyayı temizle
 */
async function cleanupTempFile(filepath: string): Promise<void> {
  try {
    if (existsSync(filepath)) {
      await unlink(filepath)
      console.log(`Cleaned up temp file: ${filepath}`)
    }
  } catch (error) {
    console.error(`Failed to cleanup temp file ${filepath}:`, error)
  }
}

async function handler(request: NextRequest) {
  // 🔐 Admin authentication check
  const auth = await verifyAdminAuth(request)
  if (!auth.authenticated) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  let tempFilepath: string | null = null

  try {
    const formData = await request.formData()

    const file = formData.get('file')
    const type = formData.get('type')
    const tempId = formData.get('tempId') // Opsiyonel: Frontend'den gelen geçici ID

    // 🔐 FormData poisoning önlemi
    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz dosya' },
        { status: 400 }
      )
    }

    if (typeof type !== 'string' || !ALLOWED_TYPES.includes(type as any)) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz yükleme tipi' },
        { status: 400 }
      )
    }

    // 🔐 Size check
    if (file.size === 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'Dosya boyutu geçersiz (max 20MB)' },
        { status: 400 }
      )
    }

    // Buffer al
    const buffer = Buffer.from(await file.arrayBuffer())

    // 🔥 Gerçek image kontrolü
    const validImage = await isRealImage(buffer)
    if (!validImage) {
      return NextResponse.json(
        { success: false, error: 'Dosya geçerli bir resim değil' },
        { status: 400 }
      )
    }

    // 🔐 Path traversal sertleştirme
    const safeType = normalize(type).replace(/(\.\.(\/|\\))/g, '')
    const uploadDir = join(process.cwd(), 'uploads', safeType)

    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    const filename = generateSecureFilename()
    const filepath = join(uploadDir, filename)
    tempFilepath = filepath // Hata durumunda temizlemek için sakla

    // 🔥 Re-encode (payload tamamen temizlenir)
    const normalizedBuffer = await sharp(buffer, { failOnError: true })
      .rotate()
      .resize(2000, 2000, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({
        quality: 85,
        mozjpeg: true
      })
      .toBuffer()

    await writeFile(filepath, normalizedBuffer, { mode: 0o644 })

    // Başarılı upload - artık temizleme yapma
    tempFilepath = null

    return NextResponse.json({
      success: true,
      data: {
        url: `/api/files/${safeType}/${filename}`,
        filename,
        size: normalizedBuffer.length,
        type: 'image/jpeg',
        tempId: tempId || undefined // Frontend'e geri gönder
      }
    })
  } catch (err) {
    // Hata durumunda geçici dosyayı temizle
    if (tempFilepath) {
      await cleanupTempFile(tempFilepath)
    }

    // 🔐 Internal error leak yok
    console.error('Upload error:', err)
    return NextResponse.json(
      { success: false, error: 'Dosya yüklenemedi' },
      { status: 500 }
    )
  }
}

export const POST = withApiSecurity(handler, SecurityPresets.PUBLIC_READ_ONLY)
