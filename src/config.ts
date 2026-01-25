const locales = { 
    supported: (process.env.NEXT_PUBLIC_SUPPORTED_LOCALES?.split(',') || ['tr']) as string[], 
    default: process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'tr' 
  }

// Site configuration from environment variables
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://berkepalaz.com';
export const SITE_DOMAIN = process.env.NEXT_PUBLIC_SITE_DOMAIN || 'berkepalaz.com';

export type SupportedLocale = typeof locales.supported[number];
export const SUPPORTED_LOCALES = locales.supported;
export const DEFAULT_LOCALE = locales.default;
