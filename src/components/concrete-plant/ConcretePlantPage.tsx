"use client"

import Image from "next/image"
import { useConcretePlantTranslation } from "@/hooks/useTranslation"
import { Link } from "@/navigation"
import { SectionHeader } from "@/components/ui/SectionHeader"
import { cn } from "@/hooks/utils"
import { useRuntimeConfig } from "@/utils/runtime-config"

interface ConcretePlant {
  id: string;
  name: string;
  location: string;
  mapLink: string;
  image: string;
}

export function ConcretePlantPage() {
  const { t } = useConcretePlantTranslation();
  const { config } = useRuntimeConfig();

  // Create dynamic concrete plants data using config with fallback URLs
  const concretePlants: ConcretePlant[] = [
    {
      id: "atatepe",
      name: "Atatepe",
      location: "Balıkesir",
      mapLink: config?.media?.concretePlants?.atatepe?.googleMapsUrl || "https://maps.app.goo.gl/Vcic8jRvtrpAg5Gz8?g_st=ipc",
      image: "/images/concrete-plants/atatepe-concrete-plant.png",
    },
    {
      id: "ucpinar",
      name: "Üçpınar",
      location: "Balıkesir",
      mapLink: config?.media?.concretePlants?.ucpinar?.googleMapsUrl || "https://maps.app.goo.gl/vLvP8jPnBu9PihSE8?g_st=ipc",
      image: "/images/concrete-plants/ucpinar-concrete-plant.png",
    },
    {
      id: "bursa-kayapa",
      name: "Bursa Kayapa",
      location: "Bursa",
      mapLink: config?.media?.concretePlants?.bursa?.googleMapsUrl || "https://maps.app.goo.gl/3QM5MTVpVaPFh4917",
      image: "/images/concrete-plants/bursa-concrete-plant.png",
    },
  ];

  return (
    <div className="py-20 lg:py-32  container-custom py-12">
      <SectionHeader
        title={t('title')}
        subtitle={t('subtitle')}
      />

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-12">
        {concretePlants.map((plant) => (
          <div key={plant.id} className="bg-white dark:bg-brand-concrete-800 rounded-lg shadow-lg overflow-hidden">
            <div className="relative h-80 w-full">
              <Image
                src={plant.image}
                alt={plant.name}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="p-6">
              <h3 className="responsive-text-xl font-semibold text-brand-primary dark:text-white mb-2">
                {plant.name} {t('childTitle')}
              </h3>
              <p className="text-muted-foreground dark:text-brand-concrete-300 mb-4">
                {plant.location}
              </p>
              <Link
                href={plant.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm",
                  "text-white bg-brand-secondary hover:bg-brand-secondary-dark",
                  "focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:ring-offset-2"
                )}
              >
                {t('viewOnMap')}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
