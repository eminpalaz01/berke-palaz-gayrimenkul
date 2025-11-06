"use client";

import * as React from "react";
import { motion } from "framer-motion";

type AnimatedSectionHeaderProps = {
  title: string;
  subtitle: string;
  className?: string;
};

export function AnimatedSectionHeader({ title, subtitle, className = '' }: AnimatedSectionHeaderProps) {
  const [isClient, setIsClient] = React.useState(false);

  // Client-side hydration için
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // F5 sonrası tablet görünümünde animasyon bozukluğunu önlemek için
  const shouldAnimate = isClient && typeof window !== 'undefined';

  return (
    <motion.div
      initial={false} // F5 sonrası flash'ı önlemek için initial false
      animate={{ opacity: 1, y: 0 }} // Her zaman görünür
      whileInView={shouldAnimate ? { 
        opacity: 1, 
        y: 0,
        scale: [0.98, 1] // Hafif scale animasyonu
      } : undefined}
      transition={shouldAnimate ? { 
        duration: 0.5,
        ease: "easeOut"
      } : { duration: 0 }}
      viewport={shouldAnimate ? { 
        once: true,
        margin: "-30px 0px",
        amount: 0.2
      } : undefined}
      className={`text-center mb-16 ${className}`}
    >
      <h2 className="responsive-heading-lg font-heading font-bold mb-6">
        {title}
      </h2>
      <p className="responsive-text-xl max-w-3xl mx-auto">
        {subtitle}
      </p>
    </motion.div>
  );
}
