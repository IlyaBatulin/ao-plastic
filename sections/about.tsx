"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Factory, FlaskConical, Leaf, Award, Truck, HeadphonesIcon } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { FeatureCard } from "@/components/feature-card"

const aboutTextClass =
  "text-body text-xl font-semibold leading-relaxed text-white sm:text-2xl sm:leading-relaxed lg:text-3xl lg:leading-snug [text-shadow:0_2px_8px_rgba(0,0,0,0.45)] [&_a]:font-semibold [&_a]:text-white [&_a]:underline [&_a]:decoration-white/90 [&_a]:underline-offset-2 [&_strong]:font-bold [&_strong]:text-white"

const aboutTextContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
}

const aboutTextItemVariants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
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
    <section id="about" className="relative overflow-hidden">
      {/* Большое фото на всю ширину + затемнение + текст (как блок объёмов на главной) */}
      <div className="relative w-full max-w-full overflow-hidden">
        <div className="relative isolate">
          <div className="pointer-events-none absolute inset-0 z-0 min-h-full">
            <Image
              src="/images/furs0027-1.jpeg"
              alt="Производственные мощности предприятия"
              fill
              className="object-cover object-center"
              sizes="100vw"
              priority={false}
            />

            {/* Затемнение: слева плотнее под текст, общий градиент — один слой с двумя градиентами */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1)), linear-gradient(to top, rgba(0,0,0,0.45), transparent 50%, rgba(0,0,0,0.2))",
              }}
              aria-hidden
            />
          </div>

          <div className="relative z-10 flex min-h-[100svh] items-start py-16 md:min-h-[100dvh] md:items-center md:py-20 lg:py-24">
            <div className="container mx-auto px-4 text-white sm:px-6 lg:px-8">
              <motion.div
                className="max-w-3xl space-y-6 sm:max-w-4xl sm:space-y-7 lg:max-w-5xl lg:space-y-8"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.12, margin: "0px 0px -8% 0px" }}
                variants={aboutTextContainerVariants}
              >
                <h2 className="text-display text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]">
                  {t("homePage.about.title")}
                </h2>
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
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={t(`homePage.about.${feature.key}.title`)}
                description={t(`homePage.about.${feature.key}.description`)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
