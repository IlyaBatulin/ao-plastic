import type { Metadata } from "next"
import { pageOpenGraph } from "@/lib/seo/page-metadata"

export const metadata: Metadata = {
  title: "Контакты",
  description:
    "Контакты АО «Пластик»: завод в Узловой, офис продаж в Москве, телефоны отделов, форма обратной связи.",
  alternates: { canonical: "/contacts" },
  openGraph: pageOpenGraph({
    title: "Контакты",
    description:
      "Контакты АО «Пластик»: завод в Узловой, офис продаж в Москве, телефоны отделов, форма обратной связи.",
    path: "/contacts",
  }),
}

export default function ContactsLayout({ children }: { children: React.ReactNode }) {
  return children
}
