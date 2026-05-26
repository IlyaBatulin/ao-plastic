import type { Metadata } from "next"
import { EthicsPageClient } from "./ethics-page-client"

export const metadata: Metadata = {
  title: "Кодекс этики и антикоррупция",
  description:
    "Кодекс деловой этики и антикоррупционная политика АО «Пластик»: принципы ведения бизнеса и обращения с персоналом.",
  alternates: { canonical: "/about/ethics" },
}

export default function EthicsPage() {
  return <EthicsPageClient />
}
