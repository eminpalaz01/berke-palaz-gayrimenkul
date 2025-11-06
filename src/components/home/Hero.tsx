"use client"

import { HeroDesktop } from "./HeroDesktop"
import { HeroMobile } from "./HeroMobile"

export function Hero() {
  return (
    <section className="">
      {/* Desktop Layout - Hidden on mobile */}
      <div className="hidden md:block relative w-full overflow-hidden bg-white dark:bg-slate-900 pt-20 md:pt-16 lg:pt-20">
        <HeroDesktop />
      </div>

      {/* Mobile Layout - Hidden on desktop */}
      <div className="block md:hidden relative w-full overflow-hidden bg-white dark:bg-slate-900 pt-16">
        <HeroMobile />
      </div>
    </section>
  )
}
