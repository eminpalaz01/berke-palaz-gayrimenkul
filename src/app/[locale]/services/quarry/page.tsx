import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { QuarryPage } from '@/components/services/quarry/QuarryPage'
import { generatePageMetadata } from '@/hooks/server-metadata-utils'
import { generateLocaleParams } from '@/utils/generatePagesForLocale'

export async function generateStaticParams() {
  return generateLocaleParams()
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'services.quarryServices' })
  
  return generatePageMetadata({
    locale,
    title: t('title'),
    description: t('metaDescription'),
    path: '/services/quarry'
  })
}

export default function Page() {
  return <QuarryPage />
}
