"use client"

import type { ReactNode } from "react"
import { CategoryHero } from "@/app/products/_components/category-hero"
import { useLanguage } from "@/contexts/language-context"
import {
  getCatalogSubcategoryDescription,
  getCatalogSubcategoryLabel,
} from "@/lib/catalog-translations"

type SubcategoryPageShellProps = {
  subcategorySlug: string
  subcategoryId?: string
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
  subcategoryId,
  fallbackTitle,
  fallbackDescription,
  backHref,
  hasVideo,
  videoSrc,
  imageSrc,
  skipDescription,
  children,
}: SubcategoryPageShellProps) {
  const { t, lang } = useLanguage()
  const locale = lang === "en" ? "en" : "ru"
  const resolvedId = subcategoryId ?? subcategorySlug
  const title = getCatalogSubcategoryLabel(
    resolvedId,
    subcategorySlug,
    fallbackTitle,
    locale
  )
  const description = skipDescription
    ? undefined
    : getCatalogSubcategoryDescription(
        resolvedId,
        subcategorySlug,
        fallbackDescription,
        locale
      )
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
