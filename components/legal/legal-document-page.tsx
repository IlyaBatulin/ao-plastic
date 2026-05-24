import { Download } from "lucide-react"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { LegalDocumentBody } from "@/components/legal/legal-document-body"
import { LegalDocumentToc } from "@/components/legal/legal-document-toc"
import { formatCompanyRequisitesParagraph } from "@/lib/company-requisites"
import { getTocEntries, sanitizeLegalParagraphs } from "@/lib/legal-content/parse-sections"
import type { LegalDocumentContent } from "@/lib/legal-content/documents"

type LegalDocumentPageProps = {
  document: LegalDocumentContent
  children?: React.ReactNode
}

function normalizeForCompare(text: string): string {
  return text.replace(/\s/g, "").toLowerCase()
}

function shouldSkipParagraph(paragraph: string, document: LegalDocumentContent): boolean {
  const p = normalizeForCompare(paragraph)
  if (p === normalizeForCompare(document.title)) return true
  if (document.lead && p === normalizeForCompare(document.lead)) return true
  return false
}

function getBodyParagraphs(document: LegalDocumentContent): string[] {
  const raw = document.paragraphs.filter((p) => !shouldSkipParagraph(p, document))

  return sanitizeLegalParagraphs(raw, {
    appendRequisites: document.key === "privacyPolicy",
    requisitesText: formatCompanyRequisitesParagraph(),
  })
}

export function LegalDocumentPage({ document, children }: LegalDocumentPageProps) {
  const bodyParagraphs = getBodyParagraphs(document)
  const tocEntries = document.showToc
    ? getTocEntries(bodyParagraphs, {
        headingMode: document.headingMode,
        skipTitles: [
          document.title,
          "ПОЛЬЗОВАТЕЛЬСКОЕ СОГЛАШЕНИЕ",
          "Политика конфиденциальности",
          "Согласие на обработку персональных данных",
        ],
      })
    : []

  return (
    <div className="min-h-screen bg-transparent">
      <section className="pt-32 pb-10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-bold text-primary dark:text-[#60a5fa] md:text-5xl">
              {document.title}
            </h1>
            <Link
              href={document.pdfHref}
              download
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 dark:bg-[#60a5fa]"
            >
              <Download className="h-5 w-5" />
              Скачать PDF
            </Link>
          </div>
        </div>
      </section>

      <article className="container mx-auto max-w-4xl px-4 pb-16 lg:px-8">
        {document.showToc && <LegalDocumentToc entries={tocEntries} />}

        <div className="rounded-2xl border border-border bg-card/95 p-6 shadow-sm backdrop-blur-sm md:p-10">
          <LegalDocumentBody
            paragraphs={bodyParagraphs}
            tocEntries={tocEntries}
            headingMode={document.headingMode}
          />
        </div>

        {children}
      </article>

      <Footer />
    </div>
  )
}
