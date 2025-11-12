"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useRuntimeConfig } from "@/utils/runtime-config"
import { useParams } from "next/navigation"

export function HeroMobile() {
  const { config } = useRuntimeConfig()
  const params = useParams()
  const locale = params.locale as string || 'tr'
  return (
    <div className="relative h-screen flex flex-col overflow-hidden min-h-screen max-h-screen">
      {/* Image Section - Enhanced with overlay */}
      <motion.div 
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full h-[46%] bg-white dark:bg-slate-900"
      >
        <div className="relative w-full h-full">
          <Image
            src="/images/hero-image.jpg"
            alt="Berke Palaz - Gayrimenkul Danışmanı"
            fill
            className="object-cover"
            style={{ objectPosition: '50% 60%' }}
            priority
            sizes="100vw"
            quality={90}
          />
          {/* Gradient overlay for smooth transition */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#001B5E]/20" />
          
          {/* Decorative corner accent */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/10 to-transparent" />
        </div>
      </motion.div>
      
      {/* Content Section - Enhanced design */}
      <div className="relative bg-gradient-to-br from-[#001B5E] via-[#002266] to-[#001947] text-white h-[46%] flex items-center overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-300 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        </div>

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />
        
        <div className="relative px-6 w-full flex flex-col justify-center py-8">
          {/* Logo and Name Section - Side by side layout */}
          <div className="flex items-start gap-6 mb-6">
            {/* Logo Section */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex-shrink-0"
            >
              <div className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/5 backdrop-blur-sm">
                <div className="relative w-16 h-16">
                  <Image
                    src="/images/logo-beyaz.png"
                    alt={config?.company?.officeName?.[locale] || "Coldwell Banker Eagle"}
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                  />
                </div>
                <div className="text-white text-center">
                  <div className="text-[10px] font-bold tracking-wider leading-tight">COLDWELL</div>
                  <div className="text-[10px] font-bold tracking-wider leading-tight">BANKER</div>
                  <div className="text-[8px] font-semibold tracking-widest leading-tight opacity-90">EAGLE</div>
                </div>
              </div>
            </motion.div>

            {/* Name Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex-1 pt-1"
            >
              <h1 
                className="text-[2.75rem] leading-[1.05] font-bold tracking-tight mb-2 text-white"
                style={{
                  textShadow: '0 4px 16px rgba(0,0,0,0.4), 0 2px 6px rgba(0,0,0,0.3)'
                }}
              >
                BERKE<br />PALAZ
              </h1>
              <div className="h-1 w-24 bg-gradient-to-r from-blue-400 via-blue-300 to-transparent rounded-full" />
            </motion.div>
          </div>
          
          {/* Taglines Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-4"
          >
            <div className="inline-block bg-white/5 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10">
              <p className="italic text-lg font-semibold leading-snug text-white tracking-wide mb-1">
                Doğru Gayrimenkul
              </p>
              <p className="italic text-lg font-semibold leading-snug text-white tracking-wide">
                Doğru Rehberle Bulunur
              </p>
            </div>
          </motion.div>
          
          {/* Description Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <p className="text-sm font-light leading-relaxed text-white/85 max-w-[85%]">
              Satış, kiralama ve yatırım süreçlerinde güvenilir danışmanlık
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
