import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { ReadyMixConcretePage } from '@/components/services/ready-mix-concrete/ReadyMixConcretePage'
import { generatePageMetadata } from '@/hooks/server-metadata-utils'
import { generateLocaleParams } from '@/utils/generatePagesForLocale';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale, namespace: 'services.readyMixConcrete' })
  
  return generatePageMetadata({
    locale: locale,
    title: t('title'),
    description: t('metaDescription'),
    path: '/services/ready-mix-concrete'
  })
}

export async function generateStaticParams() {
  return generateLocaleParams()
}

export default function Page() {
  return <ReadyMixConcretePage />
}
