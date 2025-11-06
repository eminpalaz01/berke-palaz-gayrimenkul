"use client"

import Image from "next/image";
import { cn } from "@/hooks/utils";
import type { ComponentProps } from "react";

/**
 * Farklı en-boy oranlarına sahip alanlar için resim kaynaklarını tanımlar.
 * Bileşen, CSS medya sorguları aracılığıyla en uygun resmi seçer.
 * @property {string} mobile - Dikey alanlar için resim (mobil).
 * @property {string} [tablet] - Kareye yakın alanlar için resim (tablet).
 * @property {string} desktop - Yatay alanlar için resim (desktop).
 */
interface ImageSources {
  mobile: string;
  tablet?: string;
  desktop: string;
}

type NextImageProps = ComponentProps<typeof Image>;

interface ResponsiveImageProps extends Omit<NextImageProps, "src" | "alt"> {
  src: ImageSources;
  alt: string;
  containerClassName?: string;
  aspectRatio?: string;
}

export function ResponsiveImage({
  src,
  alt,
  className,
  containerClassName,
  aspectRatio,
  ...props
}: ResponsiveImageProps) {
  const containerClasses = cn(
    "relative",
    { "w-full h-full": !aspectRatio },
    containerClassName
  );
  const imageClasses = cn(className);
  const containerStyle = aspectRatio ? { aspectRatio } : {};

  // Tablet görüntüsü varsa 3'lü, yoksa 2'li yapıyı kullan
  const hasTabletImage = src.tablet && src.tablet !== src.mobile && src.tablet !== src.desktop;

  return (
    <div className={containerClasses} style={containerStyle}>
      {hasTabletImage ? (
        <>
          {/* Mobile Image */}
          <Image
            src={src.mobile}
            alt={alt}
            className={cn(imageClasses, "block md:hidden")}
            {...props}
          />
          {/* Tablet Image */}
          <Image
            src={src.tablet!}
            alt={alt}
            className={cn(imageClasses, "hidden md:block lg:hidden")}
            {...props}
          />
          {/* Desktop Image */}
          <Image
            src={src.desktop}
            alt={alt}
            className={cn(imageClasses, "hidden lg:block")}
            {...props}
          />
        </>
      ) : (
        <>
          {/* Mobile Image */}
          <Image
            src={src.mobile}
            alt={alt}
            className={cn(imageClasses, "block lg:hidden")}
            {...props}
          />
          {/* Desktop Image */}
          <Image
            src={src.desktop}
            alt={alt}
            className={cn(imageClasses, "hidden lg:block")}
            {...props}
          />
        </>
      )}
    </div>
  );
}
