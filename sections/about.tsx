"use client"

import Image from "next/image"
import { Cormorant_Garamond } from "next/font/google"
import { motion } from "framer-motion"
import { Factory, FlaskConical, Leaf, Award, Truck, HeadphonesIcon } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

const aboutSerif = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
})

const aboutTextClass =
  "text-lg font-semibold leading-[1.65] tracking-[0.01em] text-[#f8fafc] antialiased sm:text-xl sm:leading-[1.65] lg:text-[1.65rem] lg:leading-[1.6] [text-shadow:0_1px_2px_rgba(0,0,0,0.55),0_2px_12px_rgba(0,0,0,0.35)] [&_a]:font-bold [&_a]:text-sky-100 [&_a]:underline [&_a]:decoration-sky-200/90 [&_a]:underline-offset-2 [&_strong]:font-bold [&_strong]:text-[#ffffff]"

const aboutTextContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.22,
      delayChildren: 0.12,
    },
  },
}

const aboutTextItemVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
}

export function About() {
  const { t } = useLanguage()

  const aboutParagraphs = [
    t("homePage.about.paragraph1"),
    t("homePage.about.paragraph2"),
    t("homePage.about.paragraph3"),
  ] as string[]

  const features = [
    { icon: Award, key: "feature1" },
    { icon: FlaskConical, key: "feature2" },
    { icon: Factory, key: "feature3" },
    { icon: HeadphonesIcon, key: "feature4" },
    { icon: Truck, key: "feature5" },
    { icon: Leaf, key: "feature6" },
  ]

  return (
    <section id="about" className="relative overflow-hidden bg-background">
      {/* Большое фото на всю ширину + затемнение + текст (как блок объёмов на главной) */}
      <div className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2">
        <div className="relative h-[100dvh] min-h-[100dvh] w-full">
          <Image
            src="/images/FURS0027_1.jpeg"
            alt="Производственные мощности предприятия"
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority={false}
          />

          {/* Затемнение: слева плотнее под текст, общий градиент */}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/[0.88] via-black/50 to-black/32 dark:from-black/90 dark:via-black/55 dark:to-black/40"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/78 via-transparent to-black/58 sm:to-black/48"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-full max-w-[min(100%,42rem)] bg-gradient-to-r from-black/65 to-transparent sm:max-w-[50%]"
            aria-hidden
          />

          <div className="absolute inset-0 z-10 flex items-center">
            <div
              className={`container mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-16 ${aboutSerif.className}`}
            >
              <motion.div
                className="max-w-4xl space-y-6 sm:space-y-7"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.12, margin: "0px 0px -8% 0px" }}
                variants={aboutTextContainerVariants}
              >
                {aboutParagraphs.map((html, index) => (
                  <motion.p
                    key={index}
                    variants={aboutTextItemVariants}
                    className={aboutTextClass}
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Преимущества — на спокойном фоне под фото */}
      <div className="bg-gradient-to-b from-secondary via-primary/5 to-secondary py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 md:gap-10 lg:grid-cols-3 lg:gap-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group rounded-2xl border-2 border-primary/10 bg-background p-8 shadow-blue-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-blue-lg"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary">
                  <feature.icon className="h-7 w-7 text-primary transition-colors group-hover:text-primary-foreground" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-foreground transition-colors group-hover:text-primary">
                  {t(`homePage.about.${feature.key}.title`)}
                </h3>
                <p className="leading-relaxed text-muted-foreground">
                  {t(`homePage.about.${feature.key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
