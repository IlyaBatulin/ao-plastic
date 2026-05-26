import type { Metadata } from "next"
import { PublicationsPageClient } from "./publications-page-client"

export const metadata: Metadata = {
  title: "Публикации в СМИ",
  description:
    "Публикации о АО «Пластик» в СМИ: отраслевые материалы, интервью и статьи о производстве полимеров.",
  alternates: { canonical: "/about/publications" },
}

export default function PublicationsPage() {
  return <PublicationsPageClient />
}
