"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react"
import { Link } from "@/navigation"
import Image from "next/image"
import { ProjectModal } from "@/components/home/ProjectModal"
import { useTranslations } from 'next-intl'
import { projects, type Project } from "@/lib/data"

export function ProjectsCarousel() {
  const t = useTranslations()
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(3)
  const maxIndex = Math.max(0, projects.length - itemsPerView)

  // Responsive items per view
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1) // Mobile: 1 item
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2) // Tablet: 2 items
      } else {
        setItemsPerView(3) // Desktop: 3 items
      }
    }

    // Set initial value
    updateItemsPerView()

    // Add event listener
    window.addEventListener('resize', updateItemsPerView)

    // Cleanup
    return () => window.removeEventListener('resize', updateItemsPerView)
  }, [])

  // Reset currentIndex when itemsPerView changes
  useEffect(() => {
    setCurrentIndex(0)
  }, [itemsPerView])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }

  const openModal = (project: Project) => {
    setSelectedProject(project)
  }

  const closeModal = () => {
    setSelectedProject(null)
  }

  return (
    <section className="py-20 bg-white dark:bg-brand-concrete-800">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="responsive-heading-lg font-heading font-bold text-brand-concrete-900 dark:text-white mb-6">
            {t('projects.title')}
          </h2>
          <p className="responsive-text-xl text-brand-concrete-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('projects.subtitle')}
          </p>
        </motion.div>

        <div className="relative">
          {/* Carousel Container */}
          <div className="overflow-hidden">
            <motion.div
              className="flex transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`
              }}
            >
              {projects.map((project, index) => {
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
                  <div
                    key={project.id}
                    className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-4"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      viewport={{ once: true }}
                      className="group"
                    >
                      <div className="bg-white dark:bg-brand-concrete-700 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 h-[480px] flex flex-col">
                        {/* Project Image */}
                        <div className="relative h-64 overflow-hidden">
                          <Image
                            src={project.image}
                            alt={title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                          
                          {/* Category Badge */}
                          <div className="absolute top-4 left-4 z-20">
                            <span className="px-3 py-1 bg-orange-500 text-white responsive-text-sm font-medium rounded-full">
                              {category}
                            </span>
                          </div>
                        </div>

                        {/* Project Content */}
                        <div className="p-6 flex-1 flex flex-col">
                          <h3 className="responsive-text-xl font-heading font-bold text-brand-concrete-900 dark:text-white mb-3 group-hover:text-brand-secondary transition-colors duration-300">
                            {title}
                          </h3>
                          
                          <p className="responsive-text-base text-brand-concrete-600 dark:text-gray-300 mb-4 leading-relaxed line-clamp-3 flex-1">
                            {description}
                          </p>

                          {/* Project Meta */}
                          <div className="flex items-center responsive-text-sm text-brand-concrete-500 dark:text-gray-400 mb-4">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {project.location}
                            </div>
                          </div>

                          {/* View Details Button */}
                          <div className="mt-auto">
                            <button
                              onClick={() => openModal(project)}
                              className="inline-flex items-center text-brand-secondary hover:text-brand-secondary/80 font-semibold transition-colors duration-300"
                            >
                              {t('projects.viewDetails')}
                              <ChevronRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )
              })}
            </motion.div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white dark:bg-brand-concrete-600 shadow-lg rounded-full flex items-center justify-center text-brand-concrete-600 dark:text-gray-300 hover:text-brand-secondary hover:shadow-xl transition-all duration-300 z-10"
            aria-label="Önceki projeler"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-white dark:bg-brand-concrete-600 shadow-lg rounded-full flex items-center justify-center text-brand-concrete-600 dark:text-gray-300 hover:text-brand-secondary hover:shadow-xl transition-all duration-300 z-10"
            aria-label="Sonraki projeler"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-brand-secondary w-8' 
                    : 'bg-brand-concrete-300 hover:bg-brand-concrete-400'
                }`}
                aria-label={`Proje grubu ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link 
            href="/projects"
            className="inline-flex items-center px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            {t('projects.viewAll')}
            <ChevronRight className="ml-2 h-5 w-5" />
          </Link>
        </motion.div>
      </div>
      <ProjectModal project={selectedProject} onClose={closeModal} />
    </section>
  )
}
