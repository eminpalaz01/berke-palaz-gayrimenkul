// Import from config for centralized management
import { APP_CONFIG } from '@/config';
export { type SupportedLocale } from '@/config';

export const SUPPORTED_LOCALES = APP_CONFIG.locales.supported;
export const DEFAULT_LOCALE = APP_CONFIG.locales.default;
