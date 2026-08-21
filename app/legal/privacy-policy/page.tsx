import type { Metadata } from "next"
import { LegalDocumentPage } from "@/components/legal/legal-document-page"
import { LEGAL_DOCUMENT_CONTENT } from "@/lib/legal-content/documents"
import { LegalRelatedLinks } from "@/components/legal/legal-related-links"
import { pageOpenGraph } from "@/lib/seo/page-metadata"

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  description:
    "Политика обработки персональных данных на сайте АО «Пластик»: цели, сроки хранения и права пользователей.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/legal/privacy-policy" },
  openGraph: pageOpenGraph({
    title: "Политика конфиденциальности",
    description:
      "Политика обработки персональных данных на сайте АО «Пластик»: цели, сроки хранения и права пользователей.",
    path: "/legal/privacy-policy",
  }),
}

export default function PrivacyPolicyPage() {
  const doc = LEGAL_DOCUMENT_CONTENT.privacyPolicy

  return (
    <LegalDocumentPage document={doc}>
      <LegalRelatedLinks current="privacy" />
    </LegalDocumentPage>
  )
}
