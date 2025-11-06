"use client"

import Image from "next/image"
import { useTranslations } from 'next-intl'
import { type Project } from "@/lib/data"
import { Modal } from "@/components/ui/Modal"

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const t = useTranslations()
  
  if (!project) return null

  // Get translated content, fallback to original if not found
  const getTranslatedContent = (key: string, fallback: string) => {
    try {
      const translated = t(`projects.items.${project.id}.${key}`)
      return translated && !translated.includes('projects.items.') ? translated : fallback
    } catch {
      return fallback
    }
  }

  const title = getTranslatedContent('title', project.title)
  const description = getTranslatedContent('description', project.description)
  const category = getTranslatedContent('category', project.category)
  
  return (
    <Modal 
      isOpen={!!project} 
      onClose={onClose}
      maxWidth="6xl"
      closeButtonLabel={t('common.close')}
    >
      <div className="flex flex-col md:grid md:grid-cols-2">
        {/* Image */}
        <div className="relative h-48 sm:h-56 md:h-full md:min-h-[400px] lg:min-h-[500px]">
          <Image
            src={project.image}
            alt={title}
            fill
            className="object-cover rounded-t-2xl md:rounded-l-2xl md:rounded-t-none"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 md:p-8">
          <span className="inline-block px-2 py-1 sm:px-3 bg-orange-500 text-white responsive-text-sm font-medium rounded-full mb-3 sm:mb-4">
            {category}
          </span>
          <h2 className="responsive-heading-sm font-heading font-bold text-brand-concrete-900 dark:text-white mb-3 sm:mb-4">
            {title}
          </h2>
          <p className="responsive-text-base text-brand-concrete-600 dark:text-gray-300 mb-4 sm:mb-6 leading-relaxed">
            {description}
          </p>
          <div className="flex flex-col sm:grid sm:grid-cols-2 gap-2 sm:gap-4 responsive-text-sm text-brand-concrete-600 dark:text-gray-400">
            <div className="flex items-center">
              <span className="font-semibold mr-2 text-brand-concrete-800 dark:text-white">{t('projects.location')}:</span>
              <span className="responsive-text-sm">{project.location}</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
