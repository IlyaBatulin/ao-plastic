import { localizePageMetadata } from "@/lib/seo/localized-metadata"
import type { Metadata } from "next"
import { AboutPageClient } from "./about-page-client"
import { type NextPageProps, unwrapNextPageProps } from "@/lib/next-page-props"
import { pageOpenGraph } from "@/lib/seo/page-metadata"

const originalMetadata: Metadata = {
  title: "О компании",
  description:
    "АО «Пластик» с 1959 года: история завода в Узловой, масштабы производства полимеров и пластмасс, ценности компании, география поставок АБС, полистирола и изделий по России и на экспорт.",
  alternates: { canonical: "/about" },
  openGraph: pageOpenGraph({
    title: "О компании",
    description:
      "АО «Пластик» с 1959 года: история завода в Узловой, масштабы производства полимеров и пластмасс, ценности компании, география поставок АБС, полистирола и изделий по России и на экспорт.",
    path: "/about",
  }),
}

export async function generateMetadata(): Promise<Metadata> {
  return localizePageMetadata(originalMetadata, "/about")
}

export default async function AboutPage(props: NextPageProps) {
  await unwrapNextPageProps(props)
  return <AboutPageClient />
}
