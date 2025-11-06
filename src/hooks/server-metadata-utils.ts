import { Metadata } from 'next';
import { locales } from '@/i18n';
import {
  APP_CONFIG,
  type SupportedLocale
} from '@/config';
import { validateLocale } from '@/hooks/locale-utils';
import { pathnames } from '@/routes';
import { loadMetadataConfig } from '@/utils/metadata-config';
import { mapLocaleToRegion, getAllAlternateLocaleRegions } from '@/utils/locale-mapping';
import { loadServerRuntimeConfig } from '@/utils/server-config';

/**
 * Server-side metadata generation that uses static config as fallback
 * This avoids runtime config loading issues during build time
 */

/**
 * Generates alternates (hreflang) and canonical URLs for a page
 */
export function generatePageAlternates(canonicalPath: string, currentLocale: SupportedLocale): Metadata['alternates'] {
  const serverConfig = loadServerRuntimeConfig();
  const siteUrl = serverConfig.site.url;
  
  const alternates: { canonical: string; languages: Record<string, string> } = {
    canonical: '',
    languages: {},
  };

  // Generate hreflang links for all locales
  for (const locale of locales) {
    const pathConfig = pathnames[canonicalPath];
    const localizedPath = pathConfig?.[locale as keyof typeof pathConfig] || canonicalPath;
    alternates.languages[locale] = `${siteUrl}/${locale}${localizedPath}`;
  }
  
  // Set canonical URL for current page
  const pathConfig = pathnames[canonicalPath];
  const currentLocalizedPath = pathConfig?.[currentLocale as keyof typeof pathConfig] || canonicalPath;
  alternates.canonical = `${siteUrl}/${currentLocale}${currentLocalizedPath}`;

  // Set x-default to default locale
  const defaultPathConfig = pathnames[canonicalPath];
  const defaultLocalizedPath = defaultPathConfig?.[APP_CONFIG.locales.default as keyof typeof defaultPathConfig] || canonicalPath;
  alternates.languages['x-default'] = `${siteUrl}/${APP_CONFIG.locales.default}${defaultLocalizedPath}`;

  return alternates;
}

/**
 * Get localized company name from static config
 */
function getStaticCompanyName(locale: string): string {
  const serverConfig = loadServerRuntimeConfig();
  const nameKey = locale as keyof typeof serverConfig.company.name;
  return serverConfig.company.name[nameKey] || serverConfig.company.name.tr;
}

/**
 * Generates metadata for layout (root) pages - Server-side only version
 */
