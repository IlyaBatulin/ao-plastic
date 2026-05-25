import type { Metadata } from "next"
import { FinndispPageClient } from "./finndisp-page-client"

export const metadata: Metadata = {
  title: "Финндисп — производитель акриловых дисперсий",
  description:
    "ООО «Финндисп» — завод стирол-акриловых дисперсий в Раменском. С 2024 года входит в структуру АО «Пластик». Мощность до 20 тыс. тонн продукции в год для ЛКМ, строительных материалов и адгезивов.",
  alternates: { canonical: "/finndisp" },
}

export default function FinndispPage() {
  return <FinndispPageClient />
}
