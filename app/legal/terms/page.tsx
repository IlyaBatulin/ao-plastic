import { localizePageMetadata } from "@/lib/seo/localized-metadata"
import type { Metadata } from "next"
import { LegalDocumentPage } from "@/components/legal/legal-document-page"
import { LEGAL_DOCUMENT_CONTENT } from "@/lib/legal-content/documents"
import { LegalRelatedLinks } from "@/components/legal/legal-related-links"
import { pageOpenGraph } from "@/lib/seo/page-metadata"

const originalMetadata: Metadata = {
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

export async function generateMetadata(): Promise<Metadata> {
  return localizePageMetadata(originalMetadata, "/legal/terms")
}

export default function TermsPage() {
  const doc = LEGAL_DOCUMENT_CONTENT.terms

  return (
    <LegalDocumentPage document={doc}>
      <LegalRelatedLinks current="terms" />
    </LegalDocumentPage>
  )
}
