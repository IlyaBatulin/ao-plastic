import type { Metadata } from "next"
import { pageOpenGraph } from "@/lib/seo/page-metadata"
import { CollegePageClient } from "./college-page-client"

const title = "Узловский политехнический колледж и АО «Пластик»"
const description =
  "АО «Пластик» и Узловский политехнический колледж: образовательно-производственный кластер химической отрасли, учебные лаборатории и проект «Профессионалитет» в Узловой."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/about/college" },
  openGraph: pageOpenGraph({ title, description, path: "/about/college" }),
}

export default function CollegePage() {
  return <CollegePageClient />
}
