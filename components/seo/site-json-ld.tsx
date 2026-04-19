import { getSiteUrl } from "@/lib/site"
import { JsonLd } from "@/components/seo/json-ld"

/** Organization + WebSite для всего домена. */
export function SiteJsonLd() {
  const base = getSiteUrl()
  const graph = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "АО «Пластик»",
      alternateName: ["Пластик Узловая", "AO Plastic"],
      url: base,
      logo: `${base}/images/logo.png`,
      description:
        "Производство АБС-пластиков, полистирола, стирола и пластиковых изделий. Завод в г. Узловая, Тульская область.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Узловая",
        addressRegion: "Тульская область",
        streetAddress: "ул. Тульская, 1",
        postalCode: "301600",
        addressCountry: "RU",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "АО «Пластик»",
      url: base,
      inLanguage: "ru-RU",
      publisher: { "@type": "Organization", name: "АО «Пластик»", url: base },
    },
  ]

  return <JsonLd data={{ "@context": "https://schema.org", "@graph": graph }} />
}
