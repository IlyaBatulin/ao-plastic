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
import { LoadingScreen } from "@/components/loading-screen"

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "АО «Пластик» — Производство пластиковых изделий",
  description:
    "Лидер химической индустрии по производству АБС-пластиков и полистиролов. Современные технологии, контроль качества, экологичные материалы.",
  keywords: "пластик, АБС-пластик, полистирол, производство пластика, пластиковые изделия",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
        <LoadingScreen />
        <div id="main-content" className="opacity-0 animate-fade-in">
          <LanguageProvider>
            <CartProvider>
              <ConditionalHeader />
              {children}
            </CartProvider>
          </LanguageProvider>
          <Toaster />
        </div>
      </body>
    </html>
  )
}
