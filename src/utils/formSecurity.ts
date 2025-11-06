/**
 * Form Security Utilities
 * Provides comprehensive input validation and sanitization to prevent security vulnerabilities
 */

// XSS Prevention - HTML encoding
export function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  }
  
  return text.replace(/[&<>"'`=\/]/g, (s) => map[s])
}

// SQL Injection Prevention - Basic sanitization
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return ''
  
  // Remove potentially dangerous characters and patterns
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .replace(/script/gi, '') // Remove script tags
    .replace(/['"]/g, '') // Remove quotes to prevent injection
    .trim()
}

// Email validation with security considerations
export function validateEmail(email: string): { isValid: boolean; error?: string } {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email is required' }
  }

  // Length check to prevent buffer overflow attacks
  if (email.length > 254) {
    return { isValid: false, error: 'Email is too long' }
  }

  // Basic email regex with security considerations
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Invalid email format' }
  }

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /javascript:/i,
    /data:/i,
    /vbscript:/i,
    /<script/i,
    /on\w+=/i
  ]

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(email)) {
      return { isValid: false, error: 'Invalid email format' }
    }
  }

  return { isValid: true }
}

// Phone number validation
export function validatePhone(phone: string): { isValid: boolean; error?: string } {
  if (!phone || typeof phone !== 'string') {
    return { isValid: false, error: 'Phone number is required' }
  }

  // Remove spaces, dashes, parentheses for validation
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '')
  
  // Length check
  if (cleanPhone.length < 10 || cleanPhone.length > 15) {
    return { isValid: false, error: 'Phone number must be between 10-15 digits' }
  }

  // Only allow numbers and + at the beginning
  const phoneRegex = /^\+?[0-9]+$/
  if (!phoneRegex.test(cleanPhone)) {
    return { isValid: false, error: 'Phone number can only contain numbers and + at the beginning' }
  }

  return { isValid: true }
}

// Name validation (prevents injection attacks)
export function validateName(name: string): { isValid: boolean; error?: string } {
  if (!name || typeof name !== 'string') {
    return { isValid: false, error: 'Name is required' }
  }

  // Length check
  if (name.length < 2 || name.length > 50) {
    return { isValid: false, error: 'Name must be between 2-50 characters' }
  }

  // Only allow letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s\-']+$/
  if (!nameRegex.test(name)) {
    return { isValid: false, error: 'Name can only contain letters, spaces, hyphens, and apostrophes' }
  }

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /javascript:/i,
    /<script/i,
    /on\w+=/i,
    /[<>]/
  ]

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(name)) {
      return { isValid: false, error: 'Invalid characters in name' }
    }
  }

  return { isValid: true }
}

// Text area validation (for messages, descriptions, etc.)
export function validateTextArea(text: string, maxLength: number = 1000): { isValid: boolean; error?: string } {
  if (!text || typeof text !== 'string') {
    return { isValid: false, error: 'Text is required' }
  }

  // Length check
  if (text.length > maxLength) {
    return { isValid: false, error: `Text must be less than ${maxLength} characters` }
  }

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /javascript:/i,
    /<script/i,
    /on\w+=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i
  ]

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(text)) {
      return { isValid: false, error: 'Text contains invalid content' }
    }
  }

  return { isValid: true }
}

// Subject validation
export function validateSubject(subject: string): { isValid: boolean; error?: string } {
  if (!subject || typeof subject !== 'string') {
    return { isValid: false, error: 'Subject is required' }
  }

  // Length check
  if (subject.length < 3 || subject.length > 100) {
    return { isValid: false, error: 'Subject must be between 3-100 characters' }
  }

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /javascript:/i,
    /<script/i,
    /on\w+=/i,
    /[<>]/
  ]

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(subject)) {
      return { isValid: false, error: 'Subject contains invalid characters' }
    }
  }

  return { isValid: true }
}

// Rate limiting helper (client-side basic implementation)
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map()
  private maxAttempts: number
  private windowMs: number

  constructor(maxAttempts: number = 5, windowMs: number = 60000) { // 5 attempts per minute
    this.maxAttempts = maxAttempts
    this.windowMs = windowMs
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now()
    const attempts = this.attempts.get(identifier) || []
    
    // Remove old attempts outside the window
    const validAttempts = attempts.filter(time => now - time < this.windowMs)
    
    if (validAttempts.length >= this.maxAttempts) {
      return false
    }

    // Add current attempt
    validAttempts.push(now)
    this.attempts.set(identifier, validAttempts)
    
    return true
  }

  getRemainingTime(identifier: string): number {
    const attempts = this.attempts.get(identifier) || []
    if (attempts.length === 0) return 0
    
    const oldestAttempt = Math.min(...attempts)
    const remainingTime = this.windowMs - (Date.now() - oldestAttempt)
    
    return Math.max(0, remainingTime)
  }
}

// CSRF Token generation (basic client-side implementation)
export function generateCSRFToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

// File upload validation
export function validateFile(file: File, allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/jpg'], maxSize: number = 5 * 1024 * 1024): { isValid: boolean; error?: string } {
  if (!file) {
    return { isValid: false, error: 'File is required' }
  }

  // Check file size (default 5MB)
  if (file.size > maxSize) {
    return { isValid: false, error: `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB` }
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: `File type must be one of: ${allowedTypes.join(', ')}` }
  }

  // Check file name for suspicious patterns
  const suspiciousPatterns = [
    /\.exe$/i,
    /\.bat$/i,
    /\.cmd$/i,
    /\.scr$/i,
    /\.php$/i,
    /\.jsp$/i,
    /\.asp$/i,
    /javascript:/i,
    /<script/i
  ]

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(file.name)) {
      return { isValid: false, error: 'File type not allowed' }
    }
  }

  return { isValid: true }
}

// Comprehensive form validation
export interface FormValidationResult {
  isValid: boolean
  errors: { [key: string]: string }
  sanitizedData: { [key: string]: string }
}

export function validateContactForm(formData: {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}): FormValidationResult {
  const errors: { [key: string]: string } = {}
  const sanitizedData: { [key: string]: string } = {}

  // Validate name
  const nameValidation = validateName(formData.name)
  if (!nameValidation.isValid) {
    errors.name = nameValidation.error!
  } else {
    sanitizedData.name = sanitizeInput(formData.name)
  }

  // Validate email
  const emailValidation = validateEmail(formData.email)
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error!
  } else {
    sanitizedData.email = sanitizeInput(formData.email)
  }

  // Validate phone (optional)
  if (formData.phone) {
    const phoneValidation = validatePhone(formData.phone)
    if (!phoneValidation.isValid) {
      errors.phone = phoneValidation.error!
    } else {
      sanitizedData.phone = sanitizeInput(formData.phone)
    }
  }

  // Validate subject
  const subjectValidation = validateSubject(formData.subject)
  if (!subjectValidation.isValid) {
    errors.subject = subjectValidation.error!
  } else {
    sanitizedData.subject = sanitizeInput(formData.subject)
  }

  // Validate message
  const messageValidation = validateTextArea(formData.message, 2000)
  if (!messageValidation.isValid) {
    errors.message = messageValidation.error!
  } else {
    sanitizedData.message = sanitizeInput(formData.message)
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData
  }
}
