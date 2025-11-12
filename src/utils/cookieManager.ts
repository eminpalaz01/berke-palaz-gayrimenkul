"use client"

import { ConsentPreferences } from '@/components/ui/LegalConsent'

// Event system for real-time synchronization
class EventEmitter {
  private events: Record<string, ((...args: unknown[]) => void)[]> = {}

  on(event: string, callback: (...args: unknown[]) => void) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(callback)
  }

  off(event: string, callback: (...args: unknown[]) => void) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback)
    }
  }

  emit(event: string, data?: unknown) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data))
    }
  }
}

// Global event emitter for cookie/consent changes
export const cookieEvents = new EventEmitter()

// Legal logging interface
interface LegalLogEntry {
  id: string
  timestamp: number
  action: 'consent_given' | 'consent_withdrawn' | 'data_exported' | 'data_deleted' | 'form_submitted' | 'cookie_set' | 'cookie_deleted'
  details: {
    consentType?: string
    formType?: string
    dataType?: string
    userAgent: string
    sessionId: string
    ipHash?: string // Hashed IP for legal compliance
  }
  metadata?: Record<string, unknown>
}

// Cookie names
export const COOKIE_NAMES = {
  CONSENT: 'user_consent_preferences',
  SESSION: 'session_id',
  ANALYTICS: 'analytics_tracking',
  FUNCTIONAL: 'functional_preferences',
  MARKETING: 'marketing_preferences'
} as const

// Cookie expiration times (in days)
export const COOKIE_EXPIRY = {
  CONSENT: 365, // 1 year
  SESSION: 1, // 1 day
  ANALYTICS: 30, // 30 days
  FUNCTIONAL: 90, // 3 months
  MARKETING: 30 // 30 days
} as const

// Data we collect and store
export interface CollectedData {
  // Essential data (always collected)
  sessionId: string
  timestamp: number
  locale: string
  userAgent: string
  
  // Optional data (based on consent)
  analytics?: {
    pageViews: string[]
    timeOnSite: number
    referrer: string
    screenResolution: string
  }
  functional?: {
    themePreference: 'light' | 'dark' | 'system'
    languagePreference: string
    searchHistory: string[]
  }
  marketing?: {
    campaignSource: string
    adClickId: string
    marketingSegment: string
  }
}

// Form data we collect
export interface FormDataCollection {
  contactForm: {
    name: string
    email: string
    phone?: string
    subject: string
    message: string
    submissionTime: number
    ipAddress?: string // Only if legally required
    userAgent: string
  }
  hrForm: {
    personalInfo: {
      firstName: string
      lastName: string
      email: string
      phone: string
      // ... other HR form fields
    }
    submissionTime: number
    ipAddress?: string // Only if legally required
    userAgent: string
  }
}

/**
 * Legal logging utility
 */
export class LegalLogger {
  private static readonly LOG_KEY = 'legal_audit_log'
  private static readonly MAX_LOG_ENTRIES = 1000 // Keep last 1000 entries

