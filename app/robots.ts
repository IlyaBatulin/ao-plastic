import type { MetadataRoute } from "next"
import { getSiteUrl } from "@/lib/site"

function getDisallowPaths(): string[] {
  // ВАЖНО: /_next/ не блокируем — Google и Яндекс должны загружать JS/CSS,
  // иначе они не смогут отрендерить страницы.
  const paths = [
    "/admin",
    "/api/",
    "/login",
    "/cart",
  ]

  // Секретный путь админки (если задан ADMIN_PATH)
  const adminPath = process.env.ADMIN_PATH?.trim()
  if (adminPath) {
    const normalized = adminPath.startsWith("/") ? adminPath : `/${adminPath}`
    paths.push(normalized)
    paths.push(`${normalized}/`)
  }

  return paths
}

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl()
  const disallow = getDisallowPaths()

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/sitemap.xml"],
        disallow,
      },
      {
        // Яндекс: те же правила + явный доступ к карте сайта
        userAgent: "Yandex",
        allow: ["/", "/sitemap.xml"],
        disallow,
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/sitemap.xml"],
        disallow,
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  }
}
