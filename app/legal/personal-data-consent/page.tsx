import type { Metadata } from "next"
import { LegalDocumentPage } from "@/components/legal/legal-document-page"
import { LEGAL_DOCUMENT_CONTENT } from "@/lib/legal-content/documents"
import { LEGAL_DOCUMENTS } from "@/lib/legal-documents"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Согласие на обработку персональных данных",
  description:
    "Согласие на обработку персональных данных при использовании сайта и форм АО «Пластик».",
  alternates: { canonical: "/legal/personal-data-consent" },
}

export default function PersonalDataConsentPage() {
  const doc = LEGAL_DOCUMENT_CONTENT.personalDataConsent

  return (
    <LegalDocumentPage document={doc}>
      <p className="mt-8 text-sm text-muted-foreground">
        См. также:{" "}
        <Link href={LEGAL_DOCUMENTS.privacyPolicyPage} className="text-primary hover:underline">
          политика конфиденциальности
        </Link>
        ,{" "}
        <Link href={LEGAL_DOCUMENTS.termsPage} className="text-primary hover:underline">
          пользовательское соглашение
        </Link>
        .
      </p>
    </LegalDocumentPage>
  )
}
