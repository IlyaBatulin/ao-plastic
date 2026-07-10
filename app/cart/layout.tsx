import type { Metadata } from "next"
import { cookies } from "next/headers"
import { LANG_COOKIE, parseLanguage } from "@/lib/language"

// Метаданные корзины локализуются по куке lang — тем же способом,
// что и переводы в корневом layout (импорт локали на сервере).
export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()
  const lang = parseLanguage(cookieStore.get(LANG_COOKIE)?.value)
  const dict = (
    lang === "en"
      ? (await import("@/public/locales/en.json")).default
      : (await import("@/public/locales/ru.json")).default
  ) as { cartPage: { metaTitle: string; metaDescription: string } }

  return {
    title: dict.cartPage.metaTitle,
    description: dict.cartPage.metaDescription,
    robots: { index: false, follow: false },
  }
}

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children
}
