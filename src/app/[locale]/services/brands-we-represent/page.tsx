import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { BrandsWeRepresentPage } from '@/components/services/brands-we-represent/BrandsWeRepresentPage'
import { generatePageMetadata } from '@/hooks/server-metadata-utils'
import { generateLocaleParams } from '@/utils/generatePagesForLocale';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'services.brandsWeRepresent' })
  
  return generatePageMetadata({
    locale,
    title: t('title'),
    description: t('metaDescription'),
    path: '/services/brands-we-represent'
  })
}

export async function generateStaticParams() {
  return generateLocaleParams()
}

export default function Page() {
  return <BrandsWeRepresentPage />
}
