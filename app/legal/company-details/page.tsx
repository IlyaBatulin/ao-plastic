import type { Metadata } from "next"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { LegalRequisitesCard } from "@/components/legal/legal-requisites-card"
import { LEGAL_DOCUMENTS, LEGAL_SITE } from "@/lib/legal-documents"
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
  return (
    <div className="min-h-screen bg-transparent">
        <section className="pt-32 pb-12">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="mb-4 text-4xl font-bold text-primary dark:text-[#60a5fa] md:text-5xl">
                Реквизиты компании
              </h1>
              <p className="text-lg text-foreground/80">
                Актуальные данные АО «Пластик» для договоров, счетов и официальной переписки
              </p>
              <div className="mx-auto mt-6 h-0.5 w-24 bg-primary dark:bg-[#60a5fa]" />
            </div>
          </div>
        </section>

        <div className="container mx-auto max-w-4xl px-4 pb-16 lg:px-8">
          <LegalRequisitesCard showPageLink={false} />

          <div className="mt-10 rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
            <h2 className="mb-4 text-xl font-bold text-primary dark:text-[#60a5fa]">
              Юридические документы
            </h2>
            <ul className="space-y-2 text-foreground/90">
              <li>
                <Link
                  href={LEGAL_DOCUMENTS.privacyPolicyPage}
                  className="text-primary hover:underline"
                >
                  Политика конфиденциальности
                </Link>
              </li>
              <li>
                <Link href={LEGAL_DOCUMENTS.termsPage} className="text-primary hover:underline">
                  Пользовательское соглашение
                </Link>
              </li>
              <li>
                <Link
                  href={LEGAL_DOCUMENTS.personalDataConsentPage}
                  className="text-primary hover:underline"
                >
                  Согласие на обработку персональных данных
                </Link>
              </li>
            </ul>
          </div>

          <p className="mt-10 text-sm text-muted-foreground">
            По вопросам:{" "}
            <a href={`mailto:${LEGAL_SITE.email}`} className="text-primary hover:underline">
              {LEGAL_SITE.email}
            </a>
            , тел. {LEGAL_SITE.phone}
          </p>
        </div>

        <Footer />
    </div>
  )
}
