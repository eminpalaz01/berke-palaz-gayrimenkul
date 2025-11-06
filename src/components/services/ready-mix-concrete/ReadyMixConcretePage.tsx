"use client"

import * as React from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Factory, Truck, Shield, CheckCircle, Clock, Award } from "lucide-react"
import { useTranslation } from "@/hooks/useTranslation"
import { AnimatedSectionHeader } from "@/components/ui/AnimatedSectionHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "@/navigation"

export function ReadyMixConcretePage() {
  const { t, locale } = useTranslation()

  const concreteTypes = [
    { id: "c20", strength: "C20/25", usageKey: "c20Usage" },
    { id: "c25", strength: "C25/30", usageKey: "c25Usage" },
    { id: "c30", strength: "C30/37", usageKey: "c30Usage" },
    { id: "c35", strength: "C35/45", usageKey: "c35Usage" }
  ]

  const features = [
    {
      id: "quality-control",
      icon: Shield,
      titleKey: "qualityControl",
      descriptionKey: "qualityControlDesc"
    },
    {
      id: "fast-delivery",
      icon: Truck,
      titleKey: "fastDelivery",
      descriptionKey: "fastDeliveryDesc"
    },
    {
      id: "production-capacity",
      icon: Factory,
      titleKey: "productionCapacity",
      descriptionKey: "productionCapacityDesc"
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
                  {t('services.readyMixConcrete.title')}
                </h1>
                <p className="responsive-text-lg text-brand-concrete-600 dark:text-brand-concrete-300 leading-relaxed">
                  {t('services.readyMixConcrete.subtitle')}
                </p>
                <div className="space-y-3">
                  <p className="responsive-text-base text-brand-concrete-600 dark:text-brand-concrete-300">
                    {t('services.readyMixConcrete.description1')}
                  </p>
                  <p className="responsive-text-base text-brand-concrete-600 dark:text-brand-concrete-300">
                    {t('services.readyMixConcrete.description2')}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="responsive-text-base">
                  <Link href="/contact">
                    {t('services.readyMixConcrete.getQuote')}
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="responsive-text-base">
                  <Link href="/about">
                    {t('services.readyMixConcrete.qualityCertificates')}
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
                  src="/images/services/ready-mix-concrete/concrete-production-plant.jpg"
                  alt={t('services.readyMixConcrete.title')}
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

      {/* Concrete Types Section */}
      <section className="py-20 bg-white dark:bg-brand-concrete-800">
        <div className="container-custom">
          <AnimatedSectionHeader
            title={t('services.readyMixConcrete.concreteClasses')}
            subtitle={t('services.readyMixConcrete.concreteClassesSubtitle')}
            className="text-center mb-16"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {concreteTypes.map((concrete, index) => (
              <motion.div
                key={concrete.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-0 bg-gradient-to-br from-white to-brand-concrete-50 dark:from-brand-concrete-700 dark:to-brand-concrete-800">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 mx-auto mb-4 bg-brand-primary/10 dark:bg-brand-primary/20 rounded-full flex items-center justify-center">
                      <span className="responsive-text-lg font-bold text-brand-primary">{concrete.strength}</span>
                    </div>
                    <CardTitle className="responsive-text-xl">{concrete.strength}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="responsive-text-base text-center">
                      {t(`services.readyMixConcrete.${concrete.usageKey}`)}
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
            title={t('services.readyMixConcrete.whySelale')}
            subtitle={t('services.readyMixConcrete.whySelaleSubtitle')}
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
                  {t(`services.readyMixConcrete.${feature.titleKey}`)}
                </h3>
                <p className="responsive-text-base text-brand-concrete-600 dark:text-brand-concrete-300">
                  {t(`services.readyMixConcrete.${feature.descriptionKey}`)}
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
              {t('services.readyMixConcrete.ctaTitle')}
            </h2>
            <p className="responsive-text-lg text-white/90">
              {t('services.readyMixConcrete.ctaSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="responsive-text-base">
                <Link href="/contact">
                  {t('services.readyMixConcrete.freeQuote')}
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="responsive-text-base border-white hover:bg-white hover:text-brand-primary">
                <Link href="tel:+905466991701">
                  {t('services.readyMixConcrete.callNow')}
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
