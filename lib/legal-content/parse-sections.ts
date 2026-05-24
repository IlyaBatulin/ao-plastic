export type TocEntry = {
  id: string
  title: string
}

function makeSectionId(title: string, index: number): string {
  const slug = title
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48)

  return slug ? `${slug}-${index}` : `section-${index}`
}

/** Подпункты 1.1., 2.3. — не разделы оглавления. */
export function isSubsectionParagraph(text: string): boolean {
  return /^\d+\.\d+/.test(text.trim())
}

import type { LegalHeadingMode } from "./documents"

/** Разделы верхнего уровня по режиму документа. */
export function isMajorSectionHeading(
  text: string,
  mode: LegalHeadingMode
): boolean {
  const t = text.trim()
  if (!t || mode === "none") return false
  if (isSubsectionParagraph(t)) return false

  if (mode === "topNumbered") {
    return /^\d+\.\s+[А-ЯЁ]/.test(t) && t.length < 80
  }

  if (mode === "allCaps") {
    return (
      t.length <= 100 &&
      t === t.toUpperCase() &&
      /[А-ЯЁ]/.test(t) &&
      !t.endsWith(";") &&
      !/^\d+\.\s/.test(t)
    )
  }

  return false
}

export function getTocEntries(
  paragraphs: string[],
  options: {
    headingMode: LegalHeadingMode
    skipTitles?: string[]
  }
): TocEntry[] {
  if (options.headingMode === "none") return []

  const skip = new Set((options.skipTitles ?? []).map((s) => s.toLowerCase()))

  return paragraphs
    .filter((p) => isMajorSectionHeading(p, options.headingMode))
    .filter((p) => !skip.has(p.trim().toLowerCase()))
    .map((title, index) => ({
      id: makeSectionId(title, index),
      title: title.trim(),
    }))
}

export function getHeadingId(title: string, tocEntries: TocEntry[]): string | undefined {
  const found = tocEntries.find((e) => e.title === title.trim())
  return found?.id
}

/** Замена устаревшего домена на актуальный. */
export function normalizeLegalText(text: string): string {
  return text
    .replace(/https?:\/\/oaoplastic\.ru\/?/gi, "https://www.aoplastic.com/")
    .replace(/oaoplastic\.ru/gi, "www.aoplastic.com")
}

export function normalizeLegalParagraphs(paragraphs: string[]): string[] {
  return paragraphs.map(normalizeLegalText)
}

/** Убирает незаполненные плейсхолдеры из Word и подставляет реквизиты. */
export function sanitizeLegalParagraphs(
  paragraphs: string[],
  options?: { appendRequisites?: boolean; requisitesText?: string }
): string[] {
  const filtered = normalizeLegalParagraphs(paragraphs).filter(
    (p) =>
      !p.includes("р/с № __") &&
      !/^АО «Пластик»ОГРН/.test(p) &&
      p.trim().length > 0
  )

  if (options?.appendRequisites && options.requisitesText) {
    const snippet = options.requisitesText.slice(0, 24)
    const hasRequisites = filtered.some((p) => p.includes(snippet))
    if (!hasRequisites) {
      filtered.push(options.requisitesText)
    }
  }

  return filtered
}
