"use client"

import { useLanguage } from "@/contexts/language-context"

type HomeSectionDividerProps = {
  /** Ключ перевода, например homePage.stats.title */
  titleKey: string
  subtitleKey?: string
}

/**
 * Промежуток между крупными блоками главной: название (и опционально подзаголовок) секции.
 */
export function HomeSectionDivider({ titleKey, subtitleKey }: HomeSectionDividerProps) {
  const { t } = useLanguage()

  return (
    <div className="border-y border-border bg-background py-14 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 text-center lg:px-8">
        <h2 className="text-balance text-3xl font-bold tracking-tight text-[#1e3a8a] sm:text-4xl lg:text-5xl dark:text-[#60a5fa]">
          {t(titleKey)}
        </h2>
        {subtitleKey ? (
          <p className="mx-auto mt-4 max-w-2xl text-base text-[#1e3a8a]/85 sm:text-lg dark:text-blue-100/85">
            {t(subtitleKey)}
          </p>
        ) : null}
        <div className="mx-auto mt-8 h-1 w-28 rounded-full bg-[#1e3a8a] dark:bg-[#60a5fa]" />
      </div>
    </div>
  )
}
