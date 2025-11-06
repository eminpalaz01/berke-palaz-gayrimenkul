import { motion } from "framer-motion";

type SectionHeaderProps = {
  title: string;
  subtitle: string;
  className?: string;
};

export function SectionHeader({ title, subtitle, className = '' }: SectionHeaderProps) {
  return (
    <div className={`text-center mb-16 ${className}`}>
      <h2 className="responsive-heading-lg font-heading font-bold text-brand-concrete-900 dark:text-white mb-6">
        {title}
      </h2>
      <p className="responsive-text-xl text-brand-concrete-600 dark:text-gray-300 max-w-3xl mx-auto">
        {subtitle}
      </p>
    </div>
  );
}
