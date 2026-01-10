import metadataTr from '@/../messages/metadata-tr.json';
import metadataEn from '@/../messages/metadata-en.json';

export interface MetadataConfig {
  tr: {
    title: {
      default: string;
      template: string;
    };
    description: string;
    keywords: string[];
    dc: {
      subject: string;
      description: string;
      publisher: string;
      contributor: string;
      coverage: string;
      rights: string;
    };
    openGraph: {
      title: string;
      description: string;
      alt: string;
    };
    twitter: {
      title: string;
      description: string;
      creator: string;
    };
  };
  en: {
    title: {
      default: string;
      template: string;
    };
    description: string;
    keywords: string[];
    dc: {
      subject: string;
      description: string;
      publisher: string;
      contributor: string;
      coverage: string;
      rights: string;
    };
    openGraph: {
      title: string;
      description: string;
      alt: string;
    };
    twitter: {
      title: string;
      description: string;
      creator: string;
    };
  };
}

/**
 * Load metadata configuration from JSON files
 * This is a synchronous operation that works at build time
 */
export function loadMetadataConfig(): MetadataConfig {
  return {
    tr: metadataTr,
    en: metadataEn
  } as MetadataConfig;
}

/**
 * Synchronous version for build-time usage
 * Same as loadMetadataConfig since we're using static JSON files
 */
export function loadMetadataConfigSync(): MetadataConfig {
  return loadMetadataConfig();
}
