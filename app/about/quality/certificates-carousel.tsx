"use client"

import Image from "next/image"
import Link from "next/link"
import { Download } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export type CertificateItem = {
  href: string
  image: string
  title: string
  description: string
}

export function CertificatesCarousel({ certificates }: { certificates: CertificateItem[] }) {
  return (
    <Carousel
      opts={{
        loop: true,
        align: "center",
        dragFree: false,
      }}
      className="w-full max-w-4xl mx-auto"
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {certificates.map((cert, index) => (
          <CarouselItem key={index} className="pl-2 md:pl-4 basis-full sm:basis-[85%] md:basis-[75%] lg:basis-[70%]">
            <Link
              href={cert.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all"
            >
              <div className="aspect-[3/4] relative bg-muted">
                <Image
                  src={cert.image}
                  alt={cert.title}
                  fill
                  className="object-cover object-top group-hover:scale-[1.02] transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, 75vw"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-2">
                  {cert.title}
                </h3>
                <p className="text-sm text-muted-foreground">{cert.description}</p>
                <span className="inline-flex items-center gap-1 mt-2 text-sm text-primary font-medium">
                  <Download className="w-4 h-4" />
                  Открыть
                </span>
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2 md:-left-12 size-10 md:size-12 border-2 bg-background/90 hover:bg-background" />
      <CarouselNext className="right-2 md:-right-12 size-10 md:size-12 border-2 bg-background/90 hover:bg-background" />
    </Carousel>
  )
}
