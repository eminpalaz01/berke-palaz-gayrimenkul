"use client"

import { useState } from "react"
import { useTranslation } from "@/hooks/useTranslation"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { User } from "lucide-react"
import { useRuntimeConfig } from "@/utils/runtime-config"
import { useParams } from "next/navigation"
import Image from "next/image"

export function ContactPage() {
  const { t } = useTranslation()
  const { config } = useRuntimeConfig()
  const params = useParams()
  const locale = params.locale as string || 'tr'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: ''
    })
    setIsSubmitting(false)
    
    // Show success message (you can implement toast notification here)
    alert(t('contact.form.success'))
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 pt-20">
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Left Column - Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-6"
            >
              <div className="flex flex-col gap-3">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white tracking-tight">
                  {t('contact.title')}
                </h1>
                <p className="text-gray-500 dark:text-slate-400 text-lg">
                  {t('contact.description')}
                </p>
              </div>

              <div className="flex flex-col gap-8 mt-6">
                {/* Consultant Info */}
                <div className="flex flex-col gap-4 border-b border-gray-200 dark:border-slate-700 pb-8">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Danışman Bilgileri
                  </h3>
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shrink-0 w-12 h-12">
                      <User className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-gray-800 dark:text-white text-lg font-semibold">Berke Palaz</p>
                      <a 
                        className="text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" 
                        href={`tel:${config?.company?.phone || '+905554443322'}`}
                      >
                        {config?.company?.phone || '+90 555 444 33 22'}
                      </a>
                      <br/>
                      <a 
                        className="text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" 
                        href={`mailto:${config?.company?.email || 'berke@berkepalaz.com'}`}
                      >
                        {config?.company?.email || 'berke@berkepalaz.com'}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Office Info */}
                <div className="flex flex-col gap-4">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {t('contact.officeInfo')}
                  </h3>
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center shrink-0 w-12 h-12">
                      <div className="w-10 h-10 bg-blue-600 dark:bg-blue-700 rounded-lg flex items-center justify-center">
                        <Image
                          src="/images/logo-beyaz.png"
                          alt="Logo"
                          width={24}
                          height={24}
                          className="w-6 h-6 object-contain"
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-800 dark:text-white text-lg font-semibold">
                        {config?.company?.officeName?.[locale] || 'Berke Palaz Gayrimenkul'}
                      </p>
                      <p className="text-gray-500 dark:text-slate-400">
                        {config?.company?.address?.[locale]?.full || 'Örnek Mahallesi, Emlak Caddesi No:12, 34710 Kadıköy, İstanbul'}
                      </p>
                      <a 
                        className="text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" 
                        href={`tel:${config?.company?.officePhone || '+905551234567'}`}
                      >
                        {config?.company?.officePhone || '+90 555 123 45 67'}
                      </a>
                      <br/>
                      <a 
                        className="text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" 
                        href={`mailto:${config?.company?.officeEmail || 'info@berkepalaz.com'}`}
                      >
                        {config?.company?.officeEmail || 'info@berkepalaz.com'}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gray-50 dark:bg-slate-800 p-8 rounded-lg shadow-md"
            >
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-700 dark:text-slate-300 font-medium" htmlFor="name">
                    {t('contact.form.name')}
                  </label>
                  <input
                    className="w-full rounded-md border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-blue-600 focus:border-blue-600 transition placeholder:text-gray-400 dark:placeholder:text-slate-500 py-3 px-4 border"
                    id="name"
                    name="name"
                    placeholder={t('contact.form.namePlaceholder')}
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-700 dark:text-slate-300 font-medium" htmlFor="email">
                    {t('contact.form.email')}
                  </label>
                  <input
                    className="w-full rounded-md border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-blue-600 focus:border-blue-600 transition placeholder:text-gray-400 dark:placeholder:text-slate-500 py-3 px-4 border"
                    id="email"
                    name="email"
                    type="email"
                    placeholder={t('contact.form.emailPlaceholder')}
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-700 dark:text-slate-300 font-medium" htmlFor="phone">
                    {t('contact.form.phone')}
                  </label>
                  <input
                    className="w-full rounded-md border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-blue-600 focus:border-blue-600 transition placeholder:text-gray-400 dark:placeholder:text-slate-500 py-3 px-4 border"
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder={t('contact.form.phonePlaceholder')}
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-700 dark:text-slate-300 font-medium" htmlFor="message">
                    {t('contact.form.message')}
                  </label>
                  <textarea
                    className="w-full rounded-md border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-blue-600 focus:border-blue-600 transition min-h-[120px] placeholder:text-gray-400 dark:placeholder:text-slate-500 py-3 px-4 border resize-none"
                    id="message"
                    name="message"
                    placeholder={t('contact.form.messagePlaceholder')}
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 font-bold shadow-sm transition-colors"
                >
                  {isSubmitting ? t('contact.form.sending') : t('contact.form.submit')}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
