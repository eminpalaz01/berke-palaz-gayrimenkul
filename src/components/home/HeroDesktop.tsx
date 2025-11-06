"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export function HeroDesktop() {
  return (
    <div className="relative h-[600px] lg:h-[700px]">
      {/* Blue Background with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#001B5E] via-[#002266] to-[#001B5E]" />
      
      {/* Content Container */}
      <div className="relative h-full w-full px-6 lg:px-12">
        <div className="flex h-full">
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center w-[52%] text-white z-20 pl-8 xl:pl-20"
          >
            {/* Logo */}
            <div className="mb-8">
              <div className="flex flex-col items-start gap-2">
                <Image
                  src="/images/logo-beyaz.png"
                  alt="Coldwell Banker Eagle"
                  width={80}
                  height={80}
                  className="object-contain"
                  priority
                />
                <div className="text-white">
                  <div className="text-sm font-bold tracking-wider leading-tight">COLDWELL</div>
                  <div className="text-sm font-bold tracking-wider leading-tight">BANKER</div>
                  <div className="text-xs font-semibold tracking-widest leading-tight mt-0.5">EAGLE</div>
                </div>
              </div>
            </div>
            
            {/* Name */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight"
              style={{
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                letterSpacing: '0.02em'
              }}
            >
              BERKE PALAZ
            </motion.h1>
            
            {/* Taglines */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-2 mb-8"
            >
              <div className="inline-block bg-white/5 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10">
               <p className="italic text-2xl lg:text-3xl font-bold leading-relaxed">Doğru Gayrimenkul</p>
               <p className="italic text-2xl lg:text-3xl font-bold leading-relaxed">Doğru Rehberle Bulunur</p>
              </div>
            </motion.div>
            
            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-base lg:text-lg font-light max-w-md leading-relaxed opacity-95"
            >
              Satış, kiralama ve yatırım süreçlerinde güvenilir danışmanlık
            </motion.p>
          </motion.div>
          
          {/* Right Image */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="absolute right-0 top-0 w-[48%] h-full z-10"
          >
            <div className="relative w-full h-full">
              <Image
                src="/images/hero-image.jpg"
                alt="Berke Palaz - Gayrimenkul Danışmanı"
                fill
                className="object-cover"
                style={{ objectPosition: '40% 50%' }}
                priority
                sizes="60vw"
                quality={90}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
