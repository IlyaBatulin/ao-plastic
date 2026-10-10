import { localizePageMetadata } from "@/lib/seo/localized-metadata"
import type { Metadata } from "next"
import { PasfPageClient } from "./pasf-page-client"
import { pageOpenGraph } from "@/lib/seo/page-metadata"

const originalMetadata: Metadata = {
  title: "ПАСФ «ПЛАСТИК»",
  description:
    "Профессиональное аварийно-спасательное формирование АО «Пластик»: газоспасательные работы, пожарная безопасность и комплексная защита опасных производственных объектов.",
  alternates: { canonical: "/pasf" },
  openGraph: pageOpenGraph({
    title: "ПАСФ «ПЛАСТИК»",
    description:
      "Профессиональное аварийно-спасательное формирование АО «Пластик»: газоспасательные работы, пожарная безопасность и комплексная защита опасных производственных объектов.",
    path: "/pasf",
  }),
}

export async function generateMetadata(): Promise<Metadata> {
  return localizePageMetadata(originalMetadata, "/pasf")
}

export default function PasfPage() {
  return <PasfPageClient />
}
