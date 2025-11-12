// Resim yükleme yardımcı fonksiyonları

export interface UploadResponse {
  success: boolean
  data?: {
    url: string
    filename: string
    size: number
    type: string
  }
  error?: string
}

/**
 * Resim yükle
 * @param file - Yüklenecek dosya
 * @param type - 'listing' veya 'blog'
 * @returns Upload response
 */
export async function uploadImage(
  file: File,
  type: 'listing' | 'blog'
): Promise<UploadResponse> {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Upload error:', error)
    return {
      success: false,
      error: 'Dosya yüklenirken bir hata oluştu',
    }
  }
}

/**
 * Resim sil
 * @param url - Silinecek resmin URL'i
 * @returns Silme sonucu
 */
export async function deleteImage(url: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`/api/upload/delete?url=${encodeURIComponent(url)}`, {
      method: 'DELETE',
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Delete error:', error)
    return {
      success: false,
      error: 'Dosya silinirken bir hata oluştu',
    }
  }
}

/**
 * Çoklu resim yükle
 * @param files - Yüklenecek dosyalar
 * @param type - 'listing' veya 'blog'
 * @returns Upload sonuçları
 */
export async function uploadMultipleImages(
  files: File[],
  type: 'listing' | 'blog'
): Promise<UploadResponse[]> {
  const uploadPromises = files.map((file) => uploadImage(file, type))
  return Promise.all(uploadPromises)
}

/**
 * Dosya boyutunu okunabilir formata çevir
 * @param bytes - Byte cinsinden boyut
 * @returns Okunabilir format (örn: "2.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Dosya tipini kontrol et
 * @param file - Kontrol edilecek dosya
 * @returns Geçerli mi?
 */
export function isValidImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
  return validTypes.includes(file.type)
}

/**
 * Dosya boyutunu kontrol et
 * @param file - Kontrol edilecek dosya
 * @param maxSizeMB - Maksimum boyut (MB)
 * @returns Geçerli mi?
 */
export function isValidFileSize(file: File, maxSizeMB: number = 5): boolean {
  const maxBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxBytes
}

/**
 * Resim önizlemesi oluştur
 * @param file - Önizleme oluşturulacak dosya
 * @returns Data URL
 */
export function createImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string)
      } else {
        reject(new Error('Önizleme oluşturulamadı'))
      }
    }
    reader.onerror = () => reject(new Error('Dosya okunamadı'))
    reader.readAsDataURL(file)
  })
}
