/**
 * Базовый URL сайта для sitemap, robots и metadata (Open Graph).
 * Задайте в продакшене: NEXT_PUBLIC_SITE_URL=https://ваш-домен.ru
 */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (fromEnv) {
    return fromEnv.replace(/\/$/, "")
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`
  }
  return "http://localhost:3000"
}
