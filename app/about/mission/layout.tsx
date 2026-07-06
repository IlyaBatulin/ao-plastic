import type { Metadata } from "next"
import { pageOpenGraph } from "@/lib/seo/page-metadata"

export const metadata: Metadata = {
  title: "Миссия и ценности",
  description:
    "Миссия и ценности АО «Пластик»: устойчивое развитие, качество полимерной продукции и ответственность перед клиентами.",
  alternates: { canonical: "/about/mission" },
  openGraph: pageOpenGraph({
    title: "Миссия и ценности",
    description:
      "Миссия и ценности АО «Пластик»: устойчивое развитие, качество полимерной продукции и ответственность перед клиентами.",
    path: "/about/mission",
  }),
}

export default function MissionLayout({ children }: { children: React.ReactNode }) {
  return children
}
