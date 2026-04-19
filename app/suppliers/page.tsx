import type { Metadata } from "next"
import { SuppliersPageClient } from "./suppliers-page-client"

export const metadata: Metadata = {
  title: "Поставщикам",
  description:
    "Информация для поставщиков сырья и услуг АО «Пластик»: сотрудничество, закупки, требования к контрагентам.",
  alternates: { canonical: "/suppliers" },
}

type PageProps = {
  params?: Promise<Record<string, string | string[]>>
  searchParams?: Promise<Record<string, string | string[]>>
}

/**
 * Серверная обёртка: в Next.js 16 params/searchParams приходят как Promise.
 * Обрабатываем их здесь, чтобы в клиентский компонент не попадал Promise
 * (иначе инструменты вроде Cursor/React DevTools при сериализации вызывают ошибку).
 */
export default async function SuppliersPage(props: PageProps) {
  if (props.params) await props.params
  if (props.searchParams) await props.searchParams
  return <SuppliersPageClient />
}
