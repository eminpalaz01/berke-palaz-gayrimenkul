"use client"

import * as React from "react"
import Image from "next/image"
import { Moon, SunMedium, Menu, X, Phone, Mail, Globe, Check, Home, Building, User, MessageCircle, FileText, Settings } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/hooks/utils"
import { getLocaleConfig } from "@/hooks/locale-utils"
import { useDarkMode } from "@/components/providers/DarkModeProvider"
import { Link } from "@/navigation"
import { useTranslation, useNavigationTranslation } from "@/hooks/useTranslation"
import { useRuntimeConfig } from "@/utils/runtime-config"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)
  const { toggleTheme, resolvedTheme } = useDarkMode()
  const { locale, changeLanguage } = useTranslation()
  const { t } = useNavigationTranslation()
  const { config } = useRuntimeConfig()
  
  // Client-side locale detection for reliable display
  const [currentLocale] = React.useState<string>(locale)

  // Berke Palaz Gayrimenkul navigation items
  const navigation = [
    { name: t('home'), href: "/", icon: Home },
    { name: t('listings'), href: "/listings", icon: Building },
    { name: t('about'), href: "/about", icon: User },
    { name: t('blog'), href: "/blog", icon: FileText },
    { name: t('contact'), href: "/contact", icon: MessageCircle },
  ]

  React.useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 0);
          ticking = false;
        });
        ticking = true;
      }
    }

    // İlk yüklemede scroll durumunu kontrol et
    setIsScrolled(window.scrollY > 0);

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLanguageChange = (newLocale: string) => {
    changeLanguage(newLocale as 'tr' | 'en')
  }

  const trConfig = getLocaleConfig('tr')
  const enConfig = getLocaleConfig('en')

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300",
        isScrolled 
          ? "bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b shadow-lg" 
          : "bg-transparent"
      )}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        paddingTop: 'max(env(safe-area-inset-top), 0px)',
        transform: 'translateZ(0)',
        WebkitTransform: 'translateZ(0)',
        willChange: 'transform',
      }}
    >
      {/* Main Navigation */}
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20 min-h-[64px] lg:min-h-[80px]">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Link 
                href="/" 
                className="relative inline-block h-12 group"
                aria-label="Berke Palaz Gayrimenkul Ana Sayfa"
              >
                {/* Light mode logo - in normal flow to maintain width */}
                <Image
                  src="/images/logo.png"
                  alt="Berke Palaz Gayrimenkul"
                  width={180}
                  height={48}
                  className={cn(
                    "h-12 w-auto object-contain transition-opacity duration-500 ease-in-out",
                    resolvedTheme === "dark" ? "opacity-0" : "opacity-100"
                  )}
                  priority
                />
                {/* Dark mode logo - absolutely positioned */}
                <Image
                  src="/images/logo-beyaz.png"
                  alt="Berke Palaz Gayrimenkul"
                  width={180}
                  height={48}
                  className={cn(
                    "absolute inset-0 h-12 w-auto object-contain transition-opacity duration-500 ease-in-out",
                    resolvedTheme === "dark" ? "opacity-100" : "opacity-0"
                  )}
                  priority
                />
              </Link>
              {/* Hidden Admin Icon - Bottom left corner of logo */}
              <Link
                href="/admin"
                className="absolute -bottom-1 -left-1 w-3 h-3 opacity-20 hover:opacity-100 transition-opacity duration-300"
                aria-label="Yönetim Paneli"
              >
                <Settings className="w-3 h-3 text-slate-400 dark:text-slate-600" />
              </Link>
            </div>
            {/* Brand Text */}
            <div className="flex flex-col border-l border-slate-300 dark:border-slate-600 pl-3 md:pl-4">
              <span className="text-sm md:text-lg font-bold text-slate-800 dark:text-white leading-tight">
                Berke Palaz
              </span>
              <span className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-tight">
                Gayrimenkul Danışmanı
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center space-x-8">
            {navigation.map((item) => {
              const IconComponent = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors group"
                >
                  <IconComponent className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* Desktop Controls */}
          <div className="hidden xl:flex items-center space-x-4">
            {/* Contact Button */}
            <Button
              asChild
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Link href="/contact">
                {t('getConsultation')}
              </Link>
            </Button>

            {/* Language Indicator - Türkçe sabit */}
            <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 text-sm">
              <Globe className="h-4 w-4" />
              <span>TR</span>
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="w-10 h-10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Tema değiştir"
            >
              <SunMedium className="h-5 w-5 rotate-0 scale-100 dark:-rotate-90 dark:scale-0 transition-all" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 dark:rotate-0 dark:scale-100 transition-all" />
            </Button>
          </div>

          {/* Mobile Controls */}
          <div className="xl:hidden flex items-center space-x-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="w-10 h-10 text-slate-600 dark:text-slate-300"
              aria-label="Tema değiştir"
            >
              <SunMedium className="h-5 w-5 rotate-0 scale-100 dark:-rotate-90 dark:scale-0 transition-all" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 dark:rotate-0 dark:scale-100 transition-all" />
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="w-10 h-10 text-slate-600 dark:text-slate-300"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Menüyü aç/kapat"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden overflow-hidden border-t bg-white/95 dark:bg-slate-900/95 backdrop-blur-md"
            >
              <div className="py-6 space-y-4">
                {navigation.map((item) => {
                  const IconComponent = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center space-x-3 px-4 py-3 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition-colors rounded-lg mx-4"
                      onClick={() => setIsOpen(false)}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
                
                {/* Mobile Contact Button */}
                <div className="px-4 pt-4">
                  <Button
                    asChild
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
                  >
                    <Link href="/contact" onClick={() => setIsOpen(false)}>
                      {t('getConsultation')}
                    </Link>
                  </Button>
                </div>

                {/* Mobile Contact Info */}
                {config?.company && (
                  <div className="px-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
                    {config.company.phone && (
                      <a 
                        href={`tel:${config.company.phone}`}
                        className="flex items-center space-x-3 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
                        aria-label="Telefon"
                      >
                        <Phone className="h-4 w-4" />
                        <span>{config.company.phone}</span>
                      </a>
                    )}
                    {config.company.email && (
                      <a 
                        href={`mailto:${config.company.email}`}
                        className="flex items-center space-x-3 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
                        aria-label="E-posta"
                      >
                        <Mail className="h-4 w-4" />
                        <span>{config.company.email}</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
