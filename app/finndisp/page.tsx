import type { Metadata } from "next"
import { FinndispPageClient } from "./finndisp-page-client"
import { pageOpenGraph } from "@/lib/seo/page-metadata"

export const metadata: Metadata = {
  title: "Финндисп — производитель акриловых дисперсий",
  description:
    "ООО «Финндисп» — завод стирол-акриловых дисперсий в Раменском. С 2024 года входит в структуру АО «Пластик». Мощность до 20 тыс. тонн продукции в год для ЛКМ, строительных материалов и адгезивов.",
  alternates: { canonical: "/finndisp" },
  openGraph: pageOpenGraph({
    title: "Финндисп — производитель акриловых дисперсий",
    description:
      "ООО «Финндисп» — завод стирол-акриловых дисперсий в Раменском. С 2024 года входит в структуру АО «Пластик». Мощность до 20 тыс. тонн продукции в год для ЛКМ, строительных материалов и адгезивов.",
    path: "/finndisp",
  }),
}

export default function FinndispPage() {
  return <FinndispPageClient />
}
