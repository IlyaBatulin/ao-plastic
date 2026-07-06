import type { Metadata } from "next"
import { VacanciesPageClient } from "./vacancies-page-client"
import { pageOpenGraph } from "@/lib/seo/page-metadata"

export const metadata: Metadata = {
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

export default function VacanciesPage() {
  return <VacanciesPageClient />
}
