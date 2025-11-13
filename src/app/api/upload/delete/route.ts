import { NextRequest, NextResponse } from 'next/server'
import { deleteImageFile } from '@/lib/upload-helper'

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

    const result = await deleteImageFile(url)

    if (!result.success) {
      const status = result.error === 'Dosya bulunamadı' ? 404 : 
                     result.error === 'Geçersiz dosya yolu' ? 403 : 500
      return NextResponse.json(result, { status })
    }

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
