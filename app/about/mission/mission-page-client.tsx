"use client"

import { Footer } from "@/components/footer"
import { getCategoryVideo } from "@/lib/video-config"
import { useLocalizedContent } from "@/lib/use-localized-content"
import { missionPageContent } from "@/data/about-pages/mission"

export function MissionPageClient() {
  const page = useLocalizedContent(missionPageContent)
  const missionVideoSrc = getCategoryVideo("polystyrene") ?? "/videos/polystyrene-category.mp4"

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden pt-32 pb-24 min-h-[500px]">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            controls={false}
            disablePictureInPicture
            disableRemotePlayback
            className="absolute inset-0 h-full w-full object-cover"
            style={{ pointerEvents: "none" }}
          >
            <source src={missionVideoSrc} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/75 to-background/95" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
        </div>

        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="text-center border-2 border-border rounded-xl bg-card/95 backdrop-blur-sm shadow-xl p-8 md:p-12 lg:p-16">
              <h1 className="mb-8 text-h1 text-primary">{page.title}</h1>
              <div className="text-xl md:text-2xl text-foreground/90 leading-relaxed text-pretty space-y-5 text-left md:text-center md:space-y-6 antialiased font-normal">
                <p>{page.intro}</p>
                <p>{page.productionIntro}</p>
                <ul className="list-disc pl-6 md:pl-10 space-y-1.5 text-left inline-block">
                  {page.products.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p>{page.competitivenessIntro}</p>
                <ul className="list-disc pl-6 md:pl-10 space-y-1.5 text-left inline-block">
                  {page.competitivenessItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p>{page.pricingParagraph}</p>
                <p>
                  <span className="font-medium italic text-primary">{page.motto}</span> {page.mottoSuffix}
                </p>
                <p>{page.employeesParagraph}</p>
                <p>{page.safetyParagraph}</p>
                <p>{page.closingParagraph}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
