"use client"

import * as React from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Mountain, Truck, Shield, CheckCircle, Factory, Award } from "lucide-react"
import { useTranslation } from "@/hooks/useTranslation"
import { AnimatedSectionHeader } from "@/components/ui/AnimatedSectionHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "@/navigation"

export function QuarryPage() {
  const { t, locale } = useTranslation()

  const aggregateTypes = [
    { 
      id: "sand", 
      nameKey: "sand", 
      sizes: "0-4 mm",
      usageKey: "sandUsage"
    },
    { 
      id: "gravel", 
      nameKey: "gravel", 
      sizes: "4-16 mm",
      usageKey: "gravelUsage"
    },
    { 
      id: "crushed-stone", 
      nameKey: "crushedStone", 
      sizes: "16-32 mm",
      usageKey: "crushedStoneUsage"
    },
    { 
      id: "ballast", 
      nameKey: "ballast", 
      sizes: "32-63 mm",
      usageKey: "ballastUsage"
    }
  ]

  const features = [
    {
      id: "own-quarry",
      icon: Mountain,
      titleKey: "ownQuarry",
      descriptionKey: "ownQuarryDesc"
    },
    {
      id: "modern-facility",
      icon: Factory,
      titleKey: "modernFacility",
      descriptionKey: "modernFacilityDesc"
    },
    {
      id: "quality-standards",
      icon: Shield,
      titleKey: "qualityStandards",
      descriptionKey: "qualityStandardsDesc"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-brand-concrete-50 dark:from-brand-concrete-900 dark:to-brand-concrete-800">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 dark:from-brand-primary/5 dark:to-brand-secondary/5" />
        
        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h1 className="responsive-text-4xl lg:responsive-text-5xl font-bold text-brand-concrete-900 dark:text-white leading-tight">
                  {t('services.quarryServices.title')}
                </h1>
                <p className="responsive-text-lg text-brand-concrete-600 dark:text-brand-concrete-300 leading-relaxed">
                  {t('services.quarryServices.subtitle')}
                </p>
                <div className="space-y-3">
                  <p className="responsive-text-base text-brand-concrete-600 dark:text-brand-concrete-300">
                    {t('services.quarryServices.description1')}
                  </p>
                  <p className="responsive-text-base text-brand-concrete-600 dark:text-brand-concrete-300">
                    {t('services.quarryServices.description2')}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="responsive-text-base">
                  <Link href="/contact">
                    {t('services.quarryServices.getQuote')}
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="responsive-text-base">
                  <Link href="/contact">
                    {t('services.quarryServices.visitFacility')}
                  </Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] sm:aspect-[3/2] lg:aspect-[4/3]">
                <Image
                  src="/images/services/quarry/quarry-aerial.jpg"
                  alt={t('services.quarryServices.title')}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/20 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Aggregate Types Section */}
      <section className="py-20 bg-white dark:bg-brand-concrete-800">
        <div className="container-custom">
          <AnimatedSectionHeader
            title={t('services.quarryServices.aggregateTypes')}
            subtitle={t('services.quarryServices.aggregateTypesSubtitle')}
            className="text-center mb-16"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {aggregateTypes.map((aggregate, index) => (
              <motion.div
                key={aggregate.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-0 bg-gradient-to-br from-white to-brand-concrete-50 dark:from-brand-concrete-700 dark:to-brand-concrete-800">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 mx-auto mb-4 bg-brand-primary/10 dark:bg-brand-primary/20 rounded-full flex items-center justify-center">
                      <Mountain className="w-8 h-8 text-brand-primary" />
                    </div>
                    <CardTitle className="responsive-text-xl">{t(`services.quarryServices.${aggregate.nameKey}`)}</CardTitle>
                    <div className="responsive-text-sm text-brand-primary font-semibold">{aggregate.sizes}</div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="responsive-text-base text-center">
                      {t(`services.quarryServices.${aggregate.usageKey}`)}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-brand-concrete-50 dark:bg-brand-concrete-900">
        <div className="container-custom">
          <AnimatedSectionHeader
            title={t('services.quarryServices.whySelale')}
            subtitle={t('services.quarryServices.whySelaleSubtitle')}
            className="text-center mb-16"
          />

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-brand-primary/10 dark:bg-brand-primary/20 rounded-full flex items-center justify-center">
                  <feature.icon className="w-10 h-10 text-brand-primary" />
                </div>
                <h3 className="responsive-text-xl font-semibold mb-4 text-brand-concrete-900 dark:text-white">
                  {t(`services.quarryServices.${feature.titleKey}`)}
                </h3>
                <p className="responsive-text-base text-brand-concrete-600 dark:text-brand-concrete-300">
                  {t(`services.quarryServices.${feature.descriptionKey}`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-brand-primary to-brand-secondary">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto space-y-8"
          >
            <h2 className="responsive-text-3xl lg:responsive-text-4xl font-bold text-white">
              {t('services.quarryServices.ctaTitle')}
            </h2>
            <p className="responsive-text-lg text-white/90">
              {t('services.quarryServices.ctaSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="responsive-text-base">
                <Link href="/contact">
                  {t('services.quarryServices.freeQuote')}
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="responsive-text-base border-white hover:bg-white hover:text-brand-primary">
                <Link href="tel:+905466991701">
                  {t('services.quarryServices.visitFacility')}
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
