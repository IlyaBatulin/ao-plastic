/** Убирает HTML и сжимает пробелы для meta description. */
export function stripHtmlForMeta(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

export function truncateMeta(text: string, max = 160): string {
  const t = stripHtmlForMeta(text)
  if (t.length <= max) return t
  return `${t.slice(0, max - 1).trimEnd()}…`
}
