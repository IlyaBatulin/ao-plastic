import type { Metadata } from "next"
import { ExtrusionPageClient } from "./extrusion-page-client"
import { pageOpenGraph } from "@/lib/seo/page-metadata"

export const metadata: Metadata = {
  title: "Экструзионное производство",
  description:
    "Экструзия полимеров на АО «Пластик»: оборудование, контроль качества гранул и профилей, стандарты производства.",
  alternates: { canonical: "/about/extrusion" },
  openGraph: pageOpenGraph({
    title: "Экструзионное производство",
    description:
      "Экструзия полимеров на АО «Пластик»: оборудование, контроль качества гранул и профилей, стандарты производства.",
    path: "/about/extrusion",
  }),
}

export default function ExtrusionPage() {
  return <ExtrusionPageClient />
}
