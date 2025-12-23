import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import sharp from 'sharp'

// Maksimum dosya boyutu (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024

// İzin verilen dosya tipleri (HEIC dahil)
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif']

// Dosya adını güvenli hale getir
function sanitizeFilename(filename: string): string {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '-')
    .replace(/-+/g, '-')
}

// POST /api/upload - Resim yükleme
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string // 'listing' veya 'blog'

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Dosya bulunamadı' },
        { status: 400 }
      )
    }

    // Dosya tipi kontrolü - MIME type boş olabilir (iPhone/Mac için)
    if (file.type && !ALLOWED_TYPES.includes(file.type) && !file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz dosya tipi. Sadece resim dosyaları yüklenebilir.' },
        { status: 400 }
      )
    }

    // Dosya boyutu kontrolü
    // if (file.size > MAX_FILE_SIZE) {
    //   return NextResponse.json(
    //     { success: false, error: 'Dosya boyutu çok büyük. Maksimum 5MB olmalıdır.' },
    //     { status: 400 }
    //   )
    // }

    // Tip kontrolü
    if (!type || !['listing', 'blog'].includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz yükleme tipi' },
        { status: 400 }
      )
    }

    // Dosya adını oluştur (her zaman .jpg uzantısı kullan)
    const timestamp = Date.now()
    const filename = `${timestamp}-${Math.random().toString(36).substring(7)}.jpg`

    // Klasör yolunu belirle
    const uploadDir = join(process.cwd(), 'public', 'uploads', type)
    
    // Klasör yoksa oluştur
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Dosyayı normalize et ve kaydet
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // 🔥 NORMALIZATION: iPhone EXIF rotation fix + format conversion
    const normalizedBuffer = await sharp(buffer)
      .rotate() // EXIF orientation'ı otomatik düzelt (iPhone için kritik)
      .jpeg({ quality: 85, mozjpeg: true }) // Tüm formatları JPEG'e çevir
      .toBuffer()
    
    const filepath = join(uploadDir, filename)
    await writeFile(filepath, normalizedBuffer)

    // URL'i döndür
    const url = `/uploads/${type}/${filename}`

    return NextResponse.json({
      success: true,
      data: {
        url,
        filename,
        size: normalizedBuffer.length,
        type: 'image/jpeg'
      }
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { success: false, error: 'Dosya yüklenirken bir hata oluştu' },
      { status: 500 }
    )
  }
}
