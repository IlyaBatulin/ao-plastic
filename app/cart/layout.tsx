import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Корзина",
  description: "Корзина заказа на сайте АО «Пластик».",
  robots: { index: false, follow: false },
}

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children
}
