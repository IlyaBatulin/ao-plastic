/**
 * Базовый URL сайта для sitemap, robots и metadata (Open Graph).
 * Задайте в продакшене: NEXT_PUBLIC_SITE_URL=https://ваш-домен.ru
 */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (fromEnv) {
    try {
      const url = new URL(fromEnv)
      if (["https:", "http:"].includes(url.protocol) &&
          !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)) {
        return url.origin
      }
    } catch {
      // A malformed deployment setting must not leak into canonical URLs.
    }
  }
  return "https://aoplastic.com"
}

/** Preview/password-protected deployments must not compete with the public site. */
export function isIndexingAllowed(): boolean {
  return process.env.NODE_ENV === "production" &&
    !process.env.SITE_PASSWORD &&
    process.env.SITE_NOINDEX !== "1" &&
    (!process.env.VERCEL_ENV || process.env.VERCEL_ENV === "production")
}
