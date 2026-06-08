"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CategoryContactDialog } from "@/app/products/_components/category-contact-dialog"
import { KorsNormTable } from "@/app/products/_components/kors-norm-table"
import { useLanguage } from "@/contexts/language-context"
import { KORS_PAGE_KEYS } from "@/lib/kors-bentol-en"
import {
  getStyreneNormRows,
  STYRENE_OKP_LABEL,
  STYRENE_PAGE_KEYS,
} from "@/lib/styrene-category-i18n"

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

interface StyreneCategorySectionProps {
  categoryName: string
}

export function StyreneCategorySection({ categoryName }: StyreneCategorySectionProps) {
  const { t, lang } = useLanguage()
  const k = KORS_PAGE_KEYS
  const styreneK = STYRENE_PAGE_KEYS
  const normTableCols = {
    colNo: t(k.normColNo),
    colName: t(k.normColName),
    colUnit: t(k.normColUnit),
    colValue: t(k.normColValue),
  }
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)

  return (
    <>
      <section className="py-16 lg:py-20 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="mx-auto mb-16 grid max-w-6xl grid-cols-1 items-start gap-x-10 gap-y-8 lg:grid-cols-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.12 }}
            variants={storyParent}
          >
            <motion.div variants={storyChild} className="col-span-full">
              <h2 className="text-h2">{t(styreneK.title)}</h2>
              <p className="mt-4 max-w-2xl text-body text-primary/85 dark:text-blue-100/85">
                {t(styreneK.lead)}
              </p>
              <div className="mt-8 h-1 w-28 rounded-full bg-primary" />
            </motion.div>
            <motion.div
              variants={storyChild}
              className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-muted/30 shadow-md"
            >
              <Image
                src="/images/styrolmain.png"
                alt={t(styreneK.imageAlt)}
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>
            <motion.div variants={storyChild} className="space-y-5">
              <p className="text-lg leading-relaxed text-muted-foreground">{t(styreneK.p1)}</p>
              <p className="text-lg leading-relaxed text-muted-foreground">{t(styreneK.p2)}</p>
              <div className="rounded-xl border border-border/80 bg-card/80 px-4 py-4 shadow-sm dark:bg-card/50">
                <p className="text-lg font-semibold text-foreground">{t(styreneK.gradeTitle)}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t(styreneK.gradeGost)}</p>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{t(styreneK.gradeNote)}</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="mx-auto max-w-6xl"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <h3 className="mb-6 text-h3 sm:text-3xl">{t(styreneK.normTitle)}</h3>
            <KorsNormTable
              tuLabel={STYRENE_OKP_LABEL}
              rows={getStyreneNormRows(lang === "en" ? "en" : "ru")}
              {...normTableCols}
            />
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
              {t(styreneK.contactUs)}
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