  /**
   * Add a legal log entry
   */
  static addLogEntry(action: LegalLogEntry['action'], details: Partial<LegalLogEntry['details']>, metadata?: Record<string, unknown>): void {
    try {
      const logEntry: LegalLogEntry = {
        id: this.generateLogId(),
        timestamp: Date.now(),
        action,
        details: {
          userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
          sessionId: CookieManager.getSessionId(),
          ...details
        },
        metadata
      }

      // Get existing logs
      const existingLogs = this.getLogs()
      existingLogs.push(logEntry)

      // Keep only the last MAX_LOG_ENTRIES
      if (existingLogs.length > this.MAX_LOG_ENTRIES) {
        existingLogs.splice(0, existingLogs.length - this.MAX_LOG_ENTRIES)
      }

      // Store in localStorage (in production, this should be sent to a secure backend)
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.LOG_KEY, JSON.stringify(existingLogs))
      }

      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Legal Log Entry:', logEntry)
      }
    } catch (error) {
      console.error('Error adding legal log entry:', error)
    }
  }

  /**
   * Get all legal logs
   */
  static getLogs(): LegalLogEntry[] {
    try {
      if (typeof window === 'undefined') return []
      const logs = localStorage.getItem(this.LOG_KEY)
      return logs ? JSON.parse(logs) : []
    } catch (error) {
      console.error('Error getting legal logs:', error)
      return []
    }
  }

  /**
   * Clear all legal logs (for data deletion requests)
   */
  static clearLogs(): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(this.LOG_KEY)
      }
      this.addLogEntry('data_deleted', { dataType: 'legal_logs' })
    } catch (error) {
      console.error('Error clearing legal logs:', error)
    }
  }

  /**
   * Generate a unique log ID
   */
  private static generateLogId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
  }

  /**
   * Hash IP address for privacy compliance
   */
  static hashIP(ip: string): string {
    // Simple hash function for IP anonymization
    let hash = 0
    for (let i = 0; i < ip.length; i++) {
      const char = ip.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return `ip_${Math.abs(hash).toString(36)}`
  }

  /**
   * Export legal logs for compliance
   */
  static exportLogs(): Record<string, unknown> {
    const logs = this.getLogs()
    return {
      totalEntries: logs.length,
      exportDate: new Date().toISOString(),
      logs: logs.map(log => ({
        ...log,
        timestamp: new Date(log.timestamp).toISOString()
      })),
      retentionPolicy: 'Logs are kept for legal compliance and automatically purged after 1000 entries',
      privacyNote: 'IP addresses are hashed for privacy protection'
    }
  }
}

/**
 * Cookie utility functions
 */
export class CookieManager {
  /**
   * Set a cookie with proper expiration and security settings
   */
  static setCookie(name: string, value: string, days: number = 30, essential: boolean = false): void {
    try {
      const expires = new Date()
      expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000))
      
      const cookieOptions = [
        `${name}=${encodeURIComponent(value)}`,
        `expires=${expires.toUTCString()}`,
        'path=/',
        'SameSite=Strict'
      ]
      
