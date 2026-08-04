"use client"

import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft, ArrowUpRight, ChevronDown } from "lucide-react"
import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { getCatalogSubcategoryDescription, getCatalogSubcategoryLabel } from "@/lib/catalog-translations"
import { getProductPathSegment } from "@/lib/catalog-product"
import { resolveProductDisplay } from "@/lib/product-en"
import { cn } from "@/lib/utils"

export type AbsShowcaseProduct = {
  id: string
  slug?: string | null
  name: string
  description?: string | null
  brand?: string | null
  specifications?: Record<string, unknown> | string | null
}

export type AbsShowcaseGroup = {
  id: string
  slug: string
  name: string
  description?: string
  products: AbsShowcaseProduct[]
}

type AbsCatalogShowcaseProps = {
  title: string
  description?: string
  videoSrc?: string
  imageSrc?: string
  groups: AbsShowcaseGroup[]
  backLabel: string
}

const copy = {
  ru: {
    eyebrow: "Каталог АБС-пластиков",
    directions: "Три направления",
    directionsLead: "Выберите способ переработки, чтобы посмотреть доступные марки и решения.",
    products: "Продукция",
    details: "Подробнее",
  },
  en: {
    eyebrow: "ABS plastics catalog",
    directions: "Three product lines",
    directionsLead: "Choose a processing method to explore available grades and solutions.",
    products: "Products",
    details: "View details",
  },
} as const

