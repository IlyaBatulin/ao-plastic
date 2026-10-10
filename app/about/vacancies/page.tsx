import { localizePageMetadata } from "@/lib/seo/localized-metadata"
import type { Metadata } from "next"
import { VacanciesPageClient } from "./vacancies-page-client"
import { pageOpenGraph } from "@/lib/seo/page-metadata"

const originalMetadata: Metadata = {
  title: "Вакансии",
  description:
    "Вакансии АО «Пластик» в Узловой и регионах: работа на химическом производстве, инженерные и производственные специальности.",
  alternates: { canonical: "/about/vacancies" },
  openGraph: pageOpenGraph({
    title: "Вакансии",
    description:
      "Вакансии АО «Пластик» в Узловой и регионах: работа на химическом производстве, инженерные и производственные специальности.",
    path: "/about/vacancies",
  }),
}

export async function generateMetadata(): Promise<Metadata> {
  return localizePageMetadata(originalMetadata, "/about/vacancies")
}

export default function VacanciesPage() {
  return <VacanciesPageClient />
}
