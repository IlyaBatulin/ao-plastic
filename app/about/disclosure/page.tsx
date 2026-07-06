import type { Metadata } from "next"
import { DisclosurePageClient } from "./disclosure-page-client"
import { pageOpenGraph } from "@/lib/seo/page-metadata"

export const metadata: Metadata = {
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

export default function DisclosurePage() {
  return <DisclosurePageClient />
}
