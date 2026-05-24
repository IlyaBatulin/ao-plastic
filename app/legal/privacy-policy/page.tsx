import type { Metadata } from "next"
import { LegalDocumentPage } from "@/components/legal/legal-document-page"
import { LEGAL_DOCUMENT_CONTENT } from "@/lib/legal-content/documents"
import { LEGAL_DOCUMENTS } from "@/lib/legal-documents"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  description:
    "Политика обработки персональных данных на сайте АО «Пластик»: цели, сроки хранения и права пользователей.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/legal/privacy-policy" },
}

export default function PrivacyPolicyPage() {
  const doc = LEGAL_DOCUMENT_CONTENT.privacyPolicy

  return (
    <LegalDocumentPage document={doc}>
      <p className="mt-8 text-sm text-muted-foreground">
        Связанные документы:{" "}
        <Link href={LEGAL_DOCUMENTS.termsPage} className="text-primary hover:underline">
          пользовательское соглашение
        </Link>
        ,{" "}
        <Link
          href={LEGAL_DOCUMENTS.personalDataConsentPage}
          className="text-primary hover:underline"
        >
          согласие на обработку персональных данных
        </Link>
        .
      </p>
    </LegalDocumentPage>
  )
}
