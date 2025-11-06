"use client"

import { useTranslations, useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/navigation'

/**
 * Ortak çeviri hook'u - tüm bileşenlerde kullanılabilir
 */
export function useTranslation() {
  const t = useTranslations()
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  return {
    t,
    locale,
    router,
    // Dil değiştirme fonksiyonu - mevcut sayfada kalır
    changeLanguage: (newLocale: 'tr' | 'en') => {
      router.push(pathname, { locale: newLocale })
      router.refresh() // Sayfayı yenile
    },
    // Mevcut dil bilgisi
    isTurkish: locale === 'tr',
    isEnglish: locale === 'en',
    // Dil görüntüleme adları
    currentLanguageName: locale === 'tr' ? 'Türkçe' : 'English',
    currentLanguageCode: locale.toUpperCase()
  }
}

/**
 * Navigasyon çevirisi için özel hook
 */
export function useNavigationTranslation() {
  const { t: mainT } = useTranslation()

  const getNavigationTranslation = (originalName: string): string => {
    const translated = originalName ? mainT(originalName) : originalName
    return translated
  }

  return {
    getNavigationTranslation,
    t: (key: string) => mainT(`navigation.${key}`)
  }
}

/**
 * Beton Santrallerimiz sayfası için özel hook
 */
export function useConcretePlantTranslation() {
  const { t } = useTranslation()

  return {
    t: (key: string) => t(`ConcretePlantPage.${key}`)
  }
}

/**
 * Hero bölümü için özel hook
 */
export function useHeroTranslation() {
  const { t } = useTranslation()

  return {
    t: (key: string) => t(`hero.${key}`),
    getSlideTranslation: (slideNumber: number, field: 'title' | 'subtitle' | 'description' | 'cta') => {
      return t(`hero.slides.slide${slideNumber}.${field}`)
    }
  }
}

/**
 * Hizmetler için özel hook
 */
export function useServicesTranslation() {
  const { t } = useTranslation()

  return {
    t: (key: string) => t(`services.${key}`)
  }
}

/**
 * Projeler için özel hook
 */
export function useProjectsTranslation() {
  const { t } = useTranslation()

  return {
    t: (key: string) => t(`projects.${key}`),
    getProjectTranslation: (projectKey: string, field: 'title' | 'description' | 'category') => {
      return t(`projects.items.${projectKey}.${field}`)
    },
    getCategoryTranslation: (categoryKey: string) => {
      return t(`projects.categories.${categoryKey}`)
    }
  }
}

/**
 * Footer için özel hook
 */
export function useFooterTranslation() {
  const { t } = useTranslation()

  return {
    t: (key: string) => t(`footer.${key}`)
  }
}

/**
 * Ortak UI metinleri için hook
 */
export function useCommonTranslation() {
  const { t } = useTranslation()

  return {
    t: (key: string) => t(`common.${key}`),
    loading: t('common.loading'),
    error: t('common.error'),
    tryAgain: t('common.tryAgain'),
    close: t('common.close'),
    next: t('common.next'),
    previous: t('common.previous'),
    viewMore: t('common.viewMore'),
    viewDetails: t('common.viewDetails'),
    learnMore: t('common.learnMore')
  }
}
