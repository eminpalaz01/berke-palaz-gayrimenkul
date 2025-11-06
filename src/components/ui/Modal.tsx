"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { ReactNode, useEffect } from "react"
import { useTranslations } from 'next-intl'

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl";
  closeButtonLabel?: string;
}

export function Modal({ 
  isOpen, 
  onClose, 
  children, 
  maxWidth = "4xl",
  closeButtonLabel
}: ModalProps) {
  const t = useTranslations()
  
  // Handle ESC key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])
  
  if (!isOpen) return null
  
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    "6xl": "max-w-6xl",
    "7xl": "max-w-7xl",
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 50 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`bg-white dark:bg-brand-concrete-800 rounded-2xl shadow-2xl w-full ${maxWidthClasses[maxWidth]} max-h-[95vh] sm:max-h-[90vh] overflow-y-auto relative mx-2 sm:mx-4`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 bg-white dark:bg-brand-concrete-700 rounded-full flex items-center justify-center text-brand-concrete-800 dark:text-white hover:bg-gray-100 dark:hover:bg-brand-concrete-600 transition-colors z-10"
            aria-label={closeButtonLabel || t('common.close')}
          >
            <X className="h-4 w-4 sm:h-6 sm:w-6" />
          </button>

          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
