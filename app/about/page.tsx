import type { Metadata } from "next"
import { AboutPageClient } from "./about-page-client"

export const metadata: Metadata = {
  title: "О компании",
  description:
    "АО «Пластик» с 1959 года: история завода в Узловой, масштабы производства полимеров и пластмасс, ценности компании, география поставок АБС, полистирола и изделий по России и на экспорт.",
  alternates: { canonical: "/about" },
}

export default function AboutPage() {
  return <AboutPageClient />
}
