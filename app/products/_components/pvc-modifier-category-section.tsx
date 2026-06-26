"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Download, Shield, TrendingUp, Zap, Thermometer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatsCounter } from "@/components/stats-counter"
import { CategoryContactDialog } from "@/app/products/_components/category-contact-dialog"
import { PvcModifierSpecTable } from "@/app/products/_components/pvc-modifier-spec-table"
import { useLanguage } from "@/contexts/language-context"
import {
  getPvcModifierSpecRows,
  PVC_MODIFIER_BROCHURE_PATH,
  PVC_MODIFIER_MATERIAL_IMAGE,
  PVC_MODIFIER_PROFILES_IMAGE,
  PVC_MODIFIER_PAGE_KEYS,
} from "@/lib/pvc-modifier-category-i18n"

const storyParent = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
}

const storyChild = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
}

interface PvcModifierCategorySectionProps {
  categoryName: string
}

export function PvcModifierCategorySection({ categoryName }: PvcModifierCategorySectionProps) {
  const { t, lang } = useLanguage()
  const k = PVC_MODIFIER_PAGE_KEYS
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)

  const applications = t(k.applications)
  const applicationItems = Array.isArray(applications) ? applications : []

  const stats = [
    { id: "impact-wpc", icon: Shield, value: 9, suffix: "%", labelKey: k.stat1Label },
    { id: "extrusion-speed", icon: Zap, value: 17, suffix: "%", labelKey: k.stat2Label },
    { id: "impact-cold", icon: Thermometer, value: 60, suffix: "%+", labelKey: k.stat3Label },
    { id: "grades", icon: TrendingUp, value: 3, suffix: "", labelKey: k.stat4Label },
  ] as const

  return (
    <>
      <section className="bg-secondary/30 py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="mx-auto mb-16 grid max-w-6xl grid-cols-1 items-stretch gap-x-10 gap-y-8 lg:grid-cols-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.12 }}
            variants={storyParent}
          >
            <motion.div variants={storyChild} className="col-span-full">
              <p className="max-w-3xl text-body text-primary/85 dark:text-blue-100/85 sm:text-xl sm:leading-relaxed">
                {t(k.subtitle)}
              </p>
              <div className="mt-8 h-1 w-28 rounded-full bg-primary" />
            </motion.div>
            <motion.div variants={storyChild} className="grid grid-cols-1 gap-4">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-muted/30 shadow-md">
                <Image
                  src={PVC_MODIFIER_MATERIAL_IMAGE}
                  alt={t(k.imageAlt)}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-muted/30 shadow-md">
                <Image
                  src={PVC_MODIFIER_PROFILES_IMAGE}
                  alt={t(k.profilesImageAlt)}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </motion.div>
            <motion.div variants={storyChild} className="flex h-full min-h-0 flex-col gap-5 lg:gap-4">
              <div className="space-y-5 shrink-0">
                <p className="text-lg leading-relaxed text-muted-foreground sm:text-xl">{t(k.p1)}</p>
                <p className="text-lg leading-relaxed text-muted-foreground sm:text-xl">{t(k.p2)}</p>
              </div>
              <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/10 via-primary/5 to-background px-5 py-5 shadow-md sm:px-6 sm:py-6">
                <p className="shrink-0 text-lg font-bold text-primary sm:text-xl">
                  {t(k.applicationsTitle)}
                </p>
                <ul className="mt-3 flex min-h-0 flex-1 flex-col justify-center gap-2 sm:mt-4 sm:gap-2.5">
                  {applicationItems.map((item, index) => (
                    <li
                      key={`application-${index}`}
                      className="flex items-center gap-3 rounded-xl border border-primary/20 bg-background/90 px-4 py-2.5 text-sm font-medium text-foreground shadow-sm sm:gap-4 sm:px-4 sm:py-3 sm:text-base"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary sm:h-8 sm:w-8 sm:text-sm">
                        {index + 1}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="mx-auto mb-16 max-w-6xl"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <h3 className="mb-6 text-h3 sm:text-3xl">{t(k.normTitle)}</h3>
            <PvcModifierSpecTable
              rows={getPvcModifierSpecRows(lang === "en" ? "en" : "ru")}
              colIndicator={t(k.colIndicator)}
              colNormGrades={t(k.colNormGrades)}
              colGrade20={t(k.colGrade20)}
              colGrade28={t(k.colGrade28)}
              colGrade15={t(k.colGrade15)}
              colMethod={t(k.colMethod)}
            />
            <motion.div
              className="mt-6 flex justify-center sm:justify-start"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.45 }}
            >
              <Button asChild variant="outline" className="gap-2">
                <Link href={PVC_MODIFIER_BROCHURE_PATH} target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4" />
                  {t(k.brochureLabel)}
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            className="mx-auto mb-16 max-w-6xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.12 }}
            variants={storyParent}
          >
            <motion.div variants={storyChild} className="mb-8 text-center lg:text-left">
              <h3 className="text-h3 sm:text-3xl">{t(k.statsTitle)}</h3>
            </motion.div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.id}
                  variants={storyChild}
                  custom={index}
                  className="flex min-h-[110px] items-stretch rounded-xl border border-border/70 bg-card shadow-sm"
                >
                  <div className="flex w-14 shrink-0 items-center justify-center border-r border-primary/20 bg-primary/10 sm:w-16">
                    <stat.icon className="h-7 w-7 text-primary" strokeWidth={1.7} aria-hidden />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-center px-3 py-3 sm:px-4">
                    <StatsCounter
                      end={stat.value}
                      suffix={stat.suffix}
                      className="text-2xl font-bold leading-tight text-primary tabular-nums sm:text-3xl"
                    />
                    <p className="mt-1 text-sm font-medium leading-snug text-muted-foreground">
                      {t(stat.labelKey)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="mt-10 flex justify-center"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <Button
              onClick={() => setIsContactFormOpen(true)}
              className="h-14 bg-gradient-to-r from-primary to-primary/80 px-8 text-lg hover:from-primary/90 hover:to-primary/70"
            >
              {t(k.contactUs)}
            </Button>
          </motion.div>
        </div>
      </section>
      <CategoryContactDialog
        categoryName={categoryName}
        open={isContactFormOpen}
        onOpenChange={setIsContactFormOpen}
      />
    </>
  )
}
