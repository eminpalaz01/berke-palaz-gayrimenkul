// config.ts
import importedConfigJson from '../public/configs/config.json';

export const APP_CONFIG = importedConfigJson;

export type SupportedLocale = typeof APP_CONFIG.locales.supported[number];
export const COMPANY_INFO = APP_CONFIG.company;
export const SOCIAL_CONFIG = APP_CONFIG.social;
export const SITE_URL = APP_CONFIG.site.url;
export const DEFAULT_LOCALE = APP_CONFIG.locales.default;
