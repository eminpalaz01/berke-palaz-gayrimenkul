"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { FileText, Scale, AlertCircle, Users, Shield, Gavel, Mail, Phone, MapPin, Calendar } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useTranslation } from "@/hooks/useTranslation"
import { Button } from "@/components/ui/button"
import { useRouter } from "@/navigation"
import { useRuntimeConfig } from "@/utils/runtime-config"
import { useParams } from "next/navigation"

export function TermsOfServicePage() {
  const { t } = useTranslation()
  const router = useRouter()
  const { config } = useRuntimeConfig()
  const params = useParams()
  const locale = params.locale as string || 'tr'

  const sections = [
    {
      id: "acceptance",
      icon: Scale,
      title: t('TermsOfService.sections.acceptance.title'),
      content: t('TermsOfService.sections.acceptance.content')
    },
    {
      id: "services",
      icon: FileText,
      title: t('TermsOfService.sections.services.title'),
      content: t('TermsOfService.sections.services.content')
    },
    {
      id: "user-responsibilities",
      icon: Users,
      title: t('TermsOfService.sections.userResponsibilities.title'),
      content: t('TermsOfService.sections.userResponsibilities.content')
    },
    {
      id: "intellectual-property",
      icon: Shield,
      title: t('TermsOfService.sections.intellectualProperty.title'),
      content: t('TermsOfService.sections.intellectualProperty.content')
    },
    {
      id: "limitation-liability",
      icon: AlertCircle,
      title: t('TermsOfService.sections.limitationLiability.title'),
      content: t('TermsOfService.sections.limitationLiability.content')
    },
    {
      id: "governing-law",
      icon: Gavel,
      title: t('TermsOfService.sections.governingLaw.title'),
      content: t('TermsOfService.sections.governingLaw.content')
    }
  ]

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
            <div className="inline-flex items-center gap-2 bg-brand-primary/10 text-brand-primary px-4 py-2 rounded-full responsive-text-sm font-medium mb-6">
              <Scale className="h-4 w-4" />
              {t('TermsOfService.badge')}
            </div>
            
            <h1 className="responsive-text-3xl mobile:responsive-text-4xl tablet:responsive-text-6xl desktop:responsive-text-7xl font-bold text-foreground mb-4 mobile:mb-6 leading-tight">
              {t('TermsOfService.title')}
            </h1>
            <p className="responsive-text-base mobile:responsive-text-lg tablet:responsive-text-xl text-muted-foreground mb-6 mobile:mb-8 leading-relaxed max-w-3xl mx-auto">
              {t('TermsOfService.description')}
            </p>
            
            <div className="flex items-center justify-center gap-2 responsive-text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{t('TermsOfService.lastUpdated')}: {new Date().toLocaleDateString()}</span>
            </div>
          </motion.div>
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
              <Card className="p-6 mobile:p-8 bg-gradient-to-r from-brand-primary/5 to-brand-secondary/5 dark:from-gray-800/50 dark:to-gray-800/50 border-brand-primary/20 dark:border-gray-700">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-primary rounded-xl flex items-center justify-center flex-shrink-0">
                    <Scale className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="responsive-text-xl mobile:responsive-text-2xl font-bold mb-3 text-foreground">
                      {t('TermsOfService.introduction.title')}
                    </h2>
                    <p className="responsive-text-base text-muted-foreground leading-relaxed">
                      {t('TermsOfService.introduction.content')}
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

            {/* Important Notice */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-12 mobile:mt-16"
            >
              <Card className="p-6 mobile:p-8 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-800/30 dark:to-gray-800/30 border-amber-200 dark:border-gray-700">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="responsive-text-xl mobile:responsive-text-2xl font-bold mb-3 text-foreground">
                      {t('TermsOfService.importantNotice.title')}
                    </h3>
                    <p className="responsive-text-base text-muted-foreground leading-relaxed">
                      {t('TermsOfService.importantNotice.content')}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

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
                    {t('TermsOfService.contact.title')}
                  </h3>
                  <p className="responsive-text-base text-muted-foreground mb-6 leading-relaxed">
                    {t('TermsOfService.contact.description')}
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
                    <span>{config?.company?.address?.[locale]?.full || t('TermsOfService.contact.address')}</span>
                  </div>
                  
                  <Button 
                    onClick={() => router.push('/contact')}
                    className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-primary/90 hover:to-brand-secondary/90"
                  >
                    {t('TermsOfService.contact.button')}
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
