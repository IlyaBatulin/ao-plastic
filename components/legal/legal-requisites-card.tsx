"use client"

import Link from "next/link"
import { CopyRequisitesButton } from "@/components/legal/copy-requisites-button"
import { COMPANY_REQUISITES_FIELDS, COMPANY_REQUISITES_FIELDS_EN } from "@/lib/company-requisites"
import { LEGAL_DOCUMENTS } from "@/lib/legal-documents"
import { useLanguage } from "@/contexts/language-context"

type LegalRequisitesCardProps = {
  showPageLink?: boolean
}

export function LegalRequisitesCard({ showPageLink = true }: LegalRequisitesCardProps) {
  const { lang } = useLanguage()
  const en = lang === "en"
  const fields = en ? COMPANY_REQUISITES_FIELDS_EN : COMPANY_REQUISITES_FIELDS

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <h2 className="text-xl font-bold text-primary dark:text-[#60a5fa]">
          {en ? "JSC «Plastic» Company Details" : "Реквизиты АО «Пластик»"}
        </h2>
        <CopyRequisitesButton />
      </div>
      <dl className="space-y-4">
        {fields.map((field) => (
          <div key={field.label} className="grid gap-1 sm:grid-cols-[minmax(0,220px)_1fr] sm:gap-4">
            <dt className="text-sm font-medium text-muted-foreground">{field.label}</dt>
            <dd className="text-foreground/90 leading-relaxed">
              {field.href ? (
                <a href={field.href} className="text-primary hover:underline">
                  {field.value}
                </a>
              ) : (
                field.value
              )}
            </dd>
          </div>
        ))}
      </dl>
      {showPageLink && (
        <p className="mt-6 text-sm text-muted-foreground">
          <Link href={LEGAL_DOCUMENTS.companyDetailsPage} className="text-primary hover:underline">
            {en ? "Company details page" : "Страница реквизитов"}
          </Link>
        </p>
      )}
    </div>
  )
}
