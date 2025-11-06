"use client";

import { motion } from "framer-motion";
import { useTranslations } from 'next-intl';
import { 
  Building,
  CheckCircle,
  Star,
  Truck
} from "lucide-react";
import LocalizedImage from "@/components/ui/LocalizedImage";
import { AnimatedSectionHeader } from "@/components/ui/AnimatedSectionHeader";

export function WhyChooseUsSection() {
  const t = useTranslations('whyChooseUs');

  const features = [
    {
      icon: Star,
      titleKey: 'expertTeam.title',
      descriptionKey: 'expertTeam.description'
    },
    {
      icon: CheckCircle,
      titleKey: 'perfectProjects.title',
      descriptionKey: 'perfectProjects.description'
    },
    {
      icon: Truck,
      titleKey: 'vehicleFleet.title',
      descriptionKey: 'vehicleFleet.description'
    },
    {
      icon: Building,
      titleKey: 'solidStructures.title',
      descriptionKey: 'solidStructures.description'
    }
  ];

  return (
    <section className="py-20 bg-white dark:bg-brand-concrete-800">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <AnimatedSectionHeader 
              title={t('title')} 
              subtitle={t('subtitle')}
              className="text-left mb-8"
            />

            <div className="space-y-6">
              {features.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-4"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="responsive-text-xl font-heading font-semibold text-gray-900 dark:text-white mb-2">
                      {t(item.titleKey)}
                    </h3>
                    <p className="responsive-text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                      {t(item.descriptionKey)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative w-full md:w-9/12 lg:9/12 mx-auto aspect-[3/4] md:aspect-square lg:aspect-auto lg:h-[500px] rounded-2xl shadow-2xl overflow-hidden"
          >
            <LocalizedImage
              srcName="reklam-hizmet"
              altName="whyChooseUs.title"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
