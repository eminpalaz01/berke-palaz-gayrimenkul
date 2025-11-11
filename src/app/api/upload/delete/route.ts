import { NextRequest, NextResponse } from 'next/server'
import { unlink } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

// DELETE /api/upload/delete - Resim silme
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'URL parametresi gerekli' },
        { status: 400 }
      )
    }

    // URL'den dosya yolunu çıkar
    // Örnek: /uploads/listing/123456.jpg -> public/uploads/listing/123456.jpg
    const filepath = join(process.cwd(), 'public', url)

    // Dosya var mı kontrol et
    if (!existsSync(filepath)) {
      return NextResponse.json(
        { success: false, error: 'Dosya bulunamadı' },
        { status: 404 }
      )
    }

    // Güvenlik kontrolü - sadece uploads klasöründeki dosyaları sil
    if (!filepath.includes(join('public', 'uploads'))) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz dosya yolu' },
        { status: 403 }
      )
    }

    // Dosyayı sil
    await unlink(filepath)

    return NextResponse.json({
      success: true,
      message: 'Dosya başarıyla silindi'
    })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { success: false, error: 'Dosya silinirken bir hata oluştu' },
      { status: 500 }
    )
  }
}
