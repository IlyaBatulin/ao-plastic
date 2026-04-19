import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Дилеры и партнёры",
  description:
    "Региональные дилеры и склады АО «Пластик»: партнёры по продаже АБС, полистирола и полимерной продукции в России.",
  alternates: { canonical: "/dealers" },
}

export default function DealersLayout({ children }: { children: React.ReactNode }) {
  return children
}