      // Add Secure flag for HTTPS
      if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
        cookieOptions.push('Secure')
      }
      
      document.cookie = cookieOptions.join('; ')
      
      // Legal logging for non-essential cookies
      if (!essential) {
        LegalLogger.addLogEntry('cookie_set', {
          dataType: name,
          consentType: this.getCookieConsentType(name)
        }, {
          expiryDays: days,
          essential: false
        })
      }

      // Emit event for real-time sync
      cookieEvents.emit('cookie_changed', { name, value, action: 'set' })
      
    } catch (error) {
      console.error('Error setting cookie:', error)
    }
  }

  /**
   * Get a cookie value
   */
  static getCookie(name: string): string | null {
    try {
      if (typeof document === 'undefined') return null
      
      const nameEQ = name + "="
      const ca = document.cookie.split(';')
      
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) === ' ') c = c.substring(1, c.length)
        if (c.indexOf(nameEQ) === 0) {
          return decodeURIComponent(c.substring(nameEQ.length, c.length))
        }
      }
      return null
    } catch (error) {
      console.error('Error getting cookie:', error)
      return null
    }
  }

  /**
   * Delete a cookie
   */
  static deleteCookie(name: string): void {
    try {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict`
      
      // Legal logging
      LegalLogger.addLogEntry('cookie_deleted', {
        dataType: name,
        consentType: this.getCookieConsentType(name)
      })

      // Emit event for real-time sync
      cookieEvents.emit('cookie_changed', { name, action: 'delete' })
      
    } catch (error) {
      console.error('Error deleting cookie:', error)
    }
  }

  /**
   * Save user consent preferences
   */
  static saveConsentPreferences(consents: ConsentPreferences): void {
    try {
      const previousConsents = this.getConsentPreferences()
      
      const consentData = {
        ...consents,
        timestamp: Date.now(),
        version: '1.0' // For tracking consent version changes
      }
      
      this.setCookie(COOKIE_NAMES.CONSENT, JSON.stringify(consentData), COOKIE_EXPIRY.CONSENT, true)
      
      // Set individual tracking cookies based on consent
      if (consents.analytics) {
        this.setCookie(COOKIE_NAMES.ANALYTICS, 'enabled', COOKIE_EXPIRY.ANALYTICS)
      } else {
        this.deleteCookie(COOKIE_NAMES.ANALYTICS)
      }
      
      if (consents.functional) {
        this.setCookie(COOKIE_NAMES.FUNCTIONAL, 'enabled', COOKIE_EXPIRY.FUNCTIONAL)
      } else {
        this.deleteCookie(COOKIE_NAMES.FUNCTIONAL)
      }
      
      if (consents.marketing) {
        this.setCookie(COOKIE_NAMES.MARKETING, 'enabled', COOKIE_EXPIRY.MARKETING)
      } else {
        this.deleteCookie(COOKIE_NAMES.MARKETING)
      }

      // Legal logging for consent changes
      Object.keys(consents).forEach(consentType => {
        const currentValue = consents[consentType as keyof ConsentPreferences]
        const previousValue = previousConsents?.[consentType as keyof ConsentPreferences]
        
        if (currentValue !== previousValue) {
          LegalLogger.addLogEntry(
            currentValue ? 'consent_given' : 'consent_withdrawn',
            { consentType },
            { 
              previousValue, 
              currentValue,
              consentVersion: '1.0'
            }
          )
        }
      })

      // Emit event for real-time sync
      cookieEvents.emit('consent_changed', consents)
      
    } catch (error) {
      console.error('Error saving consent preferences:', error)
    }
  }

  /**
   * Get user consent preferences
   */
  static getConsentPreferences(): ConsentPreferences | null {
    try {
      const consentCookie = this.getCookie(COOKIE_NAMES.CONSENT)
      if (!consentCookie) return null
      
      const consentData = JSON.parse(consentCookie)
      
      // Check if consent is still valid (not older than 1 year)
      const oneYearAgo = Date.now() - (365 * 24 * 60 * 60 * 1000)
      if (consentData.timestamp < oneYearAgo) {
        this.clearAllConsents()
        return null
      }
      
      return {
        necessary: consentData.necessary || true,
        functional: consentData.functional || false,
        analytics: consentData.analytics || false,
        marketing: consentData.marketing || false,
        privacyPolicy: consentData.privacyPolicy || false,
        termsOfService: consentData.termsOfService || false
      }
    } catch (error) {
      console.error('Error getting consent preferences:', error)
      return null
    }
  }

  /**
   * Clear all consent-related cookies
   */
  static clearAllConsents(): void {
    try {
      const consents = this.getConsentPreferences()
      
      this.deleteCookie(COOKIE_NAMES.CONSENT)
      this.deleteCookie(COOKIE_NAMES.ANALYTICS)
      this.deleteCookie(COOKIE_NAMES.FUNCTIONAL)
      this.deleteCookie(COOKIE_NAMES.MARKETING)

      // Legal logging for data deletion
      LegalLogger.addLogEntry('data_deleted', {
        dataType: 'all_consents'
      }, {
        deletedConsents: consents
      })

      // Emit event for real-time sync
      cookieEvents.emit('consent_cleared')
      
    } catch (error) {
      console.error('Error clearing consent cookies:', error)
    }
  }

  /**
   * Check if a specific type of tracking is allowed
   */
  static isTrackingAllowed(type: 'analytics' | 'functional' | 'marketing'): boolean {
    const consents = this.getConsentPreferences()
    if (!consents) return false
    return consents[type] || false
  }

  /**
   * Generate a session ID for tracking user sessions
   */
  static generateSessionId(): string {
    // Gün bazlı tarih (örn: 20250827)
    const day = new Date().toISOString().slice(0, 10).replace(/-/g, "")

    // Güvenli random 8 byte
    const randomBytes = new Uint8Array(8)
    crypto.getRandomValues(randomBytes)
    const randomHex = Array.from(randomBytes).map(b => b.toString(16).padStart(2, "0")).join("")

    // timestamp (milisaniye -> base36)
    const timestamp = Date.now().toString(36)

    return `${day}_${timestamp}_${randomHex}`
  }

  /**
   * Get or create session ID
   */
  static getSessionId(): string {
    let sessionId = this.getCookie(COOKIE_NAMES.SESSION)
    if (!sessionId) {
      sessionId = this.generateSessionId()
      this.setCookie(COOKIE_NAMES.SESSION, sessionId, COOKIE_EXPIRY.SESSION, true)
    }
    return sessionId
  }

  /**
   * Log data collection (for transparency and debugging)
   */
  static logDataCollection(dataType: string, data: unknown, consentType?: string): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Data collected (${dataType}):`, {
        type: dataType,
        consentRequired: consentType,
        consentGiven: consentType ? this.isTrackingAllowed(consentType as 'analytics' | 'functional' | 'marketing') : 'not-required',
        data,
        timestamp: new Date().toISOString()
      })
    }
  }

  /**
   * Get all cookies set by our application
   */
  static getAllOurCookies(): Record<string, string> {
    const ourCookies: Record<string, string> = {}
    
    Object.values(COOKIE_NAMES).forEach(cookieName => {
      const value = this.getCookie(cookieName)
      if (value) {
        ourCookies[cookieName] = value
      }
    })
    
    return ourCookies
  }

  /**
   * Export user data (for GDPR data portability)
   */
  static exportUserData(): Record<string, unknown> {
    const consents = this.getConsentPreferences()
    const sessionId = this.getCookie(COOKIE_NAMES.SESSION)
    const allCookies = this.getAllOurCookies()
    const legalLogs = LegalLogger.exportLogs()
    
    // Legal logging for data export
    LegalLogger.addLogEntry('data_exported', {
      dataType: 'full_user_data'
    })

    return {
      consents,
      sessionId,
      cookies: allCookies,
      legalLogs,
      exportDate: new Date().toISOString(),
      dataRetentionInfo: {
        consentCookies: `${COOKIE_EXPIRY.CONSENT} days`,
        sessionCookies: `${COOKIE_EXPIRY.SESSION} days`,
        analyticsCookies: `${COOKIE_EXPIRY.ANALYTICS} days`,
        functionalCookies: `${COOKIE_EXPIRY.FUNCTIONAL} days`,
        marketingCookies: `${COOKIE_EXPIRY.MARKETING} days`
      },
      privacyInfo: {
        dataMinimization: 'We only collect data necessary for service provision',
        anonymization: 'IP addresses are hashed for privacy protection',
        retention: 'Data is automatically purged according to retention policies',
        rights: 'You have the right to access, rectify, and delete your data'
      }
    }
  }

  /**
   * Get consent type for a cookie name
   */
  private static getCookieConsentType(cookieName: string): string {
    if (cookieName === COOKIE_NAMES.CONSENT || cookieName === COOKIE_NAMES.SESSION) {
      return 'necessary'
    }
    if (cookieName === COOKIE_NAMES.ANALYTICS) {
      return 'analytics'
    }
    if (cookieName === COOKIE_NAMES.FUNCTIONAL) {
      return 'functional'
    }
    if (cookieName === COOKIE_NAMES.MARKETING) {
      return 'marketing'
    }
    return 'other'
  }
}

