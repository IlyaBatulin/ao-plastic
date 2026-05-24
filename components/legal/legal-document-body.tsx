import {
  getHeadingId,
  isMajorSectionHeading,
  type TocEntry,
} from "@/lib/legal-content/parse-sections"
import type { LegalHeadingMode } from "@/lib/legal-content/documents"

type LegalDocumentBodyProps = {
  paragraphs: string[]
  tocEntries: TocEntry[]
  headingMode: LegalHeadingMode
}

export function LegalDocumentBody({
  paragraphs,
  tocEntries,
  headingMode,
}: LegalDocumentBodyProps) {
  return (
    <div className="space-y-4 text-foreground/90 leading-relaxed">
      {paragraphs.map((paragraph, index) => {
        const trimmed = paragraph.trim()
        const isMajor = isMajorSectionHeading(trimmed, headingMode)
        const headingId = isMajor ? getHeadingId(trimmed, tocEntries) : undefined

        if (isMajor && headingId) {
          return (
            <h2
              key={index}
              id={headingId}
              className="scroll-mt-28 pt-6 text-lg font-semibold text-foreground first:pt-0"
            >
              {trimmed}
            </h2>
          )
        }

        return (
          <p key={index} className="text-foreground/90 leading-relaxed">
            {trimmed}
          </p>
        )
      })}
    </div>
  )
}
