import type { Metadata } from "next"
import { CompanyDetailsContent } from "@/components/legal/company-details-content"
import { pageOpenGraph } from "@/lib/seo/page-metadata"

export const metadata: Metadata = {
  title: "Реквизиты компании",
  description:
    "Юридические реквизиты АО «Пластик»: ИНН, КПП, ОГРН, юридический и почтовый адрес, контакты для договоров.",
  alternates: { canonical: "/legal/company-details" },
  openGraph: pageOpenGraph({
    title: "Реквизиты компании",
    description:
      "Юридические реквизиты АО «Пластик»: ИНН, КПП, ОГРН, юридический и почтовый адрес, контакты для договоров.",
    path: "/legal/company-details",
  }),
}

export default function CompanyDetailsPage() {
  return <CompanyDetailsContent />
}
