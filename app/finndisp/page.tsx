import { localizePageMetadata } from "@/lib/seo/localized-metadata"
import type { Metadata } from "next"
import { FinndispPageClient } from "./finndisp-page-client"
import { pageOpenGraph } from "@/lib/seo/page-metadata"

const originalMetadata: Metadata = {
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

export async function generateMetadata(): Promise<Metadata> {
  return localizePageMetadata(originalMetadata, "/finndisp")
}

export default function FinndispPage() {
  return <FinndispPageClient />
}
