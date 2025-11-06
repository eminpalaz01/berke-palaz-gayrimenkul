"use client";

import { motion } from "framer-motion";
import { useTranslations } from 'next-intl';
import { stats } from "@/lib/data";
import { 
  Calendar,
  Users,
  Building,
  Building2,
  Factory,
  Pickaxe,
  Zap,
  Truck
} from "lucide-react";
import { AnimatedSectionHeader } from "@/components/ui/AnimatedSectionHeader";

const iconMap = {
  Calendar,
  Users,
  Building,
  Building2,
  Factory,
  Pickaxe,
  Zap,
  Truck
};

export function StatsSection() {
  const t = useTranslations('stats');

  return (
    <section className="py-20 bg-brand-concrete-50 dark:bg-brand-concrete-900 text-black dark:text-white">
      <div className="container-custom">
        <AnimatedSectionHeader 
          title={t('title')} 
          subtitle={t('subtitle')} 
        />

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-6 lg:gap-8">
          {stats.map((stat, index) => {
            const IconComponent = iconMap[stat.icon as keyof typeof iconMap];
            
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="h-10 w-10 text-white" />
                </div>
                
                <div className="responsive-heading-md font-bold text-orange-400 mb-2">
                  {stat.value}
                </div>
                
                <div className="responsive-text-base text-brand-concrete-600 dark:text-gray-300 font-medium">
                  {t(stat.labelKey)}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
