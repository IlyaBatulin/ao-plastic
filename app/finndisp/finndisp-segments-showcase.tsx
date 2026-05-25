"use client"

import { motion } from "framer-motion"
import { Beaker } from "lucide-react"

const easeOut = [0.22, 1, 0.36, 1] as const

type SegmentItem = {
  title: string
  description: string
  image: string
  imageAlt: string
}

type FinndispSegmentsShowcaseProps = {
  badge: string
  title: string
  segments: SegmentItem[]
}

export function FinndispSegmentsShowcase({ badge, title, segments }: FinndispSegmentsShowcaseProps) {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          className="mb-14 max-w-2xl"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65, ease: easeOut }}
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#0046A0]/30 bg-[#0046A0]/10 px-4 py-1 text-sm font-semibold text-[#0046A0]">
            <Beaker className="h-4 w-4" />
            {badge}
          </span>
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">{title}</h2>
        </motion.div>

        <div className="space-y-16 lg:space-y-24">
          {segments.map((segment, index) => {
            const imageFirst = index % 2 === 0

            return (
              <motion.article
                key={segment.title}
                className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12"
                initial={{ opacity: 0, y: 56 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2, margin: "0px 0px -10% 0px" }}
                transition={{ duration: 0.75, delay: 0.08, ease: easeOut }}
              >
                <motion.div
                  className={`overflow-hidden rounded-2xl border border-border bg-card shadow-md ${imageFirst ? "" : "lg:order-2"}`}
                  initial={{ opacity: 0, x: imageFirst ? -40 : 40, scale: 0.98 }}
                  whileInView={{ opacity: 1, x: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.8, delay: 0.15, ease: easeOut }}
                >
                  <img
                    src={segment.image}
                    alt={segment.imageAlt}
                    className="aspect-[4/3] h-full w-full object-cover"
                    loading="lazy"
                  />
                </motion.div>

                <motion.div
                  className={`rounded-2xl border border-border bg-card/80 p-8 shadow-sm backdrop-blur-sm ${imageFirst ? "" : "lg:order-1"}`}
                  initial={{ opacity: 0, x: imageFirst ? 40 : -40, y: 16 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.8, delay: 0.28, ease: easeOut }}
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#0046A0]/10">
                    <Beaker className="h-5 w-5 text-[#0046A0]" />
                  </div>
                  <h3 className="mb-4 text-2xl font-bold text-foreground">{segment.title}</h3>
                  <p className="text-lg leading-relaxed text-muted-foreground">{segment.description}</p>
                </motion.div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
