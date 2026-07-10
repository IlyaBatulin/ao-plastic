import type React from "react"
import type { Metadata, Viewport } from "next"
import { cookies } from "next/headers"
import { Manrope } from "next/font/google"
import "./globals.css"
import { AppProviders } from "@/components/app-providers"
import { ConditionalHeader } from "@/components/conditional-header"
import { Toaster } from "@/components/ui/toaster"
import { LoadingScreen } from "@/components/loading-screen"
import { LenisProvider } from "@/components/lenis-provider"
import { getSiteUrl } from "@/lib/site"
import { parseLanguage } from "@/lib/language"
import { SiteJsonLd } from "@/components/seo/site-json-ld"
import { BackgroundPaths } from "@/components/ui/background-paths"

// Единый фирменный шрифт сайта. Самохостится через next/font —
// без render-blocking запросов к Google Fonts.
const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-manrope",
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
    icon: [
      { url: "/images/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/images/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
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
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Завод АО «Пластик» в Узловой",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "АО «Пластик»",
    description:
      "Производство АБС-пластиков, полистирола и пластиковых изделий. Завод в Тульской области.",
    images: ["/images/og-image.jpg"],
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
  // Переводы активного языка отдаём с сервера — текст попадает в HTML
  // при SSR (SEO + LCP). Второй язык догружается на клиенте при переключении.
  const initialTranslations = (
    initialLang === "en"
      ? (await import("@/public/locales/en.json")).default
      : (await import("@/public/locales/ru.json")).default
  ) as Record<string, unknown>

  return (
    <html
      lang={initialLang}
      className={`${manrope.variable} ${manrope.className} bg-background text-foreground`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preload" href="/images/logo123.jpg" as="image" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{
              var p=location.pathname;
              if(p!=='/'&&p!=='')return;
              var dev=location.hostname==='localhost'||location.hostname==='127.0.0.1';
              if(!dev&&sessionStorage.getItem('hasSeenLoading'))return;
              if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
              document.documentElement.classList.add('splash-pending');
              document.body.style.overflow='hidden';
            }catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen overflow-x-clip bg-background text-foreground antialiased">
        <div
          id="splash-static"
          aria-hidden
          className="fixed inset-0 z-[9998] items-center justify-center bg-white p-4 sm:p-8"
        >
          <img
            src="/images/logo123.jpg"
            alt=""
            className="w-full max-w-xs animate-pulse select-none sm:max-w-md md:max-w-2xl"
            draggable={false}
          />
        </div>
        <AppProviders initialLang={initialLang} initialTranslations={initialTranslations}>
          {/* Синие линии — фирменный фон на всех страницах (portal в body, z-0) */}
          <BackgroundPaths />
          <SiteJsonLd />
          <LoadingScreen />
          <LenisProvider>
            <div id="main-content" className="relative z-10 w-full max-w-full overflow-x-clip transition-opacity duration-500">
              <ConditionalHeader />
              {children}
              <Toaster />
            </div>
          </LenisProvider>
        </AppProviders>
      </body>
    </html>
  )
}
