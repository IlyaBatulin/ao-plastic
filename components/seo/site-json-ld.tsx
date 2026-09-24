import { getSiteUrl } from "@/lib/site"
import { JsonLd } from "@/components/seo/json-ld"
import { COMPANY_REQUISITES } from "@/lib/company-requisites"

/** Organization + WebSite + контакты для всего домена. */
export function SiteJsonLd() {
  const base = getSiteUrl()
  const phone = COMPANY_REQUISITES.phone.replace(/\D/g, "")
  const graph = [
    {
      "@context": "https://schema.org",
      "@type": ["Organization", "Corporation"],
      "@id": `${base}/#organization`,
      name: "АО «Пластик»",
      legalName: COMPANY_REQUISITES.fullName,
      alternateName: ["Пластик Узловая", "AO Plastic", "АО Пластик"],
      url: base,
      logo: `${base}/images/logo123.png`,
      image: `${base}/images/logo123.png`,
      description:
        "Производство АБС-пластиков, полистирола, стирола и пластиковых изделий. Завод в г. Узловая, Тульская область.",
      foundingDate: "1959",
      taxID: COMPANY_REQUISITES.inn,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Узловая",
        addressRegion: "Тульская область",
        streetAddress: "ул. Тульская, 1",
        postalCode: "301600",
        addressCountry: "RU",
      },
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: `+${phone}`,
          email: COMPANY_REQUISITES.email,
          contactType: "customer service",
          areaServed: "RU",
          availableLanguage: ["Russian", "English"],
        },
        {
          "@type": "ContactPoint",
          telephone: `+${phone}`,
          email: COMPANY_REQUISITES.salesEmail,
          contactType: "sales",
          areaServed: "RU",
        },
      ],
      sameAs: [COMPANY_REQUISITES.website],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${base}/#website`,
      name: "АО «Пластик»",
      alternateName: "АО Пластик — производство полимеров",
      url: base,
      inLanguage: "ru-RU",
      publisher: { "@id": `${base}/#organization` },
    },
  ]

  return <JsonLd data={{ "@context": "https://schema.org", "@graph": graph }} />
}
