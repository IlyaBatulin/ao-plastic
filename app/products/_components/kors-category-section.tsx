"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CategoryContactDialog } from "@/app/products/_components/category-contact-dialog"
import { KorsNormTable } from "@/app/products/_components/kors-norm-table"
import { useLanguage } from "@/contexts/language-context"
import {
  getBentolNormRows,
  getBentolTuLabel,
  getKorsNormRows,
  getKorsTuLabel,
  KORS_PAGE_KEYS,
} from "@/lib/kors-bentol-en"

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

interface KorsCategorySectionProps {
  categoryName: string
}

export function KorsCategorySection({ categoryName }: KorsCategorySectionProps) {
  const { t, lang } = useLanguage()
  const k = KORS_PAGE_KEYS
  const normTableCols = {
    colNo: t(k.normColNo),
    colName: t(k.normColName),
    colUnit: t(k.normColUnit),
    colValue: t(k.normColValue),
  }
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)

  return (
    <>
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="mx-auto mb-16 grid max-w-6xl grid-cols-1 items-start gap-x-10 gap-y-8 lg:grid-cols-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.12 }}
            variants={storyParent}
          >
            <motion.div variants={storyChild} className="col-span-full">
              <h2 className="text-h2">{t(k.corsTitle)}</h2>
              <p className="mt-4 max-w-2xl text-body text-primary/85 dark:text-blue-100/85">
                {t(k.corsLead)}
              </p>
              <div className="mt-8 h-1 w-28 rounded-full bg-primary" />
            </motion.div>
            <motion.div
              variants={storyChild}
              className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-muted/30 shadow-md"
            >
              <Image
                src="/prevyu/kolby/kors-1.jpeg"
                alt={t(k.corsAlt)}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>
            <motion.div variants={storyChild} className="space-y-5">
              <p className="text-lg leading-relaxed text-muted-foreground">{t(k.corsP1)}</p>
              <p className="text-lg leading-relaxed text-muted-foreground">{t(k.corsP2)}</p>
              <p className="text-lg leading-relaxed text-muted-foreground">{t(k.corsP3)}</p>
              <p className="text-base text-muted-foreground">{t(k.corsP4)}</p>
            </motion.div>
          </motion.div>

          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="mb-6 text-h3 sm:text-3xl">{t(k.corsNormTitle)}</h2>
            <KorsNormTable
              tuLabel={getKorsTuLabel(lang === "en" ? "en" : "ru")}
              rows={getKorsNormRows(lang === "en" ? "en" : "ru")}
              {...normTableCols}
            />
          </motion.div>

          <motion.div
            className="mx-auto mb-16 grid max-w-6xl grid-cols-1 items-start gap-x-10 gap-y-8 lg:grid-cols-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.12 }}
            variants={storyParent}
          >
            <motion.div variants={storyChild} className="col-span-full">
              <h2 className="text-h2">{t(k.bentolTitle)}</h2>
              <p className="mt-4 max-w-2xl text-body text-primary/85 dark:text-blue-100/85">
                {t(k.bentolLead)}
              </p>
              <div className="mt-8 h-1 w-28 rounded-full bg-primary" />
            </motion.div>
            <motion.div
              variants={storyChild}
              className="relative aspect-[3/4] w-full max-w-md overflow-hidden rounded-2xl border border-border bg-muted/40 shadow-md lg:max-w-none"
            >
              <Image
                src="/images/bentol.png"
                alt={t(k.bentolAlt)}
                fill
                className="object-contain p-4"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>
            <motion.div variants={storyChild} className="space-y-5">
              <p className="text-lg leading-relaxed text-muted-foreground">{t(k.bentolP1)}</p>
              <p className="text-lg leading-relaxed text-muted-foreground">{t(k.bentolP2)}</p>
              <p className="text-lg leading-relaxed text-muted-foreground">{t(k.bentolP3)}</p>
              <p className="text-base text-muted-foreground">{t(k.bentolP4)}</p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <h3 className="mb-6 text-h3 sm:text-3xl">{t(k.bentolNormTitle)}</h3>
            <KorsNormTable
              tuLabel={getBentolTuLabel(lang === "en" ? "en" : "ru")}
              rows={getBentolNormRows(lang === "en" ? "en" : "ru")}
              {...normTableCols}
            />
          </motion.div>

          <motion.div
            className="mt-8 flex justify-center"
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
