import { getSiteUrl } from "@/lib/site"
import { JsonLd } from "@/components/seo/json-ld"

type Props = {
  title: string
  description?: string | null
  imageUrl?: string | null
  publishedAt?: string | null
  updatedAt?: string | null
  urlPath: string
}

function absoluteUrl(base: string, path: string) {
  if (path.startsWith("http")) return path
  return `${base}${path.startsWith("/") ? path : `/${path}`}`
}

/** Article / NewsArticle для страниц новостей. */
export function ArticleJsonLd({
  title,
  description,
  imageUrl,
  publishedAt,
  updatedAt,
  urlPath,
}: Props) {
  const base = getSiteUrl().replace(/\/$/, "")
  const url = absoluteUrl(base, urlPath)

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: title,
    description: description || undefined,
    image: imageUrl ? [absoluteUrl(base, imageUrl)] : undefined,
    datePublished: publishedAt || undefined,
    dateModified: updatedAt || publishedAt || undefined,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: {
      "@type": "Organization",
      name: "АО «Пластик»",
      url: base,
    },
    publisher: {
      "@type": "Organization",
      name: "АО «Пластик»",
      url: base,
      logo: {
        "@type": "ImageObject",
        url: `${base}/images/logo123.png`,
      },
    },
    inLanguage: "ru-RU",
  }

  return <JsonLd data={data} />
}