/**
 * Data collection utilities
 */
export class DataCollectionManager {
  /**
   * Collect essential data (always allowed)
   */
  static collectEssentialData(): Partial<CollectedData> {
    const sessionId = CookieManager.getSessionId()
    
    const essentialData = {
      sessionId,
      timestamp: Date.now(),
      locale: typeof window !== 'undefined' ? window.navigator.language : 'unknown',
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown'
    }
    
    CookieManager.logDataCollection('essential', essentialData)
    return essentialData
  }

  /**
   * Collect analytics data (requires consent)
   */
  static collectAnalyticsData(): Partial<CollectedData> | null {
    if (!CookieManager.isTrackingAllowed('analytics')) {
      return null
    }
    
    const analyticsData = {
      analytics: {
        pageViews: [window.location.pathname],
        timeOnSite: 0, // Will be updated on page unload
        referrer: document.referrer || 'direct',
        screenResolution: `${screen.width}x${screen.height}`
      }
    }
    
    CookieManager.logDataCollection('analytics', analyticsData, 'analytics')
    return analyticsData
  }

  /**
   * Collect functional data (requires consent)
   */
  static collectFunctionalData(): Partial<CollectedData> | null {
    if (!CookieManager.isTrackingAllowed('functional')) {
      return null
    }
    
    const functionalData = {
      functional: {
        themePreference: (localStorage.getItem('theme') as 'light' | 'dark' | 'system') || 'system',
        languagePreference: typeof window !== 'undefined' ? window.navigator.language : 'unknown',
        searchHistory: [] // Will be populated by search component
      }
    }
    
    CookieManager.logDataCollection('functional', functionalData, 'functional')
    return functionalData
  }

