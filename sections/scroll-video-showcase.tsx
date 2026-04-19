"use client"

import { ScrollVideo } from "@/components/scroll-video"

export function ScrollVideoShowcase() {
  return (
    <section className="relative w-full">
      <ScrollVideo
        src="/videos/factory-scroll.mp4"
        poster="/images/factory-poster.jpg"
        posterAlt="Завод АО «Пластик» в Узловой — постер к видео о производстве"
        scrollHeight={3000}
        startOffset={0}
        loop={false}
        lazy={true}
        className="w-full"
      />
    </section>
  )
}

