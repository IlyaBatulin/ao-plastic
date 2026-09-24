"use client"

import { Footer } from "@/components/footer"
import { VacanciesSwitcher } from "./vacancies-switcher"
import { useLocalizedContent } from "@/lib/use-localized-content"
import { vacanciesHeroContent } from "@/data/about-pages/vacancies-hero"
import Link from "next/link"
import { ArrowUpRight, GraduationCap } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function VacanciesPageClient() {
  const page = useLocalizedContent(vacanciesHeroContent)
  const { lang } = useLanguage()

  return (
    <>      <div className="min-h-screen bg-transparent">
        <section className="pt-32 pb-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="mb-16 text-center">
                <h1 className="text-h1 mb-6 text-primary break-words animate-in fade-in slide-in-from-bottom-4 duration-700">
                  {page.heroTitle}
                </h1>
                <p className="text-xl md:text-2xl text-foreground/70 leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200">
                  {page.heroSubtitle}
                </p>
                <div className="mt-6 h-0.5 w-24 mx-auto bg-primary animate-in fade-in duration-700 delay-300" />
              </div>

              <VacanciesSwitcher />

              <Link href="/about/college" className="group mt-16 flex flex-col gap-5 rounded-3xl border border-primary/15 bg-[#eef4ff] p-7 transition-colors hover:border-primary/40 sm:flex-row sm:items-center sm:justify-between sm:p-9">
                <div className="flex items-start gap-5">
                  <span className="rounded-2xl bg-primary p-3 text-white"><GraduationCap className="h-7 w-7" /></span>
                  <div>
                    <h2 className="text-xl font-semibold text-primary sm:text-2xl">{lang === "en" ? "Your career can start at college" : "Карьера начинается ещё в колледже"}</h2>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">{lang === "en" ? "Explore the partnership between JSC Plastic and Uzlovaya Polytechnic College in the Professionalitet project." : "Узнайте о партнёрстве АО «Пластик» с Узловским политехническим колледжем в проекте «Профессионалитет»."}</p>
                  </div>
                </div>
                <span className="inline-flex shrink-0 items-center gap-2 font-semibold text-primary">{lang === "en" ? "Explore the project" : "Узнать о проекте"}<ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></span>
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
}
