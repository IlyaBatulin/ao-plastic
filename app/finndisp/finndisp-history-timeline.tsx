"use client"

import { motion } from "framer-motion"

const easeOut = [0.22, 1, 0.36, 1] as const

type HistoryItem = {
  year: string
  text: string
}

type FinndispHistoryTimelineProps = {
  items: HistoryItem[]
}

export function FinndispHistoryTimeline({ items }: FinndispHistoryTimelineProps) {
  return (
    <motion.div
      className="space-y-5"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12, margin: "0px 0px -8% 0px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.16,
            delayChildren: 0.08,
          },
        },
      }}
    >
      {items.map((item) => (
        <motion.div
          key={item.year}
          className="flex gap-5 rounded-xl border border-border/60 bg-card/70 p-5 shadow-sm backdrop-blur-sm"
          variants={{
            hidden: { opacity: 0, x: 36, y: 16 },
            visible: {
              opacity: 1,
              x: 0,
              y: 0,
              transition: { duration: 0.65, ease: easeOut },
            },
          }}
        >
          <span className="shrink-0 text-xl font-bold tabular-nums text-[#0046A0]">{item.year}</span>
          <p className="pt-0.5 leading-relaxed text-muted-foreground">{item.text}</p>
        </motion.div>
      ))}
    </motion.div>
  )
}
