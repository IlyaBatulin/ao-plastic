import { localizePageMetadata } from "@/lib/seo/localized-metadata"
import type { Metadata } from "next"
import { QualityPageClient } from "./quality-page-client"
import { pageOpenGraph } from "@/lib/seo/page-metadata"

const originalMetadata: Metadata = {
  title: "Политика качества",
  description:
    "Система менеджмента качества АО «Пластик»: политика, принципы ISO, лабораторный контроль АБС и полистирола, сертификаты.",
  alternates: { canonical: "/about/quality" },
  openGraph: pageOpenGraph({
    title: "Политика качества",
    description:
      "Система менеджмента качества АО «Пластик»: политика, принципы ISO, лабораторный контроль АБС и полистирола, сертификаты.",
    path: "/about/quality",
  }),
}

export async function generateMetadata(): Promise<Metadata> {
  return localizePageMetadata(originalMetadata, "/about/quality")
}

export default function QualityPage() {
  return <QualityPageClient />
}
