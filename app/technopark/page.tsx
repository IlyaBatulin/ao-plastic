import type { Metadata } from "next"
import { pageOpenGraph } from "@/lib/seo/page-metadata"
import { TechnoparkPageClient } from "./technopark-page-client"

const TITLE = "Индустриальный парк «Пластик» в Узловой"
const DESCRIPTION =
  "Индустриальный парк на площадке АО «Пластик»: более 104 га территории, 100 000 м² производственных зданий, собственная ж/д и инженерная инфраструктура, 10 действующих резидентов. Станьте резидентом парка."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/technopark",
  },
  openGraph: pageOpenGraph({
    title: TITLE,
    description: DESCRIPTION,
    path: "/technopark",
  }),
}

export default function TechnoparkPage() {
  return <TechnoparkPageClient />
}
