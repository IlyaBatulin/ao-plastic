"use client"

import type { ReactNode } from "react"
import { CategoryHero } from "@/app/products/_components/category-hero"
import { useLanguage } from "@/contexts/language-context"
import { getCatalogSubcategoryTranslationKey } from "@/lib/catalog-translations"

type SubcategoryPageShellProps = {
  subcategorySlug: string
  fallbackTitle: string
  fallbackDescription?: string | null
  backHref: string
  hasVideo: boolean
  videoSrc?: string
  imageSrc?: string | null
  /** Не показывать описание в hero (например, подкатегория «на заказ») */
  skipDescription?: boolean
  children: ReactNode
}

export function SubcategoryPageShell({
  subcategorySlug,
  fallbackTitle,
  fallbackDescription,
  backHref,
  hasVideo,
  videoSrc,
  imageSrc,
  skipDescription,
  children,
}: SubcategoryPageShellProps) {
  const { t } = useLanguage()
  const i18nKey = getCatalogSubcategoryTranslationKey(subcategorySlug)
  const title = t(`homePage.catalog.subcategories.${i18nKey}`) || fallbackTitle
  const fromLocale = t(`homePage.catalog.subcategoryDescriptions.${i18nKey}`)
  const description =
    skipDescription ? undefined : (fromLocale || fallbackDescription || undefined)
  const backLabel = t("homePage.catalog.backToCategory") || "Назад к категории"

  return (
    <>
      <CategoryHero
        title={title}
        description={description}
        backHref={backHref}
        backLabel={backLabel}
        hasVideo={hasVideo}
        videoSrc={videoSrc}
        imageSrc={imageSrc ?? undefined}
      />
      {children}
    </>
  )
}
