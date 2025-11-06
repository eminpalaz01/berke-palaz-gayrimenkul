"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Cookie, Settings, Eye, Shield, Database, Trash2, Mail, Phone, MapPin, Calendar, ToggleLeft, ToggleRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useTranslation } from "@/hooks/useTranslation"
import { Button } from "@/components/ui/button"
import { useRouter } from "@/navigation"
import { useConsent } from "@/components/ui/LegalConsent"
import { useRuntimeConfig } from "@/utils/runtime-config"
import { useParams } from "next/navigation"

export function CookiePolicyPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const { consents, handleConsentAccept } = useConsent()
  const { config } = useRuntimeConfig()
  const params = useParams()
  const locale = params.locale as string || 'tr'
  
  // Initialize cookie preferences from global state or defaults
  const [cookiePreferences, setCookiePreferences] = React.useState({
    necessary: true, // Always true, cannot be disabled
    analytics: consents?.analytics || false,
    marketing: consents?.marketing || false,
    functional: consents?.functional || false
  })

  // Update local state when global consents change
  React.useEffect(() => {
    if (consents) {
      setCookiePreferences({
        necessary: true,
        analytics: consents.analytics,
        marketing: consents.marketing,
        functional: consents.functional
      })
    }
  }, [consents])

  const cookieTypes = [
    {
      id: "necessary",
      icon: Shield,
      title: t('CookiePolicy.cookieTypes.necessary.title'),
      description: t('CookiePolicy.cookieTypes.necessary.description'),
      required: true,
      color: "bg-green-500"
    },
    {
      id: "functional",
      icon: Settings,
      title: t('CookiePolicy.cookieTypes.functional.title'),
      description: t('CookiePolicy.cookieTypes.functional.description'),
      required: false,
      color: "bg-blue-500"
    },
    {
      id: "analytics",
      icon: Eye,
      title: t('CookiePolicy.cookieTypes.analytics.title'),
      description: t('CookiePolicy.cookieTypes.analytics.description'),
      required: false,
      color: "bg-purple-500"
    },
    {
      id: "marketing",
      icon: Database,
      title: t('CookiePolicy.cookieTypes.marketing.title'),
      description: t('CookiePolicy.cookieTypes.marketing.description'),
      required: false,
      color: "bg-orange-500"
    }
  ]

  const sections = [
    {
      id: "what-are-cookies",
      icon: Cookie,
      title: t('CookiePolicy.sections.whatAreCookies.title'),
      content: t('CookiePolicy.sections.whatAreCookies.content')
    },
    {
      id: "how-we-use",
      icon: Settings,
      title: t('CookiePolicy.sections.howWeUse.title'),
      content: t('CookiePolicy.sections.howWeUse.content')
    },
    {
      id: "managing-cookies",
      icon: Trash2,
      title: t('CookiePolicy.sections.managingCookies.title'),
      content: t('CookiePolicy.sections.managingCookies.content')
    }
  ]

  const handleCookieToggle = (cookieType: string) => {
    if (cookieType === 'necessary') return // Cannot disable necessary cookies
    
    setCookiePreferences(prev => ({
      ...prev,
      [cookieType]: !prev[cookieType as keyof typeof prev]
    }))
  }

  const savePreferences = () => {
    // Use global consent system instead of localStorage
    const newConsents = {
      necessary: true,
      functional: cookiePreferences.functional,
      analytics: cookiePreferences.analytics,
      marketing: cookiePreferences.marketing,
      privacyPolicy: consents?.privacyPolicy || true,
      termsOfService: consents?.termsOfService || true
    }
    
    handleConsentAccept(newConsents)
    
    // Show success message
    const notification = document.createElement('div')
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in'
    notification.textContent = t('CookiePolicy.preferences.saved')
    document.body.appendChild(notification)
    setTimeout(() => {
      notification.remove()
    }, 3000)
  }

  const acceptAll = () => {
    const newPreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true
    }
    setCookiePreferences(newPreferences)
    
    const newConsents = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
      privacyPolicy: consents?.privacyPolicy || true,
      termsOfService: consents?.termsOfService || true
    }
    
    handleConsentAccept(newConsents)
  }

  const rejectAll = () => {
    const newPreferences = {
      necessary: true, // Always true
      analytics: false,
      marketing: false,
      functional: false
    }
    setCookiePreferences(newPreferences)
    
    const newConsents = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
      privacyPolicy: consents?.privacyPolicy || true,
      termsOfService: consents?.termsOfService || true
    }
    
    handleConsentAccept(newConsents)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 mobile:py-24 tablet:py-28 desktop:py-36 bg-gradient-to-br from-brand-concrete-50 via-white to-brand-concrete-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-5">
          <div className="absolute top-5 left-5 mobile:top-10 mobile:left-10 w-20 h-20 mobile:w-32 mobile:h-32 bg-brand-secondary rounded-full blur-3xl dark:bg-gray-600"></div>
          <div className="absolute bottom-5 right-5 mobile:bottom-10 mobile:right-10 w-24 h-24 mobile:w-40 mobile:h-40 bg-brand-primary rounded-full blur-3xl dark:bg-gray-700"></div>
        </div>
        
        <div className="container-custom relative z-10 px-4 mobile:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-600 px-4 py-2 rounded-full responsive-text-sm font-medium mb-6">
              <Cookie className="h-4 w-4" />
              {t('CookiePolicy.badge')}
            </div>
            
            <h1 className="responsive-text-3xl mobile:responsive-text-4xl tablet:responsive-text-6xl desktop:responsive-text-7xl font-bold text-foreground mb-4 mobile:mb-6 leading-tight">
              {t('CookiePolicy.title')}
            </h1>
            <p className="responsive-text-base mobile:responsive-text-lg tablet:responsive-text-xl text-muted-foreground mb-6 mobile:mb-8 leading-relaxed max-w-3xl mx-auto">
              {t('CookiePolicy.description')}
            </p>
            
            <div className="flex items-center justify-center gap-2 responsive-text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{t('CookiePolicy.lastUpdated')}: {new Date().toLocaleDateString()}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cookie Preferences Section */}
      <section className="py-12 mobile:py-16 tablet:py-20 desktop:py-24 bg-gradient-to-b from-muted/30 to-background dark:from-gray-900/30 dark:to-background">
        <div className="container-custom px-4 mobile:px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12 mobile:mb-16"
            >
              <h2 className="responsive-text-2xl mobile:responsive-text-3xl tablet:responsive-text-4xl font-bold text-foreground mb-4">
                {t('CookiePolicy.preferences.title')}
              </h2>
              <p className="responsive-text-base mobile:responsive-text-lg text-muted-foreground">
                {t('CookiePolicy.preferences.description')}
              </p>
            </motion.div>

            {/* Cookie Types */}
            <div className="space-y-6 mb-12">
              {cookieTypes.map((cookieType, index) => (
                <motion.div
                  key={cookieType.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="p-6 mobile:p-8 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-start gap-4 mobile:gap-6">
                      <div className={`w-12 h-12 mobile:w-14 mobile:h-14 ${cookieType.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <cookieType.icon className="h-6 w-6 mobile:h-7 mobile:w-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="responsive-text-lg mobile:responsive-text-xl font-bold text-foreground">
                            {cookieType.title}
                          </h3>
                          <button
                            onClick={() => handleCookieToggle(cookieType.id)}
                            disabled={cookieType.required}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${
                              cookiePreferences[cookieType.id as keyof typeof cookiePreferences]
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                            } ${cookieType.required ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                          >
                            {cookiePreferences[cookieType.id as keyof typeof cookiePreferences] ? (
                              <ToggleRight className="h-4 w-4" />
                            ) : (
                              <ToggleLeft className="h-4 w-4" />
                            )}
                            <span className="responsive-text-sm font-medium">
                              {cookiePreferences[cookieType.id as keyof typeof cookiePreferences] 
                                ? t('CookiePolicy.preferences.enabled') 
                                : t('CookiePolicy.preferences.disabled')
                              }
                            </span>
                            {cookieType.required && (
                              <span className="responsive-text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 px-2 py-0.5 rounded-full">
                                {t('CookiePolicy.preferences.required')}
                              </span>
                            )}
                          </button>
                        </div>
                        <p className="responsive-text-base text-muted-foreground leading-relaxed">
                          {cookieType.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col mobile:flex-row gap-4 justify-center"
            >
              <Button
                onClick={acceptAll}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3"
              >
                {t('CookiePolicy.preferences.acceptAll')}
              </Button>
              <Button
                onClick={savePreferences}
                className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-primary/90 hover:to-brand-secondary/90 px-8 py-3"
              >
                {t('CookiePolicy.preferences.saveSelected')}
              </Button>
              <Button
                onClick={rejectAll}
                variant="outline"
                className="border-2 border-gray-300 hover:border-gray-400 px-8 py-3"
              >
                {t('CookiePolicy.preferences.rejectAll')}
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 mobile:py-16 tablet:py-20 desktop:py-24">
        <div className="container-custom px-4 mobile:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12 mobile:mb-16"
            >
              <Card className="p-6 mobile:p-8 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-gray-800/30 dark:to-gray-800/30 border-orange-200 dark:border-gray-700">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Cookie className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="responsive-text-xl mobile:responsive-text-2xl font-bold mb-3 text-foreground">
                      {t('CookiePolicy.introduction.title')}
                    </h2>
                    <p className="responsive-text-base text-muted-foreground leading-relaxed">
                      {t('CookiePolicy.introduction.content')}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Sections */}
            <div className="space-y-8 mobile:space-y-12">
              {sections.map((section, index) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="p-6 mobile:p-8 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-start gap-4 mobile:gap-6">
                      <div className="w-12 h-12 mobile:w-14 mobile:h-14 bg-gradient-to-br from-brand-secondary/20 to-brand-primary/20 dark:from-gray-700 dark:to-gray-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <section.icon className="h-6 w-6 mobile:h-7 mobile:w-7 text-brand-secondary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="responsive-text-lg mobile:responsive-text-xl font-bold mb-3 mobile:mb-4 text-foreground">
                          {section.title}
                        </h3>
                        <div className="responsive-text-base text-muted-foreground leading-relaxed space-y-3">
                          {section.content.split('\n').map((paragraph, pIndex) => (
                            <p key={pIndex}>{paragraph}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-12 mobile:mt-16"
            >
              <Card className="p-6 mobile:p-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800/30 dark:to-gray-800/30 border-green-200 dark:border-gray-700">
                <div className="text-center">
                  <h3 className="responsive-text-xl mobile:responsive-text-2xl font-bold mb-4 text-foreground">
                    {t('CookiePolicy.contact.title')}
                  </h3>
                  <p className="responsive-text-base text-muted-foreground mb-6 leading-relaxed">
                    {t('CookiePolicy.contact.description')}
                  </p>
                  
                  <div className="flex flex-col mobile:flex-row items-center justify-center gap-4 mobile:gap-8 mb-6">
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-brand-secondary" />
                      <a 
                        href={`mailto:${config?.company?.email || 'berke.palaz@cb.com.tr'}`} 
                        className="responsive-text-base font-medium text-brand-secondary hover:underline"
                      >
                        {config?.company?.email || 'berke.palaz@cb.com.tr'}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-brand-secondary" />
                      <a 
                        href={`tel:${config?.company?.phone || '+905051529818'}`} 
                        className="responsive-text-base font-medium text-brand-secondary hover:underline"
                      >
                        {config?.company?.phone || '+90 505 152 98 18'}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 responsive-text-sm text-muted-foreground mb-6">
                    <MapPin className="h-4 w-4" />
                    <span>{config?.company?.address?.[locale]?.full || t('CookiePolicy.contact.address')}</span>
                  </div>
                  
                  <Button 
                    onClick={() => router.push('/contact')}
                    className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-primary/90 hover:to-brand-secondary/90"
                  >
                    {t('CookiePolicy.contact.button')}
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
