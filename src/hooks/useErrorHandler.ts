"use client"

import { useTranslation } from './useTranslation'
import toast from 'react-hot-toast'

// Translation function type - compatible with next-intl
type TranslationFunction = (key: string, fallback?: string) => string

export interface ErrorOptions {
  showToast?: boolean
  toastMessage?: string
  logToConsole?: boolean
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
}

/**
 * Custom hook that provides error handling with translation support
 */
export function useErrorHandler() {
  const { t: nextIntlT } = useTranslation()

  // Create a wrapper function that matches our TranslationFunction signature
  const t = (key: string, fallback?: string) => {
    try {
      const result = nextIntlT(key)
      // If the translation key is not found, next-intl returns the key itself
      // In that case, return the fallback if provided
      return result === key && fallback ? fallback : result
    } catch {
      // If translation fails, return fallback or key
      return fallback || key
    }
  }

  /**
   * Handle general errors
   */
  const handleError = (error: Error | unknown, options: ErrorOptions = {}) => {
    const {
      showToast = true,
      toastMessage,
      logToConsole = true,
      position = 'bottom-right'
    } = options

    // Log to console if enabled
    if (logToConsole) {
      console.error('Error caught by ErrorHandler:', error)
    }

    // Determine error message
    let errorMessage = t('errors.unexpected', 'Beklenmeyen bir hata oluştu')
    
    if (error instanceof Error) {
      errorMessage = error.message
    } else if (typeof error === 'string') {
      errorMessage = error
    }

    // Show toast notification if enabled
    if (showToast) {
      toast.error(toastMessage || errorMessage, {
        position,
        duration: 5000,
        style: {
          background: '#ef4444',
          color: '#fff',
          borderRadius: '8px',
          padding: '12px 16px',
          fontSize: '14px',
          maxWidth: '400px',
        },
        icon: '⚠️',
      })
    }

    return errorMessage
  }

  /**
   * Handle API errors specifically
   */
  const handleApiError = (error: unknown, options: ErrorOptions = {}) => {
    let errorMessage = t('errors.api.default', 'API isteği başarısız oldu')

    // Handle different API error formats
    if (error && typeof error === 'object') {
      const apiError = error as {
        response?: {
          data?: { message?: string; error?: string }
          status?: number
        }
        message?: string
      }

      if (apiError.response?.data?.message) {
        errorMessage = apiError.response.data.message
      } else if (apiError.response?.data?.error) {
        errorMessage = apiError.response.data.error
      } else if (apiError.message) {
        errorMessage = apiError.message
      } else if (apiError.response?.status) {
        switch (apiError.response.status) {
          case 400:
            errorMessage = t('errors.api.400', 'Geçersiz istek')
            break
          case 401:
            errorMessage = t('errors.api.401', 'Yetkilendirme hatası')
            break
          case 403:
            errorMessage = t('errors.api.403', 'Erişim reddedildi')
            break
          case 404:
            errorMessage = t('errors.api.404', 'Kaynak bulunamadı')
            break
          case 500:
            errorMessage = t('errors.api.500', 'Sunucu hatası')
            break
          default:
            errorMessage = t('errors.api.unknown', `HTTP ${apiError.response.status} hatası`)
        }
      }
    }

    return handleError(new Error(errorMessage), {
      ...options,
      toastMessage: options.toastMessage || errorMessage
    })
  }

  /**
   * Handle network errors
   */
  const handleNetworkError = (error: unknown, options: ErrorOptions = {}) => {
    const errorMessage = t('errors.network', 'İnternet bağlantısı hatası')
    
    return handleError(new Error(errorMessage), {
      ...options,
      toastMessage: options.toastMessage || errorMessage
    })
  }

  /**
   * Handle validation errors
   */
  const handleValidationError = (errors: string[] | string, options: ErrorOptions = {}) => {
    const errorMessage = Array.isArray(errors) 
      ? errors.join(', ') 
      : errors

    const validationPrefix = t('errors.validation', 'Doğrulama hatası')

    return handleError(new Error(errorMessage), {
      ...options,
      toastMessage: options.toastMessage || `${validationPrefix}: ${errorMessage}`
    })
  }

  /**
   * Show success message
   */
  const showSuccess = (message: string, position: ErrorOptions['position'] = 'bottom-right') => {
    toast.success(message, {
      position,
      duration: 3000,
      style: {
        background: '#10b981',
        color: '#fff',
        borderRadius: '8px',
        padding: '12px 16px',
        fontSize: '14px',
        maxWidth: '400px',
      },
      icon: '✅',
    })
  }

  /**
   * Show info message
   */
  const showInfo = (message: string, position: ErrorOptions['position'] = 'bottom-right') => {
    toast(message, {
      position,
      duration: 4000,
      style: {
        background: '#3b82f6',
        color: '#fff',
        borderRadius: '8px',
        padding: '12px 16px',
        fontSize: '14px',
        maxWidth: '400px',
      },
      icon: 'ℹ️',
    })
  }

  /**
   * Show warning message
   */
  const showWarning = (message: string, position: ErrorOptions['position'] = 'bottom-right') => {
    toast(message, {
      position,
      duration: 4000,
      style: {
        background: '#f59e0b',
        color: '#fff',
        borderRadius: '8px',
        padding: '12px 16px',
        fontSize: '14px',
        maxWidth: '400px',
      },
      icon: '⚠️',
    })
  }

  return {
    handleError,
    handleApiError,
    handleNetworkError,
    handleValidationError,
    showSuccess,
    showInfo,
    showWarning,
    // Also provide the translation function for custom error messages
    t
  }
}

/**
 * Global unhandled error listeners
 */
export function setupGlobalErrorHandlers() {
  // Handle unhandled promise rejections
  if (typeof window !== 'undefined') {
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason)
      toast.error('Beklenmeyen bir hata oluştu (Promise)', {
        position: 'bottom-right',
        duration: 5000,
        style: {
          background: '#ef4444',
          color: '#fff',
          borderRadius: '8px',
          padding: '12px 16px',
          fontSize: '14px',
          maxWidth: '400px',
        },
        icon: '⚠️',
      })
    })

    // Handle general JavaScript errors
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error)
      toast.error('Beklenmeyen bir JavaScript hatası oluştu', {
        position: 'bottom-right',
        duration: 5000,
        style: {
          background: '#ef4444',
          color: '#fff',
          borderRadius: '8px',
          padding: '12px 16px',
          fontSize: '14px',
          maxWidth: '400px',
        },
        icon: '⚠️',
      })
    })
  }
}
