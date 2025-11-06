import { type SupportedLocale, SUPPORTED_LOCALES, DEFAULT_LOCALE } from '@/constants/locales';
import { notFound } from 'next/navigation'
import { useTranslation } from '@/hooks/useTranslation'

/**
 * Validates if a locale is supported
 */
export const isValidLocale = (locale: string): locale is SupportedLocale => {
  return SUPPORTED_LOCALES.includes(locale as SupportedLocale)
}

/**
 * Validates locale and throws notFound if invalid
 */
export const validateLocale = (locale: string): SupportedLocale => {
  if (!isValidLocale(locale)) {
    notFound()
  }
  return locale
}

/**
 * Gets a valid locale with fallback to default
 */
export const getValidLocale = (locale?: string): SupportedLocale => {
  if (!locale) return DEFAULT_LOCALE
  return isValidLocale(locale) ? locale : DEFAULT_LOCALE
}

/**
 * Validates locale and throws error if invalid (for server-side)
 */
export const validateLocaleWithError = (locale: string): SupportedLocale => {
  if (!isValidLocale(locale)) {
    throw new Error(`Invalid locale: ${locale}. Supported locales: ${SUPPORTED_LOCALES.join(', ')}`)
  }
  return locale
}

/**
 * Get locale display configuration
 */
export const getLocaleConfig = (locale: string) => ({
  displayName: locale === 'tr' ? 'Türkçe' : 'English',
  shortCode: locale.toUpperCase(),
  isActive: (currentLocale: string) => currentLocale === locale
})

// Get localized image based on current locale
export const useLocalizedImage = (baseName: string) => {
    const { locale } = useTranslation()
    if(isValidLocale(locale))
      return `/images/${baseName}-${locale}.jpg`
    return `/images/${baseName}.jpg`
  }
