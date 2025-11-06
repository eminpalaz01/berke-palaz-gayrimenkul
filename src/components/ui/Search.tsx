"use client"

import * as React from "react"
import { Search as SearchIcon, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { projects } from "@/lib/data"
import { cn } from "@/hooks/utils"
import { useTranslations } from 'next-intl'
import { useRouter } from '@/navigation'

interface SearchableProject {
  id: string;
  title: string;
  description: string;
  href: string;
  type: 'project';
}

interface SearchableNavItem {
  name: string;
  href: string;
  type: 'navigation';
}

type SearchableItem = SearchableNavItem | SearchableProject;

export function Search() {
  const t = useTranslations()
  const [searchTerm, setSearchTerm] = React.useState("")
  const [isFocused, setIsFocused] = React.useState(false)
  const [suggestions, setSuggestions] = React.useState<SearchableItem[]>([])
  const router = useRouter()
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Create localized navigation items and combine with projects
  const allSearchableItems: SearchableItem[] = React.useMemo(() => {
    // Localized navigation items
    const navItems: SearchableNavItem[] = [
      { name: t('navigation.home'), href: '/', type: 'navigation' },
      { name: t('navigation.about'), href: '/about', type: 'navigation' },
      { name: t('navigation.services'), href: '/services', type: 'navigation' },
      { name: t('navigation.projects'), href: '/projects', type: 'navigation' },
      { name: t('navigation.contact'), href: '/contact', type: 'navigation' },
      { name: t('navigation.humanResources'), href: '/human-resources', type: 'navigation' },
      // Service submenu items
      { name: t('navigation.submenu.readyMix'), href: '/services/ready-mix', type: 'navigation' },
      { name: t('navigation.submenu.construct'), href: '/services/concrete-pump', type: 'navigation' },
      { name: t('navigation.submenu.quarry'), href: '/services/aggregate', type: 'navigation' },
      { name: t('navigation.submenu.constructionMaterials'), href: '/services/construction-materials', type: 'navigation' },
      { name: t('navigation.submenu.firstStep'), href: '/human-resources/first-step', type: 'navigation' }
    ]

    // Localized project items using translation files
    const projectItems: SearchableProject[] = projects.map(project => {
      // Try to get translations, fallback to original if not found
      let title = project.title
      let description = project.description
      
      try {
        const translatedTitle = t(`projects.items.${project.id}.title`)
        const translatedDescription = t(`projects.items.${project.id}.description`)
        
        // Only use translation if it's actually translated (not the key itself)
        if (translatedTitle && !translatedTitle.includes('projects.items.')) {
          title = translatedTitle
        }
        if (translatedDescription && !translatedDescription.includes('projects.items.')) {
          description = translatedDescription
        }
      } catch {
        // Use original values if translation fails
      }
      
      return {
        id: project.id,
        title,
        description,
        href: '/projeler',
        type: 'project' as const
      }
    })

    return [...navItems, ...projectItems]
  }, [t])

  // Update suggestions based on search term
  React.useEffect(() => {
    if (searchTerm.trim()) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase()
      const filtered = allSearchableItems.filter((item: SearchableItem) => {
        if (item.type === 'navigation') {
          return item.name.toLowerCase().includes(lowerCaseSearchTerm)
        } else {
          return item.title.toLowerCase().includes(lowerCaseSearchTerm) ||
                 item.description.toLowerCase().includes(lowerCaseSearchTerm)
        }
      }).slice(0, 6) // Limit to 6 suggestions
      setSuggestions(filtered)
    } else {
      setSuggestions([])
    }
  }, [searchTerm, allSearchableItems])

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!searchTerm.trim()) return

    const lowerCaseSearchTerm = searchTerm.toLowerCase()
    
    // First check for projects (using localized content)
    const foundProject = allSearchableItems.find(item => 
      item.type === 'project' && (
        item.title.toLowerCase().includes(lowerCaseSearchTerm) ||
        item.description.toLowerCase().includes(lowerCaseSearchTerm)
      )
    )

    if (foundProject) {
      // Navigate to projects page with project ID as query parameter
      router.push(`/projects?project=${(foundProject as SearchableProject).id}`)
      setSearchTerm("")
      setIsFocused(false)
      inputRef.current?.blur()
      return
    }

    // Then check for navigation items (using localized content)
    const foundNavItem = allSearchableItems.find(item =>
      item.type === 'navigation' && item.name.toLowerCase().includes(lowerCaseSearchTerm)
    )

    if (foundNavItem) {
      router.push(foundNavItem.href)
      setSearchTerm("")
      setIsFocused(false)
      inputRef.current?.blur()
    } else {
      // Show a more elegant notification
      const notification = document.createElement('div')
      notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in'
      notification.textContent = t('search.noResults')
      document.body.appendChild(notification)
      setTimeout(() => {
        notification.remove()
      }, 3000)
    }
  }

  const handleSuggestionClick = (item: SearchableItem) => {
    if (item.type === 'project') {
      // For projects, navigate to projects page with project ID as query parameter
      router.push(`/projects?project=${item.id}`)
    } else {
      router.push(item.href)
    }
    setSearchTerm("")
    setIsFocused(false)
    inputRef.current?.blur()
  }

  const clearSearch = () => {
    setSearchTerm("")
    setSuggestions([])
    inputRef.current?.focus()
  }

  return (
    <div className="relative w-full max-w-xs">
      <form onSubmit={handleSearch} className="relative">
        <div className={cn(
          "relative flex items-center transition-all duration-300 ease-in-out",
          "rounded-full border-2 bg-white/90 dark:bg-brand-concrete-800/90 backdrop-blur-sm",
          isFocused 
            ? "border-brand-secondary shadow-lg shadow-brand-secondary/20 scale-105" 
            : "border-brand-concrete-200 dark:border-brand-concrete-600 hover:border-brand-concrete-300 dark:hover:border-brand-concrete-500"
        )}>
          <SearchIcon className={cn(
            "absolute left-3 h-4 w-4 transition-colors duration-200",
            isFocused 
              ? "text-brand-secondary" 
              : "text-brand-concrete-400 dark:text-brand-concrete-500"
          )} />
          
          <input
            ref={inputRef}
            type="search"
            placeholder={t('search.placeholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            className={cn(
              "w-full h-10 pl-10 pr-10 bg-transparent border-none outline-none focus:outline-none focus:ring-0",
              "text-sm font-medium placeholder:text-brand-concrete-400 dark:placeholder:text-brand-concrete-500",
              "text-brand-concrete-700 dark:text-brand-concrete-100",
              "[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
            )}
            style={{ 
              outline: 'none', 
              boxShadow: 'none'
            }}
            aria-label={t('search.ariaLabel')}
          />

          <AnimatePresence>
            {searchTerm && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                type="button"
                onClick={clearSearch}
                className="absolute right-8 p-1 rounded-full hover:bg-brand-concrete-100 dark:hover:bg-brand-concrete-700 transition-colors"
                aria-label={t('search.clearSearch')}
              >
                <X className="h-3 w-3 text-brand-concrete-400 dark:text-brand-concrete-500 hover:text-brand-secondary" />
              </motion.button>
            )}
          </AnimatePresence>

          <button
            type="submit"
            className={cn(
              "absolute right-2 p-2 rounded-full transition-all duration-200",
              "hover:bg-brand-secondary hover:text-white",
              isFocused 
                ? "text-brand-secondary hover:scale-110" 
                : "text-brand-concrete-400 dark:text-brand-concrete-500"
            )}
            aria-label={t('search.searchButton')}
          >
            <SearchIcon className="h-4 w-4" />
          </button>
        </div>
      </form>

      {/* Search Suggestions Dropdown */}
      <AnimatePresence>
        {isFocused && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-brand-concrete-800 border border-brand-concrete-200 dark:border-brand-concrete-600 rounded-xl shadow-xl backdrop-blur-sm z-50 overflow-hidden"
          >
            <div className="py-2">
              {suggestions.map((item, index) => (
                <motion.button
                  key={item.type === 'navigation' ? item.href : item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleSuggestionClick(item)}
                  className="w-full text-left px-4 py-3 hover:bg-brand-concrete-50 dark:hover:bg-brand-concrete-700 transition-colors duration-150 flex items-start space-x-3 group"
                >
                  <SearchIcon className="h-4 w-4 text-brand-concrete-400 group-hover:text-brand-secondary transition-colors mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-brand-concrete-700 dark:text-brand-concrete-200 group-hover:text-brand-secondary transition-colors truncate">
                      {item.type === 'navigation' ? item.name : item.title}
                    </div>
                    {item.type === 'project' && (
                      <div className="text-xs text-brand-concrete-500 dark:text-brand-concrete-400 mt-1 line-clamp-2">
                        {item.description}
                      </div>
                    )}
                  </div>
                  {item.type === 'project' && (
                    <div className="text-xs text-brand-secondary bg-brand-secondary/10 px-2 py-1 rounded-full flex-shrink-0">
                      {t('search.projectLabel')}
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
