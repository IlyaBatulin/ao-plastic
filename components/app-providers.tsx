"use client"

import type { ReactNode } from "react"
import { MotionConfig } from "framer-motion"
import { LanguageProvider } from "@/contexts/language-context"
import { CartProvider } from "@/contexts/cart-context"
import { CookieConsentBanner } from "@/components/cookie-consent-banner"
import type { Language } from "@/lib/language"

interface AppProvidersProps {
  children: ReactNode
  initialLang: Language
  initialTranslations?: Record<string, any>
}

export function AppProviders({ children, initialLang, initialTranslations }: AppProvidersProps) {
  return (
    <MotionConfig reducedMotion="user">
      <LanguageProvider initialLang={initialLang} initialTranslations={initialTranslations}>
        <CartProvider>
          {children}
          <CookieConsentBanner />
        </CartProvider>
      </LanguageProvider>
    </MotionConfig>
  )
}
