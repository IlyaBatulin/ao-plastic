import type { Metadata } from "next"
import { localizePageMetadata } from "@/lib/seo/localized-metadata"
import { pageOpenGraph } from "@/lib/seo/page-metadata"

const originalMetadata: Metadata = {
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

export async function generateMetadata(): Promise<Metadata> {
  return localizePageMetadata(originalMetadata, "/dealers")
}

export default function DealersLayout({ children }: { children: React.ReactNode }) {
  return children
}
