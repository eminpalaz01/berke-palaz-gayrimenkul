import { generatePageMetadata } from "@/hooks/server-metadata-utils";
import { validateLocale } from "@/hooks/locale-utils";
import { type SupportedLocale } from '@/constants/locales';
import type { Metadata } from "next";
import Home from "@/components/home/Home";
import { JsonLdComponent } from "@/components/JsonLdComponent";
import { generateLocaleParams } from "@/utils/generatePagesForLocale";
import { loadMetadataConfig } from "@/utils/metadata-config";

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const validatedLocale = validateLocale(locale) as SupportedLocale;
  
  // Load metadata config instead of translations
  const metadataConfig = loadMetadataConfig();
  const localeConfig = metadataConfig[validatedLocale as keyof typeof metadataConfig];
  
  return generatePageMetadata({
    locale,
    path: '/',
    title: localeConfig?.title?.default || 'Default Title',
    description: localeConfig?.description || 'Default description',
    keywords: localeConfig?.keywords || ['default', 'keywords']
  });
}

export async function generateStaticParams() {
  return generateLocaleParams()
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      <JsonLdComponent locale={locale} types = {['WebSite', 'Organization']} />
      <Home />
    </>
  )
}
