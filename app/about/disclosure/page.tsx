import type { Metadata } from "next"
import { DisclosurePageClient } from "./disclosure-page-client"

export const metadata: Metadata = {
  title: "Раскрытие информации",
  description:
    "Раскрытие информации АО «Пластик»: годовые отчёты, финансовая отчётность, устав и документы для акционеров.",
  alternates: { canonical: "/about/disclosure" },
}

export default function DisclosurePage() {
  return <DisclosurePageClient />
}
