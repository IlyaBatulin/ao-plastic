"use client"

import { Footer } from "@/components/footer"
import { Download } from "lucide-react"
import Link from "next/link"
import { useLocalizedContent } from "@/lib/use-localized-content"
import { ethicsPageContent, type EthicsBlock } from "@/data/about-pages/ethics-content"

const sectionClassBase = "py-12 md:py-16"
const sectionClassAlt = "bg-primary/5 dark:bg-[#60a5fa]/10"

function EthicsBlocks({ blocks }: { blocks: EthicsBlock[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        if (block.type === "h3") {
          return (
            <h3 key={`${index}-${block.text.slice(0, 24)}`} className="text-xl font-semibold mt-8 mb-4">
              {block.text}
            </h3>
          )
        }
        if (block.type === "ul") {
          return (
            <ul
              key={`${index}-ul`}
              className="space-y-3 text-foreground/90 leading-relaxed mb-8 list-disc pl-6"
            >
              {block.items.map((item) => (
                <li key={item.slice(0, 48)}>{item}</li>
              ))}
            </ul>
          )
        }
        return (
          <p key={`${index}-${block.text.slice(0, 24)}`} className="mb-4 text-foreground/90 leading-relaxed">
            {block.text}
          </p>
        )
      })}
    </>
  )
}

export function EthicsPageClient() {
  const page = useLocalizedContent(ethicsPageContent)

  return (
    <>
      <div className="min-h-screen bg-transparent">
        <section className="pt-32 pb-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-h1 mb-6 text-primary dark:text-[#60a5fa]">
                {page.heroTitle}
              </h1>
              <p className="text-xl text-foreground/80">{page.heroCompany}</p>
              <div className="mt-6 h-0.5 w-24 mx-auto bg-primary dark:bg-[#60a5fa]" />
              <Link
                href="/docs/korporativnyy-kodeks.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-xl bg-primary dark:bg-[#60a5fa] text-white font-medium hover:opacity-90 transition-opacity"
              >
                <Download className="w-5 h-5" />
                {page.downloadPdf}
              </Link>
            </div>
          </div>
        </section>

        <article className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <section id="toc" className={`${sectionClassBase} ${sectionClassAlt}`}>
            <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6 text-primary dark:text-[#60a5fa]">{page.tocTitle}</h2>
              <ol className="list-decimal list-inside space-y-2 text-foreground/90">
                {page.tocItems.map((item) => (
                  <li key={item.id}>
                    <a href={`#${item.id}`} className="hover:underline">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {page.sections.map((section, sectionIndex) => (
            <section
              key={section.id}
              id={section.id}
              className={sectionIndex % 2 === 1 ? `${sectionClassBase} ${sectionClassAlt}` : sectionClassBase}
            >
              <div className="rounded-2xl border border-border bg-card p-8 md:p-10 shadow-sm">
                <h2 className="text-2xl font-bold mb-6 text-primary dark:text-[#60a5fa]">{section.title}</h2>
                <EthicsBlocks blocks={section.blocks} />
              </div>
            </section>
          ))}

          <section id="antikorr" className={sectionClassBase}>
            <div className="rounded-2xl border-2 border-primary/30 dark:border-[#60a5fa]/30 bg-card p-8 md:p-10 shadow-sm">
              <h2 className="text-2xl font-bold mb-6 text-primary dark:text-[#60a5fa]">{page.antiCorruption.title}</h2>
              <EthicsBlocks blocks={page.antiCorruption.blocks} />
            </div>
          </section>
        </article>

        <Footer />
      </div>
    </>
  )
}
