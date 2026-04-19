import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Контакты",
  description:
    "Контакты АО «Пластик»: завод в Узловой, офис продаж в Москве, телефоны отделов, форма обратной связи.",
  alternates: { canonical: "/contacts" },
}

export default function ContactsLayout({ children }: { children: React.ReactNode }) {
  return children
}
