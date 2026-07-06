import type { Metadata } from "next"
import { PasfPageClient } from "./pasf-page-client"
import { pageOpenGraph } from "@/lib/seo/page-metadata"

export const metadata: Metadata = {
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

export default function PasfPage() {
  return <PasfPageClient />
}
