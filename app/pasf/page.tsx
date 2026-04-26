import type { Metadata } from "next"
import { PasfPageClient } from "./pasf-page-client"

export const metadata: Metadata = {
  title: "ПАСФ «ПЛАСТИК»",
  description:
    "Профессиональное аварийно-спасательное формирование АО «Пластик»: газоспасательные работы, пожарная безопасность и комплексная защита опасных производственных объектов.",
  alternates: { canonical: "/pasf" },
}

export default function PasfPage() {
  return <PasfPageClient />
}
