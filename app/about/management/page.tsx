import { notFound } from "next/navigation"

// Временно скрыта страница «Руководство» — при прямом заходе показываем 404
export default function ManagementPage() {
  notFound()
}
