import { Metadata } from 'next';
import { locales } from '@/i18n';
import {
  SITE_URL,
  type SupportedLocale
} from '@/config';
import { validateLocale } from '@/hooks/locale-utils';
import { pathnames } from '@/routes';
import { loadMetadataConfig } from '@/utils/metadata-config';
import { mapLocaleToRegion, getAllAlternateLocaleRegions } from '@/utils/locale-mapping';
import { loadServerRuntimeConfig } from '@/utils/server-config';
import { DEFAULT_LOCALE } from '@/constants/locales';

/**
 * Server-side metadata generation that uses static config as fallback
 * This avoids runtime config loading issues during build time
 */

/**
 * Generates alternates (hreflang) and canonical URLs for a page
 */
export async function generatePageAlternates(canonicalPath: string, currentLocale: SupportedLocale): Promise<Metadata['alternates']> {
  const siteUrl = SITE_URL;
  
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
  const defaultLocalizedPath = defaultPathConfig?.[DEFAULT_LOCALE as keyof typeof defaultPathConfig] || canonicalPath;
  alternates.languages['x-default'] = `${siteUrl}/${DEFAULT_LOCALE}${defaultLocalizedPath}`;

  return alternates;
}

/**
 * Generates metadata for layout (root) pages - Server-side only version
 */
export async function generateLayoutMetadata(locale: string): Promise<Metadata> {
  const siteUrl = SITE_URL;
  const validatedLocale = validateLocale(locale);
  const alternates = await generatePageAlternates('/', validatedLocale);
  const metadataConfig = loadMetadataConfig();
  const localeConfig = metadataConfig[validatedLocale as keyof typeof metadataConfig];
  
  // Load server config once
  const serverConfig = await loadServerRuntimeConfig();
  
  // Extract needed data from server config
  const nameKey = validatedLocale as keyof typeof serverConfig.company.name;
  const companyName = serverConfig.company.name[nameKey] || serverConfig.company.name.tr;
  const locationConfig = serverConfig.location || {};
  const seoConfig = serverConfig.seo || {};
  const businessConfig = serverConfig.business || {};
  
  // Get alternate locale regions for og:locale:alternate
  const alternateRegions = getAllAlternateLocaleRegions(validatedLocale);
  const otherMetaTags: Record<string, string | string[]> = {
    'msapplication-TileColor': '#6C757D',
    'X-UA-Compatible': 'IE=edge',
    'Cache-Control': 'public, max-age=31536000, immutable',
    'color-scheme': 'light dark',
    'supported-color-schemes': 'light dark',
    'DC.title': localeConfig?.title?.default || 'Default Title',
    'DC.creator': companyName,
    'DC.subject': localeConfig?.dc?.subject || 'Default Subject',
    'DC.description': localeConfig?.dc?.description || 'Default DC Description',
    'DC.publisher': localeConfig?.dc?.publisher || companyName,
    'DC.contributor': localeConfig?.dc?.contributor || companyName,
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
  if (locationConfig?.region) {
    otherMetaTags['geo.region'] = locationConfig.region;
  }
  if (locationConfig?.placename) {
    otherMetaTags['geo.placename'] = locationConfig.placename;
  }
  if (locationConfig?.position) {
    otherMetaTags['geo.position'] = locationConfig.position;
  }
  if (locationConfig?.icbm) {
    otherMetaTags['ICBM'] = locationConfig.icbm;
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
    verification: { google: seoConfig?.googleVerification || '' },
    authors: [{ name: companyName, url: siteUrl }],
    creator: companyName,
    publisher: companyName,
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
      siteName: companyName,
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
      site: seoConfig?.twitterHandle,
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
    category: businessConfig?.category,
    classification: businessConfig?.classification,
    applicationName: companyName,
    referrer: 'origin-when-cross-origin',
    other: otherMetaTags
  };
}

/**
 * Generates metadata for individual pages - Server-side only version
 */
export async function generatePageMetadata(options: {
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
}): Promise<Metadata> {
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
  
  const siteUrl = SITE_URL;
  const validatedLocale = validateLocale(locale);
  const alternates = await generatePageAlternates(path, validatedLocale);
  const ogImage = image || `${siteUrl}/images/og-image.jpg`;
  
  // Load server config once
  const serverConfig = await loadServerRuntimeConfig();
  const nameKey = validatedLocale as keyof typeof serverConfig.company.name;
  const companyName = serverConfig.company.name[nameKey] || serverConfig.company.name.tr;
  
  // Get alternate locale regions for og:locale:alternate
  const alternateRegions = getAllAlternateLocaleRegions(validatedLocale);
  const otherMetaTags: Record<string, string | string[]> = {
    'article:author': companyName,
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
      siteName: companyName,
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
