import { getSiteUrl } from "@/lib/site"
import { JsonLd } from "@/components/seo/json-ld"

export type BreadcrumbItem = { name: string; path: string }

type Props = { items: BreadcrumbItem[] }

export function BreadcrumbJsonLd({ items }: Props) {
  if (items.length === 0) return null
  const base = getSiteUrl().replace(/\/$/, "")

  const list = items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.path.startsWith("http") ? item.path : `${base}${item.path.startsWith("/") ? "" : "/"}${item.path}`,
  }))

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: list,
      }}
    />
  )
}
