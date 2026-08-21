import type { Metadata } from "next"
import { LegalDocumentPage } from "@/components/legal/legal-document-page"
import { LEGAL_DOCUMENT_CONTENT } from "@/lib/legal-content/documents"
import { LegalRelatedLinks } from "@/components/legal/legal-related-links"
import { pageOpenGraph } from "@/lib/seo/page-metadata"

export const metadata: Metadata = {
  title: "Согласие на обработку персональных данных",
  description:
    "Согласие на обработку персональных данных при использовании сайта и форм АО «Пластик».",
  alternates: { canonical: "/legal/personal-data-consent" },
  openGraph: pageOpenGraph({
    title: "Согласие на обработку персональных данных",
    description:
      "Согласие на обработку персональных данных при использовании сайта и форм АО «Пластик».",
    path: "/legal/personal-data-consent",
  }),
}

export default function PersonalDataConsentPage() {
  const doc = LEGAL_DOCUMENT_CONTENT.personalDataConsent

  return (
    <LegalDocumentPage document={doc}>
      <LegalRelatedLinks current="consent" />
    </LegalDocumentPage>
  )
}
