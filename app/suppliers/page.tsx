import { SuppliersPageClient } from "./suppliers-page-client"

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
