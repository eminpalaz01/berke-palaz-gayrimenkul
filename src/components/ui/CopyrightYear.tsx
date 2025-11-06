"use client"

import { useState, useEffect } from "react"

export function CopyrightYear() {
  const [year, setYear] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setYear(new Date().getFullYear())
  }, [])

  // Server-side rendering sırasında hiçbir şey render etme
  if (!mounted) {
    return <span>2025</span>
  }

  return <span>{year}</span>
}
