import bcrypt from 'bcryptjs'

/**
 * Password hashing and verification utilities
 * Uses bcrypt for secure password hashing
 */

const SALT_ROUNDS = 12 // Higher = more secure but slower

/**
 * Hash a plain text password
 * @param password - Plain text password to hash
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters long')
  }
  
  const salt = await bcrypt.genSalt(SALT_ROUNDS)
  const hashedPassword = await bcrypt.hash(password, salt)
  
  return hashedPassword
}

/**
 * Verify a plain text password against a hashed password
 * @param password - Plain text password to verify
 * @param hashedPassword - Hashed password to compare against
 * @returns True if password matches, false otherwise
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hashedPassword)
  } catch (error) {
    console.error('Password verification error:', error)
    return false
  }
}

/**
 * Validate password strength
 * @param password - Password to validate
 * @returns Object with validation result and message
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean
  message: string
} {
  if (!password) {
    return { isValid: false, message: 'Şifre gereklidir' }
  }

  if (password.length < 6) {
    return { isValid: false, message: 'Şifre en az 6 karakter olmalıdır' }
  }

  if (password.length > 128) {
    return { isValid: false, message: 'Şifre çok uzun' }
  }

  // Check for at least one number (optional but recommended)
  const hasNumber = /\d/.test(password)
  
  // Check for at least one letter (optional but recommended)
  const hasLetter = /[a-zA-Z]/.test(password)

  if (!hasNumber || !hasLetter) {
    return {
      isValid: true, // Still valid but warn user
      message: 'Daha güvenli bir şifre için harf ve rakam kullanın'
    }
  }

  return { isValid: true, message: 'Şifre güçlü' }
}

/**
 * Check if a password needs to be rehashed (e.g., if salt rounds changed)
 * @param hashedPassword - Hashed password to check
 * @returns True if password needs rehashing
 */
export function needsRehash(hashedPassword: string): boolean {
  try {
    const rounds = bcrypt.getRounds(hashedPassword)
    return rounds < SALT_ROUNDS
  } catch (error) {
    // If we can't get rounds, assume it needs rehashing
    return true
  }
}
