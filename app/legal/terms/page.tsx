import type { Metadata } from "next"
import { LegalDocumentPage } from "@/components/legal/legal-document-page"
import { LEGAL_DOCUMENT_CONTENT } from "@/lib/legal-content/documents"
import { LEGAL_DOCUMENTS } from "@/lib/legal-documents"
import Link from "next/link"
import { pageOpenGraph } from "@/lib/seo/page-metadata"

export const metadata: Metadata = {
  title: "Пользовательское соглашение",
  description:
    "Пользовательское соглашение сайта АО «Пластик»: правила использования материалов, ответственность сторон.",
  alternates: { canonical: "/legal/terms" },
  openGraph: pageOpenGraph({
    title: "Пользовательское соглашение",
    description:
      "Пользовательское соглашение сайта АО «Пластик»: правила использования материалов, ответственность сторон.",
    path: "/legal/terms",
  }),
}

export default function TermsPage() {
  const doc = LEGAL_DOCUMENT_CONTENT.terms

  return (
    <LegalDocumentPage document={doc}>
      <p className="mt-8 text-sm text-muted-foreground">
        Связанные документы:{" "}
        <Link href={LEGAL_DOCUMENTS.privacyPolicyPage} className="text-primary hover:underline">
          политика конфиденциальности
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
