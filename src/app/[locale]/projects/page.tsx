import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { generatePageMetadata } from '@/hooks/server-metadata-utils'
import { ProjectsPage } from '@/components/projects/ProjectsPage'
import { generateLocaleParams } from '@/utils/generatePagesForLocale';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale })
  
  return generatePageMetadata({
    title: t('projects.pageTitle'),
    description: t('projects.pageSubtitle'),
    locale,
    path: '/projects'
  })
}

export async function generateStaticParams() {
  return generateLocaleParams()
}

export default function Projects() {
  return <ProjectsPage />
}
