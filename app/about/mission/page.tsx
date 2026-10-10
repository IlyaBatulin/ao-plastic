import { MissionPageClient } from "./mission-page-client"
import { localizePageMetadata } from "@/lib/seo/localized-metadata"

export async function generateMetadata() {
  return localizePageMetadata({ title: "Миссия и история компании", alternates: { canonical: "/about/mission" } }, "/about/mission")
}

export default function MissionPage() {
  return <MissionPageClient />
}
