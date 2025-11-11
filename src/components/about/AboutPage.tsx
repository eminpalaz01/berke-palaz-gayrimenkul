"use client"

import { useTranslation } from "@/hooks/useTranslation"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Image from "next/image"
import { 
  Home, 
  Briefcase, 
  TrendingUp, 
  Calculator, 
  Building, 
  Settings,
  Phone,
  Mail,
  MapPin
} from "lucide-react"
import { useRuntimeConfig } from "@/utils/runtime-config"
import { useParams } from "next/navigation"

export function AboutPage() {
  const { t } = useTranslation()
  const { config, loading } = useRuntimeConfig()
  const params = useParams()
  const locale = params.locale as string || 'tr'

  const services = [
    {
      icon: Home,
      title: t('services.residentialSales'),
      description: t('services.residentialSalesDesc')
    },
    {
      icon: Briefcase,
      title: t('services.commercialProperties'),
      description: t('services.commercialPropertiesDesc')
    },
    {
      icon: TrendingUp,
      title: t('services.investmentConsulting'),
      description: t('services.investmentConsultingDesc')
    },
    {
      icon: Calculator,
      title: t('services.propertyValuation'),
      description: t('services.propertyValuationDesc')
    },
    {
      icon: Building,
      title: t('services.projectDevelopment'),
      description: t('services.projectDevelopmentDesc')
    },
    {
      icon: Settings,
      title: t('services.propertyManagement'),
      description: t('services.propertyManagementDesc')
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pt-20">
      {/* Hero Section */}
      <section className="py-16 md:py-24 lg:py-32 bg-gray-50 dark:bg-slate-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center text-center lg:items-start lg:text-left"
            >
              <div className="rounded-full w-40 h-40 mb-6 shadow-lg overflow-hidden">
                <Image
                  src="/images/profile.png"
                  alt="Berke Palaz Profile"
                  width={160}
                  height={160}
                  className="object-cover w-full h-full"
                  style={{ objectPosition: 'center 10%' }} // üstten %10 kırpma
                />
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-gray-900 dark:text-white">
                Berke Palaz
              </h1>
              <h2 className="text-xl font-medium text-blue-600 dark:text-blue-400 mt-2">
                {t('about.subtitle')}
              </h2>
              <p className="mt-4 text-gray-600 dark:text-slate-300 max-w-[600px]">
                {config?.stats?.yearsOfExperience || 10}+ {t('about.experience')} | {config?.stats?.happyClients || 100}+ {t('about.happyClients')}
              </p>
              <p className="mt-4 text-gray-700 dark:text-slate-300 max-w-[600px] leading-relaxed">
                {t('about.description')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid gap-6"
            >
              <div className="rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm transition-all hover:shadow-md">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('about.vision')}</h3>
                <p className="mt-2 text-gray-600 dark:text-slate-300">{t('about.visionText')}</p>
              </div>
              <div className="rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm transition-all hover:shadow-md">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('about.mission')}</h3>
                <p className="mt-2 text-gray-600 dark:text-slate-300">{t('about.missionText')}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-slate-800">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
          >
            <div className="inline-block rounded-lg bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-sm text-blue-700 dark:text-blue-400">
              {t('services.title')}
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl text-gray-900 dark:text-white">
              {t('services.subtitle')}
            </h2>
            <p className="max-w-[900px] text-gray-600 dark:text-slate-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {t('services.description')}
            </p>
          </motion.div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => {
              const IconComponent = service.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex flex-col gap-4 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm transition-all hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg"
                >
                  <IconComponent className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{service.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-slate-300">{service.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-slate-900">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
          >
            <div className="inline-block rounded-lg bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-sm text-blue-700 dark:text-blue-400">
              {t('contact.title')}
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl text-gray-900 dark:text-white">
              {t('contact.subtitle')}
            </h2>
            <p className="max-w-[900px] text-gray-600 dark:text-slate-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {t('contact.description')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="mx-auto mt-12 max-w-3xl rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-sm"
          >
            <div className="divide-y divide-gray-200 dark:divide-slate-700">
              <div className="py-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <p className="font-semibold text-gray-700 dark:text-slate-300">{t('contact.info.phone')}</p>
                </div>
                <p className="md:col-span-2 text-gray-900 dark:text-white">
                  {config?.company?.phone || '+90 555 123 45 67'}
                </p>
              </div>
              <div className="py-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <p className="font-semibold text-gray-700 dark:text-slate-300">{t('contact.info.email')}</p>
                </div>
                <p className="md:col-span-2 text-gray-900 dark:text-white">
                  {config?.company?.email || 'berke@berkepalaz.com'}
                </p>
              </div>
              <div className="py-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <p className="font-semibold text-gray-700 dark:text-slate-300">{t('contact.info.address')}</p>
                </div>
                <p className="md:col-span-2 text-gray-900 dark:text-white">
                  {config?.company?.address?.[locale]?.full || 'Örnek Mahallesi, Emlak Caddesi No:12, 34710 Kadıköy, İstanbul'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
