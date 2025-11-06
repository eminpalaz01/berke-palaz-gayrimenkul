"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useMemo } from "react"
import { ChevronLeft, ChevronRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ResponsiveImage } from "@/components/ui/ResponsiveImage"
import { useTranslations } from 'next-intl'
import VideoModal from "@/components/ui/VideoModal"
import { useDarkMode } from "@/components/providers/DarkModeProvider"
import { useRouter } from "@/navigation"
import { useRuntimeConfig } from "@/utils/runtime-config"

const birSehreAtilanImzaImages = {
  mobile: "/images/bir-sehre-atilan-imza-desktop.png", // Portrait
  tablet: "/images/bir-sehre-atilan-imza-desktop.png", // Square
  desktop: "/images/bir-sehre-atilan-imza-desktop.png", // Landscape
};

const kaliteliHazirBetonImages = {
  mobile: "/images/kaliteli-beton-tablet.png", // Portrait
  tablet: "/images/kaliteli-beton-tablet.png", // Square
  desktop: "/images/kaliteli-beton-tablet.png", // Landscape
};

const modernYapiImages = {
  mobile: "/images/E-residance-beton-modern-yapi-tablet.png", // Portrait
  tablet: "/images/E-residance-beton-modern-yapi-tablet.png", // Square
  desktop: "/images/E-residance-beton-modern-yapi-tablet.png", // Landscape
};

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [isMobileDevice, setIsMobileDevice] = useState(false)
  const [isTabletDevice, setIsTabletDevice] = useState(false)
  const [isLandscape, setIsLandscape] = useState(false)
  const [isShortScreen, setIsShortScreen] = useState(false)
  const { resolvedTheme } = useDarkMode()
  const t = useTranslations()
  const router = useRouter()
  const { config } = useRuntimeConfig()

  const slides = useMemo(() => [
    {
      id: 1,
      title: t('hero.slides.slide1.title'),
      subtitle: t('hero.slides.slide1.subtitle'),
      description: t('hero.slides.slide1.description'),
      image: birSehreAtilanImzaImages,
      cta: t('hero.slides.slide1.cta')
    },
    {
      id: 2,
      title: t('hero.slides.slide2.title'),
      subtitle: t('hero.slides.slide2.subtitle'),
      description: t('hero.slides.slide2.description'),
      image: kaliteliHazirBetonImages,
      cta: t('hero.slides.slide2.cta')
    },
    {
      id: 3,
      title: t('hero.slides.slide3.title'),
      subtitle: t('hero.slides.slide3.subtitle'),
      description: t('hero.slides.slide3.description'),
      image: modernYapiImages,
      cta: t('hero.slides.slide3.cta')
    }
  ], [t])

  useEffect(() => {
    const checkDeviceState = () => {
      // Use screen dimensions for a stable check of the device type, e.g., phones/small tablets
      const isPhone = Math.min(window.screen.width, window.screen.height) < 768;
      setIsMobileDevice(isPhone);

      const landscape = window.matchMedia("(orientation: landscape)").matches;
      setIsLandscape(landscape);
      
      const shortScreen = window.innerHeight < 650;
      setIsShortScreen(shortScreen);
    }

    checkDeviceState()
    window.addEventListener("resize", checkDeviceState)
    return () => window.removeEventListener("resize", checkDeviceState)
  }, [])

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const isMobileLandscape = isMobileDevice && isLandscape;

  const handleSliderButtonClick = () => {
    const currentSliderId = slides[currentSlide].id;
    
    // Check the CTA text to determine the action
    if (currentSliderId === 1) {
      // Scroll to services section
      const servicesSection = document.querySelector('[data-section="services"]');
      if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (currentSliderId === 2) {
      // Navigate to contact page using Next.js router
      router.push('/contact');
    } else if (currentSliderId === 3) {
      // Navigate to projects page using Next.js router
      router.push('/projects');
    } else {
      // Default fallback - scroll to services
      const servicesSection = document.querySelector('[data-section="services"]');
      if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="relative h-[100svh] sm:h-screen overflow-hidden">
      {/* Render all slides for preloading, but only show the active one */}
      {slides.map((slide, index) => (
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: index === currentSlide ? 1 : 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 bg-brand-concrete-900"
        >
          <ResponsiveImage
            src={slide.image}
            alt={slide.title}
            className="z-10 object-cover"
            containerClassName="absolute inset-0"
            fill
            priority={index === 0} // Prioritize only the first slide
            loading={index === 0 ? "eager" : "lazy"}
          />
          <div className="absolute inset-0 bg-black/40 z-20" />
        </motion.div>
      ))}

      {/* Content - Mobile Grouped Layout */}
      <div className={`relative z-30 h-full flex justify-center px-4 sm:px-6 md:px-8 lg:px-0 ${
        isMobileLandscape ? 'items-start pt-12' : 'items-center'
      } ${
        isShortScreen && !isMobileLandscape ? 'pt-16 sm:pt-20' : ''
      }`}>
        <div className="container-custom">
          <div className={isMobileLandscape
            ? "max-w-4xl"
            : "max-w-4xl sm:max-w-none sm:flex sm:items-center sm:justify-between sm:w-full sm:gap-8 md:gap-12 lg:gap-16 xl:gap-20"
          }>
            <div className={isMobileLandscape ? "w-full" : "sm:max-w-3xl md:max-w-4xl xl:max-w-5xl"}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.6 }}
                  className={isMobileLandscape ? "text-white text-center" : "text-white text-center sm:text-left"}
                >
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="responsive-text-xl text-brand-secondary font-bold mb-3 sm:mb-4"
                  >
                    {slides[currentSlide].subtitle}
                  </motion.p>

                  <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="responsive-heading-xl font-heading font-bold leading-tight mb-4 sm:mb-6"
                  >
                    {slides[currentSlide].title}
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className={`responsive-text-lg text-gray-200 mb-6 sm:mb-8 max-w-2xl leading-relaxed mx-auto sm:mx-0 ${isMobileLandscape ? 'hidden' : ''}`}
                  >
                    {slides[currentSlide].description}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className={`flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center sm:justify-start mx-8 sm:mx-0 ${isMobileLandscape ? 'mb-4' : 'mb-8 sm:mb-0'}`}
                  >
                    <Button
                      onClick={handleSliderButtonClick}
                      size={isMobileLandscape ? 'sm' : 'lg'}
                      className={isMobileLandscape
                        ? 'bg-orange-500 hover:bg-orange-600 text-white font-semibold w-full sm:w-auto py-2 px-4 responsive-text-sm'
                        : 'bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 sm:px-8 sm:py-4 responsive-text-lg font-semibold w-full sm:w-auto'
                      }
                    >
                      {slides[currentSlide].cta}
                    </Button>

                    <Button
                      onClick={() => setIsVideoModalOpen(true)}
                      variant="outline"
                      size={isMobileLandscape ? 'sm' : 'lg'}
                      className={isMobileLandscape
                        ? 'bg-white/10 text-white font-semibold w-full sm:w-auto py-2 px-4 responsive-text-sm'
                        : 'bg-white/10 text-white px-6 py-3 sm:px-8 sm:py-4 responsive-text-lg font-semibold w-full sm:w-auto'
                      }
                    >
                      <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      {t('hero.watchVideo')}
                    </Button>
                  </motion.div>

                  {/* Mobile Stats - Integrated with content */}
                  {isMobileDevice && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className={`mt-6 ${isMobileLandscape ? 'mt-3' : ''}`}
                    >
                      <div className="bg-black/40 rounded-xl p-5 shadow-2xl max-w-xs mx-auto border border-white/20">
                        <div className={`grid gap-4 ${isMobileLandscape ? 'grid-cols-4' : 'grid-cols-2'}`}>
                          {[
                            { value: "30+", label: t('stats.experience'), delay: 0.5 },
                            { value: "200+", label: t('stats.projects'), delay: 0.6 },
                            { value: "3", label: t('hero.productionPlants'), delay: 0.7 },
                            { value: "150+", label: t('stats.employees'), delay: 0.8 }
                          ].map((stat, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ 
                                duration: 0.3, 
                                delay: stat.delay,
                                ease: "easeOut"
                              }}
                              className="text-center group"
                            >
                              <div className={`font-bold text-brand-secondary mb-1 group-hover:text-white transition-colors duration-200 ${isMobileLandscape ? 'text-lg' : 'text-xl'}`}>
                                {stat.value}
                              </div>
                              <div className={`text-gray-200 leading-tight font-medium group-hover:text-white transition-colors duration-200 ${isMobileLandscape ? 'text-[10px]' : 'text-xs'}`}>
                                {stat.label}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-40 w-8 h-8 lg:w-12 lg:h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300"
        aria-label={t('common.previous')}
      >
        <ChevronLeft className="h-4 w-4 lg:h-6 lg:w-6" />
      </button>

      <button
        onClick={nextSlide}
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-40 w-8 h-8 lg:w-12 lg:h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300"
        aria-label={t('common.next')}
      >
        <ChevronRight className="h-4 w-4 lg:h-6 lg:w-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-brand-secondary w-8' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Slayt ${index + 1}`}
          />
        ))}
      </div>

      {/* Desktop Stats Overlay - Right Bottom Positioning */}
      {!isMobileDevice && (
        <div className="absolute right-8 lg:right-12 bottom-16 lg:bottom-20 z-30">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-black/40 backdrop-blur-lg rounded-2xl px-8 py-6 lg:px-10 lg:py-7 shadow-2xl border border-white/20"
          >
            <div className="grid grid-cols-4 gap-6 lg:gap-8">
              {[
                { value: "30+", label: t('stats.experience'), delay: 0.5 },
                { value: "200+", label: t('stats.projects'), delay: 0.6 },
                { value: "3", label: t('hero.productionPlants'), delay: 0.7 },
                { value: "150+", label: t('stats.employees'), delay: 0.8 }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: stat.delay,
                    ease: "easeOut"
                  }}
                  className="text-center group"
                >
                  <div className="text-2xl lg:text-3xl font-bold text-brand-secondary mb-1 group-hover:text-white transition-colors duration-200">
                    {stat.value}
                  </div>
                  <div className="text-sm lg:text-base text-gray-200 leading-tight font-medium group-hover:text-white transition-colors duration-200">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Video Modal */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoId={config?.media?.heroVideoId || "JQHOA9LMPVY"}
      />
    </section>
  )
}
