"use client"

import type { ReactNode } from "react"
import { LanguageProvider } from "@/contexts/language-context"
import { CartProvider } from "@/contexts/cart-context"
import { CookieConsentBanner } from "@/components/cookie-consent-banner"
import type { Language } from "@/lib/language"

interface AppProvidersProps {
  children: ReactNode
  initialLang: Language
}

export function AppProviders({ children, initialLang }: AppProvidersProps) {
  return (
    <LanguageProvider initialLang={initialLang}>
      <CartProvider>
        {children}
        <CookieConsentBanner />
      </CartProvider>
    </LanguageProvider>
  )
}
