"use client"

import Image from "next/image"
import { Footer } from "@/components/footer"
import { DeliveryMap } from "@/sections/delivery-map"
import { StatsCounter } from "@/components/stats-counter"
import { useLocalizedContent } from "@/lib/use-localized-content"
import { aboutPageContent, valueIcons } from "@/data/about-pages/about"
import { AboutLenisSync } from "./about-lenis-sync"

export function AboutPageClient() {
  const page = useLocalizedContent(aboutPageContent)

  return (
    <div className="min-h-screen bg-background">
      <AboutLenisSync />

      <section className="relative min-h-[min(62vh,720px)] overflow-hidden flex flex-col justify-end pt-32 pb-16 md:pb-20 lg:pb-24">
        <div className="absolute inset-0 z-0">
          <Image
            src="/prevyu/fasad/furs0062.jpeg"
            alt={page.heroImageAlt}
            fill
            priority
            quality={100}
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/25" aria-hidden />
        </div>

        <div className="relative z-10 container mx-auto px-4 lg:px-8 max-w-5xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] !text-white sm:text-sm">
            {page.heroBadge}
          </p>
          <h1 className="text-h1 mb-6 leading-[1.05] !text-white">{page.heroTitle}</h1>
          <p className="text-body-bold max-w-3xl text-lg !text-white sm:text-xl md:text-2xl">
            {page.heroSubtitle}
          </p>
        </div>
      </section>

      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center flex flex-col items-center">
              <StatsCounter
                end={1959}
                prefix=""
                className="min-h-[3rem] lg:min-h-[3.5rem] flex items-end justify-center text-4xl lg:text-5xl leading-none whitespace-nowrap"
              />
              <p className="text-body mt-2 min-h-[1.75rem] text-base">{page.stats.founded}</p>
            </div>
            <div className="text-center flex flex-col items-center">
              <StatsCounter
                end={1000}
                suffix="+"
                className="min-h-[3rem] lg:min-h-[3.5rem] flex items-end justify-center text-4xl lg:text-5xl leading-none whitespace-nowrap"
              />
              <p className="text-body mt-2 min-h-[1.75rem] text-base">{page.stats.employees}</p>
            </div>
            <div className="text-center flex flex-col items-center">
              <StatsCounter
                end={1000}
                suffix="+"
                className="min-h-[3rem] lg:min-h-[3.5rem] flex items-end justify-center text-4xl lg:text-5xl leading-none whitespace-nowrap"
              />
              <p className="text-body mt-2 min-h-[1.75rem] text-base">{page.stats.clients}</p>
            </div>
            <div className="text-center flex flex-col items-center">
              <StatsCounter
                end={150}
                suffix={page.stats.productionSuffix}
                className="min-h-[3rem] lg:min-h-[3.5rem] flex items-end justify-center whitespace-nowrap text-3xl lg:text-4xl leading-none"
              />
              <p className="text-body mt-2 min-h-[1.75rem] text-base">{page.stats.production}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-h2 mb-6">{page.historyTitle}</h2>
              <div className="text-body space-y-4">
                <p>
                  <strong className="text-foreground">{page.historyLeadCompany}</strong>
                  {page.historyLeadText}
                </p>
                {page.historyParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden">
              <img src="/images/factory-3.jpg" alt={page.historyImageAlt} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-h2 mb-10 text-center">{page.valuesTitle}</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {page.values.map((value, index) => {
              const Icon = valueIcons[index]
              return (
                <div key={value.title} className="bg-card rounded-2xl p-8 text-center shadow-blue-sm">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-h3 mb-3">{value.title}</h3>
                  <p className="text-body text-base">{value.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-h2 mb-8">{page.missionTitle}</h2>
            <p className="text-body mb-8">{page.missionLead}</p>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              {page.missionCards.map((card) => (
                <div key={card.title} className="bg-card rounded-2xl p-6 border-2 border-primary/10">
                  <h3 className="text-h3 text-primary mb-2">{card.title}</h3>
                  <p className="text-body text-base">{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <DeliveryMap />

      <Footer />
    </div>
  )
}
