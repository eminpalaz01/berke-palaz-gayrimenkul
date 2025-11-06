"use client";

import { motion } from "framer-motion";
import { useTranslations } from 'next-intl';
import { Button } from "@/components/ui/button";
import { Link } from "@/navigation";
import { ArrowRight } from "lucide-react";
import { AnimatedSectionHeader } from "@/components/ui/AnimatedSectionHeader";

export function CtaSection() {
  const t = useTranslations('cta');

  return (
    <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
      <div className="container-custom text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <AnimatedSectionHeader 
            title={t('title')} 
            subtitle={t('subtitle')}
            className="text-white"
          />
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button 
              asChild 
              size="lg" 
              className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 responsive-text-lg font-semibold shadow-lg"
            >
              <Link href="/iletisim">
                {t('getQuote')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button 
              asChild 
              size="lg" 
              variant="outline"
              className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white px-8 py-4 responsive-text-lg font-semibold"
            >
              <Link href="tel:+905466991701" className="text-white hover:text-white">
                {t('callNow')}
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
