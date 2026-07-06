import type { Metadata } from "next"
import { pageOpenGraph } from "@/lib/seo/page-metadata"

export const metadata: Metadata = {
  title: "Дилеры и партнёры",
  description:
    "Региональные дилеры и склады АО «Пластик»: партнёры по продаже АБС, полистирола и полимерной продукции в России.",
  alternates: { canonical: "/dealers" },
  openGraph: pageOpenGraph({
    title: "Дилеры и партнёры",
    description:
      "Региональные дилеры и склады АО «Пластик»: партнёры по продаже АБС, полистирола и полимерной продукции в России.",
    path: "/dealers",
  }),
}

export default function DealersLayout({ children }: { children: React.ReactNode }) {
  return children
}
