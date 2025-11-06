import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { ConstructionMaterialsPage } from '@/components/services/construction-materials/ConstructionMaterialsPage'
import { generatePageMetadata } from '@/hooks/server-metadata-utils'
import { generateLocaleParams } from '@/utils/generatePagesForLocale';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale, namespace: 'services.constructionMaterials' })
  
  return generatePageMetadata({
    locale: locale,
    title: t('title'),
    description: t('metaDescription'),
    path: '/services/construction-materials'
  })
}

export async function generateStaticParams() {
  return generateLocaleParams()
}

export default function Page() {
  return <ConstructionMaterialsPage />
}
