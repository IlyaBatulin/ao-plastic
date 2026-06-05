import type { Metadata } from "next"
import { SuppliersPageClient } from "./suppliers-page-client"
import { type NextPageProps, unwrapNextPageProps } from "@/lib/next-page-props"

export const metadata: Metadata = {
  title: "Поставщикам",
  description:
    "Информация для поставщиков сырья и услуг АО «Пластик»: сотрудничество, закупки, требования к контрагентам.",
  alternates: { canonical: "/suppliers" },
}

export default async function SuppliersPage(props: NextPageProps) {
  await unwrapNextPageProps(props)
  return <SuppliersPageClient />
}
