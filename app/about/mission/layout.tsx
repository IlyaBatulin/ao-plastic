import type { Metadata } from "next"
import { pageOpenGraph } from "@/lib/seo/page-metadata"

export const metadata: Metadata = {
  title: "Миссия и история компании",
  description:
    "Миссия и история АО «Пластик»: ключевые этапы развития предприятия с 1964 года, производство полимеров и совершенствование системы качества.",
  alternates: { canonical: "/about/mission" },
  openGraph: pageOpenGraph({
    title: "Миссия и история компании",
    description:
      "Миссия и история АО «Пластик»: ключевые этапы развития предприятия с 1964 года, производство полимеров и совершенствование системы качества.",
    path: "/about/mission",
  }),
}

export default function MissionLayout({ children }: { children: React.ReactNode }) {
  return <div className="history-theme">{children}</div>
}
