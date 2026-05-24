import privacyPolicyParagraphs from "./privacy-policy.json"
import termsParagraphs from "./terms.json"
import personalDataConsentParagraphs from "./personal-data-consent.json"
import { LEGAL_DOCUMENTS } from "@/lib/legal-documents"

export type LegalDocumentKey = "privacyPolicy" | "terms" | "personalDataConsent"

export type LegalHeadingMode = "none" | "topNumbered" | "allCaps"

export type LegalDocumentContent = {
  key: LegalDocumentKey
  title: string
  lead?: string
  pdfHref: string
  pageHref: string
  paragraphs: string[]
  /** Показывать оглавление (только смысловые разделы, не пункты 1–10). */
  showToc: boolean
  headingMode: LegalHeadingMode
}

export const LEGAL_DOCUMENT_CONTENT: Record<LegalDocumentKey, LegalDocumentContent> = {
  privacyPolicy: {
    key: "privacyPolicy",
    title: "Политика конфиденциальности",
    pdfHref: LEGAL_DOCUMENTS.privacyPolicyPdf,
    pageHref: LEGAL_DOCUMENTS.privacyPolicyPage,
    paragraphs: privacyPolicyParagraphs,
    showToc: true,
    headingMode: "allCaps",
  },
  terms: {
    key: "terms",
    title: "Пользовательское соглашение",
    pdfHref: LEGAL_DOCUMENTS.termsPdf,
    pageHref: LEGAL_DOCUMENTS.termsPage,
    paragraphs: termsParagraphs,
    showToc: true,
    headingMode: "topNumbered",
  },
  personalDataConsent: {
    key: "personalDataConsent",
    title: "Согласие на обработку персональных данных",
    pdfHref: LEGAL_DOCUMENTS.personalDataConsentPdf,
    pageHref: LEGAL_DOCUMENTS.personalDataConsentPage,
    paragraphs: personalDataConsentParagraphs,
    showToc: false,
    headingMode: "none",
  },
}
