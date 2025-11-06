'use client';

import { generateClientJsonLd, JsonLdType } from "@/utils/client-jsonld";
import { useRuntimeConfig } from "@/utils/runtime-config";

interface JsonLdProps {
  types: JsonLdType[];
  locale: string;
}

export function JsonLdComponent({ types, locale }: Readonly<JsonLdProps>) {
  const { config, loading, error } = useRuntimeConfig();

  // Don't render anything while loading or if there's an error
  if (loading || error || !config) {
    return null;
  }

  const jsonsLd = generateClientJsonLd(locale, types, config);
  // console.debug(JSON.stringify(jsonsLd, null, 2)) // Debugging line
  // Eğer types bir array ise, her biri için ayrı script oluştur
  return (
    <section>
      {jsonsLd.map((jsonLd, index) => {
        const jsonType = Array.isArray(jsonLd['@type'])
          ? jsonLd['@type'].join('-')   // Eğer @type array ise birleştir
          : jsonLd['@type'] || `unknown-${index}`; // Yoksa fallback

        return (
          <script
            key={`ld-json-${jsonType}`}
            id={`ld-json-${jsonType}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
            }}
          />
        );
      })}
    </section>
  );
}
