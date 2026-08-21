import privacyPolicyParagraphs from "./privacy-policy.json"
import privacyPolicyParagraphsEn from "./privacy-policy.en.json"
import termsParagraphs from "./terms.json"
import termsParagraphsEn from "./terms.en.json"
import personalDataConsentParagraphs from "./personal-data-consent.json"
import personalDataConsentParagraphsEn from "./personal-data-consent.en.json"
import { LEGAL_DOCUMENTS } from "@/lib/legal-documents"

export type LegalDocumentKey = "privacyPolicy" | "terms" | "personalDataConsent"

export type LegalHeadingMode = "none" | "topNumbered" | "allCaps"

export type LegalDocumentContent = {
  key: LegalDocumentKey
  title: string
  titleEn?: string
  lead?: string
  pdfHref: string
  pageHref: string
  paragraphs: string[]
  paragraphsEn?: string[]
  /** Показывать оглавление (только смысловые разделы, не пункты 1–10). */
  showToc: boolean
  headingMode: LegalHeadingMode
}

export const LEGAL_DOCUMENT_CONTENT: Record<LegalDocumentKey, LegalDocumentContent> = {
  privacyPolicy: {
    key: "privacyPolicy",
    title: "Политика конфиденциальности",
    titleEn: "Privacy Policy",
    pdfHref: LEGAL_DOCUMENTS.privacyPolicyPdf,
    pageHref: LEGAL_DOCUMENTS.privacyPolicyPage,
    paragraphs: privacyPolicyParagraphs,
    paragraphsEn: privacyPolicyParagraphsEn,
    showToc: true,
    headingMode: "allCaps",
  },
  terms: {
    key: "terms",
    title: "Пользовательское соглашение",
    titleEn: "Public Offer Agreement",
    pdfHref: LEGAL_DOCUMENTS.termsPdf,
    pageHref: LEGAL_DOCUMENTS.termsPage,
    paragraphs: termsParagraphs,
    paragraphsEn: termsParagraphsEn,
    showToc: true,
    headingMode: "topNumbered",
  },
  personalDataConsent: {
    key: "personalDataConsent",
    title: "Согласие на обработку персональных данных",
    titleEn: "Consent to Personal Data Processing",
    pdfHref: LEGAL_DOCUMENTS.personalDataConsentPdf,
    pageHref: LEGAL_DOCUMENTS.personalDataConsentPage,
    paragraphs: personalDataConsentParagraphs,
    paragraphsEn: personalDataConsentParagraphsEn,
    showToc: false,
    headingMode: "none",
  },
}
