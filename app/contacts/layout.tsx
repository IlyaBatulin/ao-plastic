import type { Metadata } from "next"
import { localizePageMetadata } from "@/lib/seo/localized-metadata"
import { pageOpenGraph } from "@/lib/seo/page-metadata"

const originalMetadata: Metadata = {
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

export async function generateMetadata(): Promise<Metadata> {
  return localizePageMetadata(originalMetadata, "/contacts")
}

export default function ContactsLayout({ children }: { children: React.ReactNode }) {
  return children
}
