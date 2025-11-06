import { getRequestConfig } from 'next-intl/server';
import { validateLocaleWithError } from '@/hooks/locale-utils';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, type SupportedLocale } from '@/constants/locales';



// Export for compatibility with existing code
export const locales = SUPPORTED_LOCALES;
export type Locale = SupportedLocale;
export const defaultLocale = DEFAULT_LOCALE;

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that the incoming locale is valid
  if (!locale || !SUPPORTED_LOCALES.includes(locale as SupportedLocale)) {
    locale = DEFAULT_LOCALE;
  }

  const validatedLocale = validateLocaleWithError(locale);

  return {
    locale: validatedLocale,
    messages: (await import(`../messages/${validatedLocale}.json`)).default
  };
});
