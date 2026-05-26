import type { Metadata } from "next"
import { VacanciesPageClient } from "./vacancies-page-client"

export const metadata: Metadata = {
  title: "Вакансии",
  description:
    "Вакансии АО «Пластик» в Узловой и регионах: работа на химическом производстве, инженерные и производственные специальности.",
  alternates: { canonical: "/about/vacancies" },
}

export default function VacanciesPage() {
  return <VacanciesPageClient />
}
