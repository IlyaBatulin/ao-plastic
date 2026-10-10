import { localizePageMetadata } from "@/lib/seo/localized-metadata"
import type { Metadata } from "next"
import { SafetyPageClient } from "./safety-page-client"
import { pageOpenGraph } from "@/lib/seo/page-metadata"

const originalMetadata: Metadata = {
  title: "Охрана труда и экология",
  description:
    "Промышленная безопасность, охрана труда и экологическая политика АО «Пластик»: документы, сертификаты и принципы устойчивого развития.",
  alternates: { canonical: "/about/safety" },
  openGraph: pageOpenGraph({
    title: "Охрана труда и экология",
    description:
      "Промышленная безопасность, охрана труда и экологическая политика АО «Пластик»: документы, сертификаты и принципы устойчивого развития.",
    path: "/about/safety",
  }),
}

export async function generateMetadata(): Promise<Metadata> {
  return localizePageMetadata(originalMetadata, "/about/safety")
}

export default function SafetyPage() {
  return <SafetyPageClient />
}
