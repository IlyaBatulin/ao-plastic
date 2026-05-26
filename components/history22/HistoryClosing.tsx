"use client"

import Image from "next/image"
import { motion } from "framer-motion"

interface HistoryClosingProps {
  phrase: string
  logoAlt: string
}

export function HistoryClosing({ phrase, logoAlt }: HistoryClosingProps) {
  return (
    <section className="py-20 md:py-28 bg-secondary border-t border-border/60">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_auto] gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
          <motion.p
            className="text-xl md:text-2xl lg:text-[1.75rem] font-light text-foreground/90 leading-relaxed tracking-tight text-center lg:text-left"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {phrase}
          </motion.p>

          <motion.div
            className="relative mx-auto lg:mx-0 flex-shrink-0"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          >
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/20 blur-2xl"
              animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.55, 0.35] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden
            />
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image
                src="/images/logo123.png"
                alt={logoAlt}
                width={200}
                height={200}
                className="relative h-28 w-28 md:h-36 md:w-36 lg:h-40 lg:w-40 object-contain drop-shadow-lg"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
