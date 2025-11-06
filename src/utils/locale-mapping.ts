import { APP_CONFIG, SupportedLocale } from '@/config';

/**
 * Locale to region mapping for Open Graph and other metadata
 * Add more locales as needed for your application
 */
export const LOCALE_TO_REGION_MAP: Record<string, string> = {
  // Current supported locales
  tr: 'tr_TR',
  en: 'en_US',
  
  // Additional common locales (add as needed)
  // de: 'de_DE',
  // fr: 'fr_FR',
  // es: 'es_ES',
  // it: 'it_IT',
  // pt: 'pt_PT',
  // ru: 'ru_RU',
  // ja: 'ja_JP',
  // ko: 'ko_KR',
  // zh: 'zh_CN',
  // ar: 'ar_SA',
  // nl: 'nl_NL',
  // sv: 'sv_SE',
  // da: 'da_DK',
  // no: 'no_NO',
  // fi: 'fi_FI',
  // pl: 'pl_PL',
  // cs: 'cs_CZ',
  // hu: 'hu_HU',
  // ro: 'ro_RO',
  // bg: 'bg_BG',
  // hr: 'hr_HR',
  // sk: 'sk_SK',
  // sl: 'sl_SI',
  // et: 'et_EE',
  // lv: 'lv_LV',
  // lt: 'lt_LT',
  // el: 'el_GR',
  // he: 'he_IL',
  // th: 'th_TH',
  // vi: 'vi_VN',
  // hi: 'hi_IN',
  // bn: 'bn_BD',
  // ur: 'ur_PK',
  // fa: 'fa_IR',
  // uk: 'uk_UA',
  // be: 'be_BY',
  // ka: 'ka_GE',
  // hy: 'hy_AM',
  // az: 'az_AZ',
  // kk: 'kk_KZ',
  // ky: 'ky_KG',
  // uz: 'uz_UZ',
  // tg: 'tg_TJ',
  // mn: 'mn_MN',
} as const;

/**
 * Maps a locale code to its corresponding region identifier
 * Falls back to default locale's region if mapping not found
 */
export function mapLocaleToRegion(locale: SupportedLocale | string): string {
  return LOCALE_TO_REGION_MAP[locale] || 
         LOCALE_TO_REGION_MAP[APP_CONFIG.locales.default] || 
         'en_US';
}

/**
 * Gets the alternate locale region for og:locale:alternate metadata
 * Returns the first alternate locale region (for single alternate)
 */
export function getAlternateLocaleRegion(locale: SupportedLocale | string): string {
  // Find the first supported locale that's different from current
  const alternateLocale = APP_CONFIG.locales.supported.find(l => l !== locale) || APP_CONFIG.locales.default;
  return mapLocaleToRegion(alternateLocale);
}

/**
 * Gets all alternate locale regions for og:locale:alternate metadata
 * Returns array of all alternate locale regions (for multiple alternates)
 */
export function getAllAlternateLocaleRegions(locale: SupportedLocale | string): string[] {
  // Get all supported locales except the current one
  const alternateLocales = APP_CONFIG.locales.supported.filter(l => l !== locale);
  
  // If no alternates found, return default locale region
  if (alternateLocales.length === 0) {
    return [mapLocaleToRegion(APP_CONFIG.locales.default)];
  }
  
  // Map all alternate locales to their regions
  return alternateLocales.map(alternateLocale => mapLocaleToRegion(alternateLocale));
}

/**
 * Gets alternate locale regions based on the number of supported locales
 * Returns single string for 2 locales, array for more than 2 locales
 */
export function getOptimalAlternateLocaleRegions(locale: SupportedLocale | string): string | string[] {
  const alternateRegions = getAllAlternateLocaleRegions(locale);
  
  // For 2 locales total (1 alternate), return single string for backward compatibility
  if (alternateRegions.length === 1) {
    return alternateRegions[0];
  }
  
  // For more than 2 locales, return array
  return alternateRegions;
}

/**
 * Helper function to add new locale mappings dynamically
 * Useful for extending locale support without modifying the core mapping
 */
export function addLocaleMapping(locale: string, region: string): void {
  (LOCALE_TO_REGION_MAP as Record<string, string>)[locale] = region;
}

/**
 * Gets information about current locale configuration
 * Useful for debugging and development
 */
export function getLocaleInfo(locale: SupportedLocale | string) {
  const currentRegion = mapLocaleToRegion(locale);
  const alternateRegions = getAllAlternateLocaleRegions(locale);
  const optimalAlternates = getOptimalAlternateLocaleRegions(locale);
  
  return {
    currentLocale: locale,
    currentRegion,
    alternateRegions,
    optimalAlternates,
    totalSupportedLocales: APP_CONFIG.locales.supported.length,
    allSupportedLocales: [...APP_CONFIG.locales.supported],
    availableMappings: Object.keys(LOCALE_TO_REGION_MAP),
  };
}
