"use client"

import { Hero } from "./Hero"
import { FeaturedListings } from "./FeaturedListings"
import { AboutSection } from "./AboutSection"
import { ContactSection } from "./ContactSection"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturedListings />
      <AboutSection />
      <ContactSection />
    </div>
  )
}
