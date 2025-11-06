"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, Cookie, FileText, X, Check, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"
import { useTranslation } from "@/hooks/useTranslation"
import { useRouter } from "@/navigation"
import { CookieManager, DataCollectionManager, cookieEvents } from "@/utils/cookieManager"

interface LegalConsentProps {
  isOpen: boolean
  onClose: () => void
  onAccept: (consents: ConsentPreferences) => void
  type?: 'banner' | 'modal'
}

export interface ConsentPreferences {
  necessary: boolean
  functional: boolean
  analytics: boolean
  marketing: boolean
  privacyPolicy: boolean
  termsOfService: boolean
}

export function LegalConsent({ isOpen, onClose, onAccept, type = 'banner' }: LegalConsentProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const [consents, setConsents] = React.useState<ConsentPreferences>({
    necessary: true, // Always true
    functional: false,
    analytics: false,
    marketing: false,
    privacyPolicy: true,
    termsOfService: true
  })
  const [showDetails, setShowDetails] = React.useState(false)

  const handleConsentChange = (key: keyof ConsentPreferences, value: boolean) => {
    if (key === 'necessary') return // Cannot change necessary cookies
    
    setConsents(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleAcceptAll = () => {
    const allConsents: ConsentPreferences = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
      privacyPolicy: true,
      termsOfService: true
    }
    setConsents(allConsents)
    onAccept(allConsents)
    onClose()
  }

  const handleAcceptSelected = () => {
    // Ensure privacy policy and terms are accepted for form submissions
    if (!consents.privacyPolicy || !consents.termsOfService) {
      // Show error or force acceptance
      return
    }
    onAccept(consents)
    onClose()
  }

  const handleRejectAll = () => {
    const minimalConsents: ConsentPreferences = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
      privacyPolicy: true, // Required for basic functionality
      termsOfService: true // Required for basic functionality
    }
    setConsents(minimalConsents)
    onAccept(minimalConsents)
    onClose()
  }

  const cookieTypes = [
    {
      key: 'necessary' as keyof ConsentPreferences,
      icon: Shield,
      title: t('LegalConsent.cookies.necessary.title'),
      description: t('LegalConsent.cookies.necessary.description'),
      required: true,
      color: 'text-green-600'
    },
    {
      key: 'functional' as keyof ConsentPreferences,
      icon: FileText,
      title: t('LegalConsent.cookies.functional.title'),
      description: t('LegalConsent.cookies.functional.description'),
      required: false,
      color: 'text-blue-600'
    },
    {
      key: 'analytics' as keyof ConsentPreferences,
      icon: Cookie,
      title: t('LegalConsent.cookies.analytics.title'),
      description: t('LegalConsent.cookies.analytics.description'),
      required: false,
      color: 'text-purple-600'
    },
    {
      key: 'marketing' as keyof ConsentPreferences,
      icon: ExternalLink,
      title: t('LegalConsent.cookies.marketing.title'),
      description: t('LegalConsent.cookies.marketing.description'),
      required: false,
      color: 'text-orange-600'
    }
  ]

  if (type === 'banner') {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-brand-concrete-800 border-t border-brand-concrete-200 dark:border-brand-concrete-600 shadow-2xl"
          >
            <div className="container-custom px-4 mobile:px-6 py-4 mobile:py-6">
              <div className="flex flex-col mobile:flex-row items-start mobile:items-center gap-4 mobile:gap-6">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-8 h-8 bg-brand-secondary rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Cookie className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="responsive-text-base mobile:responsive-text-lg font-bold text-foreground mb-2">
                      {t('LegalConsent.banner.title')}
                    </h3>
                    <p className="responsive-text-sm mobile:responsive-text-base text-muted-foreground leading-relaxed">
                      {t('LegalConsent.banner.description')}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <button
                        onClick={() => router.push('/privacy-policy')}
                        className="responsive-text-sm text-brand-secondary hover:underline font-medium"
                      >
                        {t('LegalConsent.links.privacyPolicy')}
                      </button>
                      <span className="text-muted-foreground">•</span>
                      <button
                        onClick={() => router.push('/cookie-policy')}
                        className="responsive-text-sm text-brand-secondary hover:underline font-medium"
                      >
                        {t('LegalConsent.links.cookiePolicy')}
                      </button>
                      <span className="text-muted-foreground">•</span>
                      <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="responsive-text-sm text-brand-secondary hover:underline font-medium"
                      >
                        {showDetails ? t('LegalConsent.hideDetails') : t('LegalConsent.showDetails')}
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col mobile:flex-row gap-2 mobile:gap-3 w-full mobile:w-auto">
                  <Button
                    onClick={handleAcceptAll}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 responsive-text-sm"
                  >
                    {t('LegalConsent.acceptAll')}
                  </Button>
                  <Button
                    onClick={handleRejectAll}
                    variant="outline"
                    className="border-2 border-gray-300 hover:border-gray-400 px-6 py-2 responsive-text-sm"
                  >
                    {t('LegalConsent.rejectAll')}
                  </Button>
                  <Button
                    onClick={() => setShowDetails(!showDetails)}
                    className="border-2 text-white bg-brand-secondary hover:bg-brand-secondary/80 px-6 py-2 responsive-text-sm"
                  >
                    {t('LegalConsent.customize')}
                  </Button>
                </div>
              </div>

              {/* Detailed Options */}
              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6 pt-6 border-t border-brand-concrete-200 dark:border-brand-concrete-600"
                  >
                    <div className="grid grid-cols-1 mobile:grid-cols-2 gap-4">
                      {cookieTypes.map((cookieType) => (
                        <div key={cookieType.key} className="flex items-start gap-3">
                          <cookieType.icon className={`h-5 w-5 ${cookieType.color} mt-1 flex-shrink-0`} />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="responsive-text-sm font-semibold text-foreground">
                                {cookieType.title}
                              </h4>
                              <Checkbox
                                checked={consents[cookieType.key]}
                                onCheckedChange={(checked) => handleConsentChange(cookieType.key, checked as boolean)}
                                disabled={cookieType.required}
                              />
                            </div>
                            <p className="responsive-text-xs text-muted-foreground">
                              {cookieType.description}
                            </p>
                            {cookieType.required && (
                              <span className="inline-block mt-1 px-2 py-0.5 bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 rounded-full responsive-text-xs">
                                {t('LegalConsent.required')}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex flex-col mobile:flex-row gap-2 mt-6">
                      <Button
                        onClick={handleAcceptSelected}
                        className="text-white bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-primary/90 hover:to-brand-secondary/90 px-6 py-2 responsive-text-sm"
                      >
                        {t('LegalConsent.savePreferences')}
                      </Button>
                      <Button
                        onClick={() => setShowDetails(false)}
                        variant="outline"
                        className="px-6 py-2 responsive-text-sm"
                      >
                        {t('LegalConsent.cancel')}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  // Modal version
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <Card className="p-6 mobile:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-secondary rounded-xl flex items-center justify-center">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="responsive-text-xl mobile:responsive-text-2xl font-bold text-foreground">
                    {t('LegalConsent.modal.title')}
                  </h2>
                </div>
                <Button
                  onClick={onClose}
                  variant="outline"
                  size="sm"
                  className="w-8 h-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <p className="responsive-text-base text-muted-foreground mb-6 leading-relaxed">
                {t('LegalConsent.modal.description')}
              </p>

              <div className="space-y-4 mb-6">
                {cookieTypes.map((cookieType) => (
                  <div key={cookieType.key} className="flex items-start gap-4 p-4 rounded-lg bg-muted/30">
                    <cookieType.icon className={`h-6 w-6 ${cookieType.color} mt-1 flex-shrink-0`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="responsive-text-base font-semibold text-foreground">
                          {cookieType.title}
                        </h3>
                        <Checkbox
                          checked={consents[cookieType.key]}
                          onCheckedChange={(checked) => handleConsentChange(cookieType.key, checked as boolean)}
                          disabled={cookieType.required}
                        />
                      </div>
                      <p className="responsive-text-sm text-muted-foreground leading-relaxed">
                        {cookieType.description}
                      </p>
                      {cookieType.required && (
                        <span className="inline-block mt-2 px-2 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 rounded-full responsive-text-xs">
                          {t('LegalConsent.required')}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col mobile:flex-row gap-3">
                <Button
                  onClick={handleAcceptAll}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white flex-1"
                >
                  <Check className="h-4 w-4 mr-2" />
                  {t('LegalConsent.acceptAll')}
                </Button>
                <Button
                  onClick={handleAcceptSelected}
                  className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-primary/90 hover:to-brand-secondary/90 flex-1"
                >
                  {t('LegalConsent.savePreferences')}
                </Button>
                <Button
                  onClick={handleRejectAll}
                  variant="outline"
                  className="flex-1"
                >
                  {t('LegalConsent.rejectAll')}
                </Button>
              </div>

              <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-brand-concrete-200 dark:border-brand-concrete-600">
                <button
                  onClick={() => router.push('/privacy-policy')}
                  className="responsive-text-sm text-brand-secondary hover:underline font-medium"
                >
                  {t('LegalConsent.links.privacyPolicy')}
                </button>
                <span className="text-muted-foreground">•</span>
                <button
                  onClick={() => router.push('/terms-of-service')}
                  className="responsive-text-sm text-brand-secondary hover:underline font-medium"
                >
                  {t('LegalConsent.links.termsOfService')}
                </button>
                <span className="text-muted-foreground">•</span>
                <button
                  onClick={() => router.push('/cookie-policy')}
                  className="responsive-text-sm text-brand-secondary hover:underline font-medium"
                >
                  {t('LegalConsent.links.cookiePolicy')}
                </button>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Hook for managing consent state
export function useConsent() {
  const [consents, setConsents] = React.useState<ConsentPreferences | null>(null)
  const [showConsent, setShowConsent] = React.useState(false)

  React.useEffect(() => {
    // Check if user has already given consent using CookieManager
    const savedConsents = CookieManager.getConsentPreferences()
    if (savedConsents) {
      setConsents(savedConsents)
      
      // Start collecting data based on consent
      DataCollectionManager.collectEssentialData()
      
      if (savedConsents.analytics) {
        DataCollectionManager.collectAnalyticsData()
      }
      
      if (savedConsents.functional) {
        DataCollectionManager.collectFunctionalData()
      }
    } else {
      // Show consent banner after a short delay
      const timer = setTimeout(() => {
        setShowConsent(true)
      }, 1000)
      return () => clearTimeout(timer)
    }

    // Listen for real-time consent changes
    const handleConsentChanged = (...args: unknown[]) => {
      const newConsents = args[0] as ConsentPreferences
      setConsents(newConsents)
    }

    const handleConsentCleared = () => {
      setConsents(null)
      setShowConsent(true)
    }

    cookieEvents.on('consent_changed', handleConsentChanged)
    cookieEvents.on('consent_cleared', handleConsentCleared)

    // Cleanup event listeners
    return () => {
      cookieEvents.off('consent_changed', handleConsentChanged)
      cookieEvents.off('consent_cleared', handleConsentCleared)
    }
  }, [])

  const handleConsentAccept = (newConsents: ConsentPreferences) => {
    setConsents(newConsents)
    
    // Save consents using CookieManager (this will emit events)
    CookieManager.saveConsentPreferences(newConsents)
    
    // Start collecting data based on new consent
    DataCollectionManager.collectEssentialData()
    
    if (newConsents.analytics) {
      DataCollectionManager.collectAnalyticsData()
    }
    
    if (newConsents.functional) {
      DataCollectionManager.collectFunctionalData()
    }
    
    setShowConsent(false)
  }

  const resetConsents = () => {
    CookieManager.clearAllConsents() // This will emit events
    // State will be updated via event listeners
  }

  const exportUserData = () => {
    return CookieManager.exportUserData()
  }

  return {
    consents,
    showConsent,
    setShowConsent,
    handleConsentAccept,
    resetConsents,
    exportUserData
  }
}
