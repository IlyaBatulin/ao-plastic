"use client"

import Link from "next/link"
import { Footer } from "@/components/footer"
import { LegalRequisitesCard } from "@/components/legal/legal-requisites-card"
import { useLanguage } from "@/contexts/language-context"
import { LEGAL_DOCUMENTS, LEGAL_SITE } from "@/lib/legal-documents"

export function CompanyDetailsContent() {
  const { lang } = useLanguage()
  const en = lang === "en"

  return (
    <div className="min-h-screen bg-transparent">
      <section className="pb-12 pt-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-4 text-4xl font-bold text-primary dark:text-[#60a5fa] md:text-5xl">
              {en ? "Company Details" : "Реквизиты компании"}
            </h1>
            <p className="text-lg text-foreground/80">
              {en
                ? "Current JSC «Plastic» details for contracts, invoices and official correspondence"
                : "Актуальные данные АО «Пластик» для договоров, счетов и официальной переписки"}
            </p>
            <div className="mx-auto mt-6 h-0.5 w-24 bg-primary dark:bg-[#60a5fa]" />
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-4xl px-4 pb-16 lg:px-8">
        <LegalRequisitesCard showPageLink={false} />

        <div className="mt-10 rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
          <h2 className="mb-4 text-xl font-bold text-primary dark:text-[#60a5fa]">
            {en ? "Legal Documents" : "Юридические документы"}
          </h2>
          <ul className="space-y-2 text-foreground/90">
            <li>
              <Link href={LEGAL_DOCUMENTS.privacyPolicyPage} className="text-primary hover:underline">
                {en ? "Privacy Policy" : "Политика конфиденциальности"}
              </Link>
            </li>
            <li>
              <Link href={LEGAL_DOCUMENTS.termsPage} className="text-primary hover:underline">
                {en ? "Public Offer Agreement" : "Пользовательское соглашение"}
              </Link>
            </li>
            <li>
              <Link href={LEGAL_DOCUMENTS.personalDataConsentPage} className="text-primary hover:underline">
                {en ? "Consent to Personal Data Processing" : "Согласие на обработку персональных данных"}
              </Link>
            </li>
          </ul>
        </div>

        <p className="mt-10 text-sm text-muted-foreground">
          {en ? "Questions: " : "По вопросам: "}
          <a href={`mailto:${LEGAL_SITE.email}`} className="text-primary hover:underline">
            {LEGAL_SITE.email}
          </a>
          , {en ? "tel." : "тел."} {LEGAL_SITE.phone}
        </p>
      </div>

      <Footer />
    </div>
  )
}
