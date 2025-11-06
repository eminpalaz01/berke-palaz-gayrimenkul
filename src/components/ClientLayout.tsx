"use client"

import * as React from "react"
import { LegalConsent, useConsent } from '@/components/ui/LegalConsent'
import { DataManagement, useDataManagement } from '@/components/ui/DataManagement'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import { usePageView } from '@/hooks/usePageView'

interface ClientLayoutProps {
  children: React.ReactNode
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const { showConsent, handleConsentAccept, setShowConsent } = useConsent()
  const { showDataManagement, openDataManagement, closeDataManagement } = useDataManagement()
  
  // Track page views
  usePageView()

  React.useEffect(() => {
    console.log('ClientLayout mounted!')
    console.log('WhatsAppButton component:', WhatsAppButton)
  }, [])

  React.useEffect(() => {
    const handleOpenDataManagement = () => {
      openDataManagement()
    }

    window.addEventListener('openDataManagement', handleOpenDataManagement)
    
    return () => {
      window.removeEventListener('openDataManagement', handleOpenDataManagement)
    }
  }, [openDataManagement])

  return (
    <>
      {children}
      <WhatsAppButton />
      <LegalConsent
        isOpen={showConsent}
        onClose={() => setShowConsent(false)}
        onAccept={handleConsentAccept}
        type="banner"
      />
      <DataManagement
        isOpen={showDataManagement}
        onClose={closeDataManagement}
      />
    </>
  )
}
