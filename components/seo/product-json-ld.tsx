import { getSiteUrl } from "@/lib/site"
import { JsonLd } from "@/components/seo/json-ld"

type Props = {
  name: string
  description: string
  image?: string | null
  sku?: string
  category?: string
  urlPath: string
}

function absoluteUrl(base: string, path: string) {
  if (path.startsWith("http")) return path
  return `${base}${path.startsWith("/") ? path : `/${path}`}`
}

/** Product + Offer (цена по запросу — PreOrder). */
export function ProductJsonLd({ name, description, image, sku, category, urlPath }: Props) {
  const base = getSiteUrl().replace(/\/$/, "")
  const url = absoluteUrl(base, urlPath)
  const images =
    image && image.length > 0 ? [absoluteUrl(base, image)] : undefined

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    sku: sku || undefined,
    category,
    image: images,
    brand: {
      "@type": "Brand",
      name: "АО «Пластик»",
    },
    manufacturer: {
      "@type": "Organization",
      name: "АО «Пластик»",
      url: base,
    },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "RUB",
      availability: "https://schema.org/PreOrder",
      seller: { "@type": "Organization", name: "АО «Пластик»" },
    },
  }

  return <JsonLd data={data} />
}
