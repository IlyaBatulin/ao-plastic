import type { Metadata } from "next"
import { SafetyPageClient } from "./safety-page-client"

export const metadata: Metadata = {
  title: "Охрана труда и экология",
  description:
    "Промышленная безопасность, охрана труда и экологическая политика АО «Пластик»: документы, сертификаты и принципы устойчивого развития.",
  alternates: { canonical: "/about/safety" },
}

export default function SafetyPage() {
  return <SafetyPageClient />
}