export function AbsCatalogShowcase({
  title,
  description,
  videoSrc,
  imageSrc,
  groups,
  backLabel,
}: AbsCatalogShowcaseProps) {
  const { lang } = useLanguage()
  const locale = lang === "en" ? "en" : "ru"
  const labels = copy[locale]
  const [openGroup, setOpenGroup] = useState(groups[0]?.id ?? "")

  return (
    <section className="relative bg-[#f4f6f9] lg:grid lg:min-h-[100svh] lg:grid-cols-2">
      <div className="relative min-h-[70svh] overflow-hidden bg-[#07142f] lg:sticky lg:top-28 lg:h-[calc(100svh-7rem)] lg:min-h-0">
        {imageSrc && (
          <img src={imageSrc} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
        )}
        {videoSrc && (
          <video
            autoPlay
            loop
            muted
            playsInline
            controls={false}
            disablePictureInPicture
            disableRemotePlayback
            poster={imageSrc}
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        )}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,12,30,0.2)_0%,rgba(4,15,39,0.42)_45%,rgba(3,12,31,0.94)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06132d]/45 via-transparent to-transparent" />

        <div className="relative z-10 flex h-full min-h-[70svh] flex-col justify-between px-5 pb-10 pt-24 text-white sm:px-8 lg:min-h-0 lg:px-12 lg:pb-14 lg:pt-28 xl:px-16">
          <Link
            href="/products"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-black/25 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-black/40"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            {backLabel}
          </Link>

          <div className="max-w-2xl">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-white/65">
              {labels.eyebrow}
            </p>
            <h1 className="text-[clamp(3.1rem,6vw,6.8rem)] font-semibold leading-[0.92] tracking-[-0.045em] text-white">
              {title}
            </h1>
            {description && (
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/82 md:text-xl">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex min-h-[100svh] items-center px-4 py-16 sm:px-8 lg:px-10 lg:py-28 xl:px-16 2xl:px-20">
        <div className="mx-auto w-full max-w-3xl">
          <div className="relative mb-7 min-h-[240px] overflow-hidden rounded-[1.75rem] bg-[#0b1e45] shadow-[0_24px_70px_rgba(15,42,89,0.18)] md:mb-9 md:min-h-[290px]">
            {imageSrc && (
              <img
                src={imageSrc}
                alt=""
                aria-hidden
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 hover:scale-[1.03]"
              />
            )}
            <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(4,17,45,0.96)_0%,rgba(8,35,82,0.80)_52%,rgba(8,31,69,0.38)_100%)]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#06142f]/80 via-transparent to-white/5" />
            <div className="absolute right-6 top-5 text-[clamp(4rem,8vw,7rem)] font-semibold leading-none tracking-[-0.06em] text-white/[0.08] tabular-nums md:right-8 md:top-6">
              03
            </div>

            <div className="relative z-10 flex min-h-[240px] flex-col justify-end p-6 text-white md:min-h-[290px] md:p-9">
              <div className="mb-5 h-px w-16 bg-white/55" />
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/68">{labels.directions}</p>
              <p className="mt-4 max-w-xl text-lg font-medium leading-relaxed text-white/92 md:text-2xl md:leading-snug">
                {labels.directionsLead}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {groups.map((group, index) => {
              const isOpen = group.id === openGroup
              const groupName = getCatalogSubcategoryLabel(group.id, group.slug, group.name, locale)
              const groupDescription =
                getCatalogSubcategoryDescription(group.id, group.slug, group.description, locale) ?? ""
              const isDirectLink = group.id === "abs-custom" || group.slug === "abs-custom"
              const products = group.products

              if (isDirectLink) {
                return (
                  <Link
                    key={group.id}
                    href={`/products/abs/${group.slug}`}
                    className="group grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-5 text-left transition-all duration-300 hover:border-primary/35 hover:shadow-[0_20px_55px_rgba(15,42,89,0.10)] sm:px-7 sm:py-6"
                  >
                    <span className="text-sm font-bold tabular-nums text-primary/55">0{index + 1}</span>
                    <span>
                      <span className="block text-xl font-semibold leading-tight tracking-[-0.02em] text-slate-950 md:text-2xl">
                        {groupName}
                      </span>
                      {groupDescription && (
                        <span className="mt-2 block text-sm leading-relaxed text-slate-500 sm:text-base">
                          {groupDescription}
                        </span>
                      )}
                    </span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 transition-colors group-hover:border-primary/30 group-hover:bg-primary group-hover:text-white">
                      <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                    </span>
                  </Link>
                )
              }

              return (
                <article
                  key={group.id}
                  className={cn(
                    "overflow-hidden rounded-2xl border bg-white transition-colors duration-300",
                    isOpen ? "border-primary/35 shadow-[0_20px_55px_rgba(15,42,89,0.10)]" : "border-slate-200"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpenGroup(isOpen ? "" : group.id)}
                    className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 px-5 py-5 text-left sm:px-7 sm:py-6"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm font-bold tabular-nums text-primary/55">0{index + 1}</span>
                    <span>
                      <span className="block text-xl font-semibold leading-tight tracking-[-0.02em] text-slate-950 md:text-2xl">
                        {groupName}
                      </span>
                      {groupDescription && (
                        <span className="mt-2 block text-sm leading-relaxed text-slate-500 sm:text-base">
                          {groupDescription}
                        </span>
                      )}
                    </span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50">
                      <ChevronDown
                        className={cn("h-5 w-5 text-slate-700 transition-transform duration-300", isOpen && "rotate-180")}
                        aria-hidden
                      />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-slate-200 px-5 pb-5 pt-2 sm:px-7 sm:pb-7">
                          <p className="py-4 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                            {labels.products}
                          </p>
                          <div className="divide-y divide-slate-200">
                            {products.map((product) => {
                              const productDisplay = resolveProductDisplay(
                                {
                                  id: product.id,
                                  name: product.name,
                                  description: product.description,
                                  slug: product.slug,
                                  brand: product.brand,
                                  specifications: product.specifications,
                                },
                                locale,
                                { categoryId: "abs", subcategoryId: group.slug }
                              )
                              const href = `/products/abs/${group.slug}/${encodeURIComponent(getProductPathSegment(product))}`

                              return (
                                <div key={product.id} className="grid gap-4 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                                  <div>
                                    <h3 className="text-lg font-semibold text-slate-950">{productDisplay.name}</h3>
                                    {productDisplay.description && (
                                      <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-slate-500">
                                        {productDisplay.description}
                                      </p>
                                    )}
                                  </div>
                                  <Link
                                    href={href}
                                    className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
                                  >
                                    {labels.details}
                                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                                  </Link>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
