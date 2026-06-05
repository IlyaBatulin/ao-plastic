import type React from "react"
import type { Metadata, Viewport } from "next"
import { cookies } from "next/headers"
import { Inter } from "next/font/google"
import "./globals.css"
import "./logo-loop.css"
import { LanguageProvider } from "@/contexts/language-context"
import { CartProvider } from "@/contexts/cart-context"
import { ConditionalHeader } from "@/components/conditional-header"
import { Toaster } from "@/components/ui/toaster"
import { LoadingScreen } from "@/components/loading-screen"
import { LenisProvider } from "@/components/lenis-provider"
import { GsapInit } from "@/components/gsap-init"
import { getSiteUrl } from "@/lib/site"
import { parseLanguage } from "@/lib/language"
import { SiteJsonLd } from "@/components/seo/site-json-ld"

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
})

const siteUrl = getSiteUrl()

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "АО «Пластик» — АБС-пластики, полистирол, пластиковые изделия",
    template: "%s | АО «Пластик»",
  },
  description:
    "АО «Пластик» (Узловая): производство АБС-пластиков, вспенивающегося и экструзионного полистирола, стирола, деталей для машиностроения и товаров народного потребления. Поставки по России и на экспорт.",
  keywords: [
    "АО Пластик",
    "АБС-пластик",
    "полистирол ПСВ",
    "стирол",
    "производство пластика",
    "Узловая",
    "полимеры",
  ],
  icons: {
    icon: [{ url: "/images/logo123.png", type: "image/svg+xml" }],
    apple: [{ url: "/images/logo123.png", type: "image/svg+xml" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: siteUrl,
    siteName: "АО «Пластик»",
    title: "АО «Пластик» — АБС-пластики, полистирол и изделия из пластмасс",
    description:
      "Производитель полимеров и пластиковых изделий с 1959 года: АБС, полистирол, стирол, автокомпоненты, товары для дома.",
    images: [
      {
        url: "/images/logo123.png",
        width: 512,
        height: 512,
        alt: "Логотип АО «Пластик»",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "АО «Пластик»",
    description:
      "Производство АБС-пластиков, полистирола и пластиковых изделий. Завод в Тульской области.",
    images: ["/images/logo123.png"],
  },
  ...((process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
    process.env.NEXT_PUBLIC_YANDEX_SITE_VERIFICATION)
    ? {
        verification: {
          ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
            ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
            : {}),
          ...(process.env.NEXT_PUBLIC_YANDEX_SITE_VERIFICATION
            ? { yandex: process.env.NEXT_PUBLIC_YANDEX_SITE_VERIFICATION }
            : {}),
        },
      }
    : {}),
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const initialLang = parseLanguage(cookieStore.get("lang")?.value)

  return (
    <html lang={initialLang} className={`${inter.className} bg-background text-foreground`}>
      <head>
        <link rel="preload" href="/locales/ru.json" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/locales/en.json" as="fetch" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen overflow-x-clip bg-background text-foreground antialiased">
        <GsapInit />
        <SiteJsonLd />
        <LoadingScreen />
        <LenisProvider>
          <div id="main-content" className="relative z-10 w-full max-w-full overflow-x-clip transition-opacity duration-500">
            <LanguageProvider initialLang={initialLang}>
              <CartProvider>
                <ConditionalHeader />
                {children}
              </CartProvider>
            </LanguageProvider>
            <Toaster />
          </div>
        </LenisProvider>
      </body>
    </html>
  )
}
