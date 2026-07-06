import type { Metadata } from "next"
import { EthicsPageClient } from "./ethics-page-client"
import { pageOpenGraph } from "@/lib/seo/page-metadata"

export const metadata: Metadata = {
  title: "Кодекс этики и антикоррупция",
  description:
    "Кодекс деловой этики и антикоррупционная политика АО «Пластик»: принципы ведения бизнеса и обращения с персоналом.",
  alternates: { canonical: "/about/ethics" },
  openGraph: pageOpenGraph({
    title: "Кодекс этики и антикоррупция",
    description:
      "Кодекс деловой этики и антикоррупционная политика АО «Пластик»: принципы ведения бизнеса и обращения с персоналом.",
    path: "/about/ethics",
  }),
}

export default function EthicsPage() {
  return <EthicsPageClient />
}
