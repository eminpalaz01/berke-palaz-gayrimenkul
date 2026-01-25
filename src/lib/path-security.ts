/**
 * Path Security Helper
 * Güvenli dosya yolu doğrulama fonksiyonları
 * Path Traversal saldırılarına karşı koruma sağlar
 */

import path from 'path'

/**
 * Kullanıcı tarafından sağlanan path'in güvenli olup olmadığını kontrol eder
 * Path Traversal saldırılarını engeller
 * 
 * @param userPath - Kullanıcıdan gelen path
 * @param allowedDir - İzin verilen dizin (örn: 'public/configs')
 * @returns Path güvenliyse true, değilse false
 * 
 * @example
 * ```typescript
 * // Güvenli kullanım
 * isPathSafe('public/configs/config.json', 'public/configs') // true
 * 
 * // Path traversal denemesi
 * isPathSafe('public/configs/../../etc/passwd', 'public/configs') // false
 * isPathSafe('../../../etc/passwd', 'public/configs') // false
 * ```
 */
export function isPathSafe(userPath: string, allowedDir: string): boolean {
  try {
    // 1. Null byte injection kontrolü
    if (userPath.includes('\0')) {
      return false
    }

    // 2. Absolute path'leri reddet (güvenlik riski)
    if (path.isAbsolute(userPath)) {
      return false
    }

    // 3. Path'leri resolve et (tüm .. ve . referanslarını çöz)
    const resolvedPath = path.resolve(process.cwd(), userPath)
    const resolvedAllowedDir = path.resolve(process.cwd(), allowedDir)

    // 4. Relative path hesapla
    const relativePath = path.relative(resolvedAllowedDir, resolvedPath)

    // 5. Path güvenlik kontrolleri
    // - relativePath '..' ile başlıyorsa, izin verilen dizinin dışına çıkıyor demektir
    // - relativePath absolute ise, farklı bir root'a işaret ediyor demektir
    const isSafe = !relativePath.startsWith('..') && !path.isAbsolute(relativePath)

    return isSafe
  } catch (error) {
    // Herhangi bir hata durumunda güvenli olmadığını varsay
    console.error('Path validation error:', error)
    return false
  }
}

/**
 * Kullanıcı path'ini normalize eder ve güvenlik kontrolü yapar
 * 
 * @param userPath - Kullanıcıdan gelen path
 * @param allowedDir - İzin verilen dizin
 * @returns Güvenli ve normalize edilmiş path veya null
 * 
 * @example
 * ```typescript
 * const safePath = sanitizePath('public/configs/config.json', 'public/configs')
 * if (safePath) {
 *   // Güvenli path kullan
 *   const fullPath = path.join(process.cwd(), safePath)
 * }
 * ```
 */
export function sanitizePath(userPath: string, allowedDir: string): string | null {
  if (!isPathSafe(userPath, allowedDir)) {
    return null
  }

  // Path'i normalize et (güvenli olduğunu biliyoruz)
  const normalizedPath = path.normalize(userPath)
  
  // Windows/Linux uyumluluğu için path separator'ları kontrol et
  const allowedDirNormalized = path.normalize(allowedDir)
  
  // Her iki platform için de kontrol et
  const startsWithAllowedDir = 
    normalizedPath.startsWith(allowedDirNormalized + path.sep) ||
    normalizedPath === allowedDirNormalized

  if (!startsWithAllowedDir) {
    return null
  }

  return normalizedPath
}

/**
 * Config dosyaları için özel güvenlik kontrolü
 * Sadece .json uzantılı dosyalara izin verir
 * 
 * @param userPath - Kullanıcıdan gelen path
 * @returns Path güvenliyse true, değilse false
 */
export function isConfigPathSafe(userPath: string): boolean {
  // 1. Temel path güvenlik kontrolü
  if (!isPathSafe(userPath, 'public/configs')) {
    return false
  }

  // 2. Dosya uzantısı kontrolü
  const ext = path.extname(userPath).toLowerCase()
  if (ext !== '.json') {
    return false
  }

  // 3. Dosya adı kontrolü (tehlikeli karakterler)
  const basename = path.basename(userPath)
  const dangerousChars = /[<>:"|?*\x00-\x1f]/
  if (dangerousChars.test(basename)) {
    return false
  }

  return true
}

/**
 * Upload dosyaları için güvenlik kontrolü
 * 
 * @param userPath - Kullanıcıdan gelen path
 * @param uploadType - Upload tipi ('listing' veya 'blog')
 * @returns Path güvenliyse true, değilse false
 */
export function isUploadPathSafe(userPath: string, uploadType: 'listing' | 'blog'): boolean {
  const allowedDir = `public/uploads/${uploadType}`
  
  // 1. Temel path güvenlik kontrolü
  if (!isPathSafe(userPath, allowedDir)) {
    return false
  }

  // 2. İzin verilen resim uzantıları
  const ext = path.extname(userPath).toLowerCase()
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
  if (!allowedExtensions.includes(ext)) {
    return false
  }

  return true
}
