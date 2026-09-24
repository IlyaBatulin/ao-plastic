import { getSiteUrl } from "@/lib/site"
import { JsonLd } from "@/components/seo/json-ld"
import { parseSpecifications, stripHiddenSpecs } from "@/lib/product-specs"

type Props = {
  name: string
  description: string
  image?: string | null
  sku?: string
  category?: string
  urlPath: string
  specifications?: unknown
}

function absoluteUrl(base: string, path: string) {
  if (path.startsWith("http")) return path
  return `${base}${path.startsWith("/") ? path : `/${path}`}`
}

/** Product facts; request-a-quote is not a priced offer or a preorder. */
export function ProductJsonLd({ name, description, image, sku, category, urlPath, specifications }: Props) {
  const base = getSiteUrl().replace(/\/$/, "")
  const url = absoluteUrl(base, urlPath)
  const images =
    image && image.length > 0 ? [absoluteUrl(base, image)] : undefined

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    url,
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
      "@id": `${base}/#organization`,
      "@type": "Organization",
      name: "АО «Пластик»",
      url: base,
    },
    additionalProperty: Object.entries(stripHiddenSpecs(parseSpecifications(specifications)))
      .filter(([, value]) => ["string", "number", "boolean"].includes(typeof value))
      .map(([name, value]) => ({ "@type": "PropertyValue", name, value })),
  }

  return <JsonLd data={data} />
}