  /**
   * Store form submission data securely
   */
  static storeFormSubmission(formType: 'contact' | 'hr', formData: Record<string, unknown>): void {
    // Create anonymized version for logging
    const anonymizedData = this.anonymizeFormData(formData)
    
    const submissionData = {
      ...formData,
      submissionTime: Date.now(),
      sessionId: CookieManager.getSessionId(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown'
    }
    
    // Legal logging with anonymized data
    LegalLogger.addLogEntry('form_submitted', {
      formType
    }, {
      fieldsSubmitted: Object.keys(formData),
      dataAnonymized: anonymizedData,
      consentStatus: CookieManager.getConsentPreferences()
    })
    
    // In a real application, this would be sent to a secure backend
    // For now, we just log it for transparency
    CookieManager.logDataCollection(`${formType}-form`, submissionData)
    
    // Store in localStorage with a 30-day expiry
    if (typeof window !== 'undefined') {
      const existingSubmissions = DataCollectionManager.getStoredFormSubmissions()
      const expiryTimestamp = Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days from now

      existingSubmissions.push({
        type: formType,
        data: submissionData,
        timestamp: Date.now(),
        expiryTimestamp
      })
      localStorage.setItem('form_submissions', JSON.stringify(existingSubmissions))
    }
  }

  /**
   * Get stored form submissions and filter out expired ones
   */
  static getStoredFormSubmissions(): {
    type: string;
    data: Record<string, unknown>;
    timestamp: number;
    expiryTimestamp: number;
  }[] {
    if (typeof window === 'undefined') return []
    try {
      const submissions = JSON.parse(localStorage.getItem('form_submissions') || '[]')
      const now = Date.now()
      
      const validSubmissions = submissions.filter((sub: { expiryTimestamp: number }) => sub.expiryTimestamp && sub.expiryTimestamp > now)

      // If some submissions were expired, update localStorage
      if (validSubmissions.length < submissions.length) {
        localStorage.setItem('form_submissions', JSON.stringify(validSubmissions))
      }

      return validSubmissions
    } catch {
      localStorage.removeItem('form_submissions') // Clear corrupted data
      return []
    }
  }

  /**
   * Anonymize form data for logging purposes
   */
  private static anonymizeFormData(formData: Record<string, unknown>): Record<string, string> {
    const anonymized: Record<string, string> = {}
    
    Object.keys(formData).forEach(key => {
      const value = formData[key]
      
      if (typeof value === 'string') {
        if (key.toLowerCase().includes('email')) {
          // Anonymize email: show domain but hash local part
          const emailParts = value.split('@')
          if (emailParts.length === 2) {
            anonymized[key] = `***@${emailParts[1]}`
          } else {
            anonymized[key] = '***'
          }
        } else if (key.toLowerCase().includes('phone')) {
          // Anonymize phone: show only country code
          anonymized[key] = value.substring(0, 3) + '***'
        } else if (key.toLowerCase().includes('name')) {
          // Anonymize names: show only first letter
          anonymized[key] = value.charAt(0) + '***'
        } else if (value.length > 50) {
          // Truncate long text fields
          anonymized[key] = value.substring(0, 50) + '...'
        } else {
          anonymized[key] = '***'
        }
      } else {
        anonymized[key] = typeof value
      }
    })
    
    return anonymized
  }
}
