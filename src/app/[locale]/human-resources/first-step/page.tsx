import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { generatePageMetadata } from '@/hooks/server-metadata-utils'
import HumanResourcesFirstStepPage from '@/components/human-resources/first-step/HumanResourcesFirstStepPage';
import { generateLocaleParams } from '@/utils/generatePagesForLocale';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'HumanResourcesPage.firstStep' })
  
  return generatePageMetadata({
    title: t('title'),
    description: t('description'),
    locale,
    path: '/human-resources/first-step'
  })
}

export async function generateStaticParams() {
  return generateLocaleParams()
}

export default function HumanResourcesFirstStep() {
  return <HumanResourcesFirstStepPage />;
}
