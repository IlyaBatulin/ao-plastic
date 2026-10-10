import { localizePageMetadata } from "@/lib/seo/localized-metadata"
import type { Metadata } from "next"
import { PublicationsPageClient } from "./publications-page-client"
import { pageOpenGraph } from "@/lib/seo/page-metadata"

const originalMetadata: Metadata = {
  title: "Публикации в СМИ",
  description:
    "Публикации о АО «Пластик» в СМИ: отраслевые материалы, интервью и статьи о производстве полимеров.",
  alternates: { canonical: "/about/publications" },
  openGraph: pageOpenGraph({
    title: "Публикации в СМИ",
    description:
      "Публикации о АО «Пластик» в СМИ: отраслевые материалы, интервью и статьи о производстве полимеров.",
    path: "/about/publications",
  }),
}

export async function generateMetadata(): Promise<Metadata> {
  return localizePageMetadata(originalMetadata, "/about/publications")
}

export default function PublicationsPage() {
  return <PublicationsPageClient />
}
