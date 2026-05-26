import type { Metadata } from "next"
import { ExtrusionPageClient } from "./extrusion-page-client"

export const metadata: Metadata = {
  title: "Экструзионное производство",
  description:
    "Экструзия полимеров на АО «Пластик»: оборудование, контроль качества гранул и профилей, стандарты производства.",
  alternates: { canonical: "/about/extrusion" },
}

export default function ExtrusionPage() {
  return <ExtrusionPageClient />
}