export function generateLayoutMetadata(locale: string): Metadata {
  const serverConfig = loadServerRuntimeConfig();
  const siteUrl = serverConfig.site.url;
  const validatedLocale = validateLocale(locale);
  const alternates = generatePageAlternates('/', validatedLocale);
  const metadataConfig = loadMetadataConfig();
  const localeConfig = metadataConfig[validatedLocale as keyof typeof metadataConfig];
  
  // Get alternate locale regions for og:locale:alternate
  const alternateRegions = getAllAlternateLocaleRegions(validatedLocale);
  const otherMetaTags: Record<string, string | string[]> = {
    'msapplication-TileColor': '#6C757D',
    'X-UA-Compatible': 'IE=edge',
    'Cache-Control': 'public, max-age=31536000, immutable',
    'color-scheme': 'light dark',
    'supported-color-schemes': 'light dark',
    'DC.title': localeConfig?.title?.default || 'Default Title',
    'DC.creator': getStaticCompanyName(validatedLocale),
    'DC.subject': localeConfig?.dc?.subject || 'Default Subject',
    'DC.description': localeConfig?.dc?.description || 'Default DC Description',
    'DC.publisher': localeConfig?.dc?.publisher || getStaticCompanyName(validatedLocale),
    'DC.contributor': localeConfig?.dc?.contributor || getStaticCompanyName(validatedLocale),
    'DC.date': new Date().toISOString(),
    'DC.type': 'Text',
    'DC.format': 'text/html',
    'DC.identifier': siteUrl,
    'DC.source': siteUrl,
    'DC.language': validatedLocale,
    'DC.coverage': localeConfig?.dc?.coverage || 'Default Coverage',
    'DC.rights': localeConfig?.dc?.rights || 'Default Rights',
  };

  // Add location info conditionally
  if (APP_CONFIG.location.region) {
    otherMetaTags['geo.region'] = APP_CONFIG.location.region;
  }
  if (APP_CONFIG.location.placename) {
    otherMetaTags['geo.placename'] = APP_CONFIG.location.placename;
  }
  if (APP_CONFIG.location.position) {
    otherMetaTags['geo.position'] = APP_CONFIG.location.position;
  }
  if (APP_CONFIG.location.icbm) {
    otherMetaTags['ICBM'] = APP_CONFIG.location.icbm;
  }

  // Add og:locale:alternate for each alternate region
  if (alternateRegions.length > 0) {
    otherMetaTags['og:locale:alternate'] = alternateRegions;
  }

  return {
    title: {
      default: localeConfig?.title?.default || 'Default Title',
      template: localeConfig?.title?.template || '%s | Default'
    },
    description: localeConfig?.description || 'Default description',
    keywords: localeConfig?.keywords || ['default', 'keywords'],
    verification: { google: APP_CONFIG.seo.googleVerification },
    authors: [{ name: getStaticCompanyName(validatedLocale), url: siteUrl }],
    creator: getStaticCompanyName(validatedLocale),
    publisher: getStaticCompanyName(validatedLocale),
    metadataBase: new URL(siteUrl),
    alternates,
    formatDetection: { email: false, address: false, telephone: false },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon.png',
      other: [{ rel: 'icon', type: 'image/png', sizes: '32x32', url: '/favicon.png' }]
    },
    manifest: `/site_${validatedLocale}.webmanifest`,
    openGraph: {
      type: "website",
      locale: mapLocaleToRegion(validatedLocale),
      alternateLocale: alternateRegions,
      url: typeof alternates?.canonical === 'string' ? alternates.canonical : undefined,
      title: localeConfig?.openGraph?.title || 'Default OG Title',
      description: localeConfig?.openGraph?.description || 'Default OG Description',
      siteName: getStaticCompanyName(validatedLocale),
      images: [{
        url: `${siteUrl}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: localeConfig?.openGraph?.alt || 'Default Alt Text',
        type: 'image/jpg',
      }],
    },
    twitter: {
      card: "summary_large_image",
      site: APP_CONFIG.seo.twitterHandle,
      creator: localeConfig?.twitter?.creator || "@yourcompany",
      title: localeConfig?.twitter?.title || 'Default Twitter Title',
      description: localeConfig?.twitter?.description || 'Default Twitter Description',
      images: [`${siteUrl}/images/og-image.jpg`],
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    category: APP_CONFIG.business.category,
    classification: APP_CONFIG.business.classification,
    applicationName: getStaticCompanyName(validatedLocale),
    referrer: 'origin-when-cross-origin',
    other: otherMetaTags
  };
}

/**
 * Generates metadata for individual pages - Server-side only version
 */
export function generatePageMetadata(options: {
  title: string;
  description: string;
  locale: string;
  path: string;
  keywords?: string[];
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}): Metadata {
  const { 
    title, 
    description, 
    locale, 
    path,
    keywords, 
    image,
    type = 'website',
    publishedTime,
    modifiedTime,
    section,
    tags
  } = options;
  
  const serverConfig = loadServerRuntimeConfig();
  const siteUrl = serverConfig.site.url;
  const validatedLocale = validateLocale(locale);
  const alternates = generatePageAlternates(path, validatedLocale);
  const ogImage = image || `${siteUrl}/images/og-image.jpg`;
  
  // Get alternate locale regions for og:locale:alternate
  const alternateRegions = getAllAlternateLocaleRegions(validatedLocale);
  const otherMetaTags: Record<string, string | string[]> = {
    'article:author': getStaticCompanyName(validatedLocale),
    'article:publisher': siteUrl,
  };
  
  const metadataConfig = loadMetadataConfig();
  const localeConfig = metadataConfig[validatedLocale as keyof typeof metadataConfig];

  // Add og:locale:alternate for each alternate region
  if (alternateRegions.length > 0) {
    otherMetaTags['og:locale:alternate'] = alternateRegions;
  }
  
  return {
    title,
    description,
    keywords,
    alternates,
    openGraph: {
      title,
      description,
      url: typeof alternates?.canonical === 'string' ? alternates.canonical : undefined,
      siteName: getStaticCompanyName(validatedLocale),
      images: [{
        url: ogImage,
        width: 1200,
        height: 630,
        alt: title,
        type: image ? undefined : 'image/png',
      }],
      locale: mapLocaleToRegion(validatedLocale),
      alternateLocale: alternateRegions,
      type,
      publishedTime,
      modifiedTime,
      section,
      tags,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
      creator: localeConfig?.twitter?.creator || "@yourcompany"
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
    },
    other: otherMetaTags
  };
}
