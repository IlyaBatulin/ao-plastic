import { localizePageMetadata } from "@/lib/seo/localized-metadata"
import type { Metadata } from "next"
import { DisclosurePageClient } from "./disclosure-page-client"
import { pageOpenGraph } from "@/lib/seo/page-metadata"

const originalMetadata: Metadata = {
  title: "Раскрытие информации",
  description:
    "Раскрытие информации АО «Пластик»: годовые отчёты, финансовая отчётность, устав и документы для акционеров.",
  alternates: { canonical: "/about/disclosure" },
  openGraph: pageOpenGraph({
    title: "Раскрытие информации",
    description:
      "Раскрытие информации АО «Пластик»: годовые отчёты, финансовая отчётность, устав и документы для акционеров.",
    path: "/about/disclosure",
  }),
}

export async function generateMetadata(): Promise<Metadata> {
  return localizePageMetadata(originalMetadata, "/about/disclosure")
}

export default function DisclosurePage() {
  return <DisclosurePageClient />
}
