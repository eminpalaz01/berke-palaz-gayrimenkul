"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { MapPin, Filter } from "lucide-react"
import Image from "next/image"
import { ProjectModal } from "@/components/home/ProjectModal"
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { projects, projectCategories, type Project } from "@/lib/data"

export function ProjectsPage() {
  const t = useTranslations()
  const searchParams = useSearchParams()
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  // Check for URL parameters and set initial state
  useEffect(() => {
    const projectId = searchParams.get('project')
    const categoryParam = searchParams.get('category')
    
    // Open modal if project parameter exists
    if (projectId) {
      const project = projects.find(p => p.id === projectId)
      if (project) {
        setSelectedProject(project)
      }
    }
    
    // Set selected category if category parameter exists
    if (categoryParam) {
      // Check if the category exists in our available categories
      const usedCategoryKeys = Array.from(new Set(projects.map(project => project.categoryKey)))
      const availableCategories = ["all", ...usedCategoryKeys]
      
      if (availableCategories.includes(categoryParam)) {
        setSelectedCategory(categoryParam)
      }
    }
  }, [searchParams])

  // Get unique categories from projects using the clean data structure
  const usedCategoryKeys = Array.from(new Set(projects.map(project => project.categoryKey)))
  const categories = ["all", ...usedCategoryKeys]

  // Filter projects based on selected category
  const filteredProjects = selectedCategory === "all" 
    ? projects 
    : projects.filter(project => project.categoryKey === selectedCategory)

  const openModal = (project: Project) => {
    setSelectedProject(project)
  }

  const closeModal = () => {
    setSelectedProject(null)
  }

  const getCategoryDisplayName = (categoryKey: string) => {
    if (categoryKey === "all") return t('projects.categories.all')
    
    // Find the category in our clean data structure
    const categoryData = projectCategories.find(cat => cat.key === categoryKey)
    if (categoryData) {
      try {
        const translated = t(`projects.categories.${categoryData.key}`)
        return translated && !translated.includes('projects.categories.') ? translated : categoryData.key
      } catch {
        return categoryData.key
      }
    }
    
    // Fallback to the key itself if not found
    return categoryKey
  }

  return (
    <div className="min-h-screen bg-white dark:bg-brand-concrete-800">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-brand-concrete-50 to-brand-concrete-100 dark:from-brand-concrete-900 dark:to-brand-concrete-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="responsive-heading-xl font-heading font-bold text-brand-concrete-900 dark:text-white mb-6">
              {t('projects.pageTitle')}
            </h1>
            <p className="responsive-text-xl text-brand-concrete-600 dark:text-gray-300 leading-relaxed">
              {t('projects.pageSubtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Description Section */}
      <section className="py-16 bg-brand-concrete-50 dark:bg-brand-concrete-900">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <p className="responsive-text-lg text-brand-concrete-700 dark:text-gray-300 leading-relaxed font-medium">
              {t('projects.companyDescription')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20">
        <div className="container-custom">
          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-brand-secondary" />
                <span className="responsive-text-lg font-semibold text-brand-concrete-900 dark:text-white">
                  {t('projects.filterByCategory')}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full responsive-text-sm font-medium transition-all duration-300 ${
                      selectedCategory === category
                        ? 'bg-brand-secondary text-white shadow-lg'
                        : 'bg-brand-concrete-100 dark:bg-brand-concrete-700 text-brand-concrete-700 dark:text-gray-300 hover:bg-brand-concrete-200 dark:hover:bg-brand-concrete-600'
                    }`}
                  >
                    {getCategoryDisplayName(category)}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Projects Grid */}
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => {
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
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group"
                  >
                    <div className="bg-white dark:bg-brand-concrete-700 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 h-[520px] flex flex-col">
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

                        {/* Year Badge */}
                        <div className="absolute top-4 right-4 z-20">
                          <span className="px-3 py-1 bg-black/50 text-white responsive-text-sm font-medium rounded-full">
                            {project.year}
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
                            className="w-full px-6 py-3 bg-brand-secondary hover:bg-brand-secondary/90 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                          >
                            {t('projects.viewDetails')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="responsive-text-lg text-brand-concrete-600 dark:text-gray-300">
                {t('projects.noProjectsFound')}
              </p>
            </motion.div>
          )}
        </div>
      </section>

      <ProjectModal project={selectedProject} onClose={closeModal} />
    </div>
  )
}
