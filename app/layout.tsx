import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import "./logo-loop.css"
import Script from "next/script"
import { LanguageProvider } from "@/contexts/language-context"
import { CartProvider } from "@/contexts/cart-context"
import { ConditionalHeader } from "@/components/conditional-header"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "АО «Пластик» — Производство пластиковых изделий",
  description:
    "Лидер химической индустрии по производству АБС-пластиков и полистиролов. Современные технологии, контроль качества, экологичные материалы.",
  keywords: "пластик, АБС-пластик, полистирол, производство пластика, пластиковые изделия",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={`${inter.className} overflow-x-hidden`}>
      <head>
        <link rel="preload" href="/locales/ru.json" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/locales/en.json" as="fetch" crossOrigin="anonymous" />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" />
      </head>
      <body className="antialiased overflow-x-hidden">
        <LanguageProvider>
          <CartProvider>
            <ConditionalHeader />
            {children}
          </CartProvider>
        </LanguageProvider>
        <Toaster />
      </body>
    </html>
  )
}
