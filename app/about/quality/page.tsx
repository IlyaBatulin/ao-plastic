import type { Metadata } from "next"
import { QualityPageClient } from "./quality-page-client"

export const metadata: Metadata = {
  title: "Политика качества",
  description:
    "Система менеджмента качества АО «Пластик»: политика, принципы ISO, лабораторный контроль АБС и полистирола, сертификаты.",
  alternates: { canonical: "/about/quality" },
}

export default function QualityPage() {
  return <QualityPageClient />
}
