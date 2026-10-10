import type { Metadata } from "next"
import { getServerLanguage } from "@/lib/server-language"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: await getServerLanguage() === "en" ? "Website access" : "Вход на сайт",
    robots: { index: false, follow: false },
  }
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children
}
