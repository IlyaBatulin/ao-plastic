import type { TocEntry } from "@/lib/legal-content/parse-sections"

type LegalDocumentTocProps = {
  entries: TocEntry[]
}

export function LegalDocumentToc({ entries }: LegalDocumentTocProps) {
  if (entries.length < 2) return null

  return (
    <nav
      aria-label="Оглавление"
      className="mb-8 rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8"
    >
      <h2 className="mb-4 text-lg font-semibold text-foreground">Оглавление</h2>
      <ol className="list-decimal space-y-2 pl-5 text-foreground/90">
        {entries.map((entry) => (
          <li key={entry.id}>
            <a href={`#${entry.id}`} className="hover:text-primary hover:underline">
              {entry.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
