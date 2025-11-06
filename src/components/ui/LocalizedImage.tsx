"use client";

import Image, { ImageProps } from "next/image";
import { useLocalizedImage } from "@/hooks/locale-utils";
import { useTranslations } from "next-intl";

type LocalizedImageProps = {
  srcName: string;
  altName: string;
} & Omit<ImageProps, "src" | "alt">;

export default function LocalizedImage({ srcName, altName, ...props }: LocalizedImageProps) {
  const t = useTranslations();
  return (
    <Image
      {...props}
      src={useLocalizedImage(srcName)}
      alt={t(altName)}
    />
  );
}