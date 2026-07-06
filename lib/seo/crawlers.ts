/**
 * Классификация User-Agent для SEO: поисковые роботы и боты превью соцсетей.
 * Используется в middleware, чтобы не блокировать индексацию и шаринг ссылок.
 */

const SEARCH_CRAWLERS = [
  "googlebot",
  "googlebot-image",
  "google-inspectiontool",
  "storebot-google",
  "adsbot-google",
  "mediapartners-google",
  "bingbot",
  "msnbot",
  "slurp",
  "duckduckbot",
  "yandexbot",
  "yandeximages",
  "yandexdirect",
  "yandexmetrika",
  "yandexwebmaster",
  "applebot",
  "petalbot",
  "mail.ru_bot",
  "sogou",
] as const

const SOCIAL_PREVIEW_BOTS = [
  "facebookexternalhit",
  "facebot",
  "twitterbot",
  "linkedinbot",
  "whatsapp",
  "telegrambot",
  "slackbot",
  "discordbot",
  "vkshare",
  "pinterestbot",
] as const

export function isSearchCrawler(userAgent: string): boolean {
  const ua = userAgent.toLowerCase()
  return SEARCH_CRAWLERS.some((token) => ua.includes(token))
}

/** Боты, которые запрашивают OG-теги при шаринге ссылки в соцсетях/мессенджерах. */
export function isSocialPreviewBot(userAgent: string): boolean {
  const ua = userAgent.toLowerCase()
  return SOCIAL_PREVIEW_BOTS.some((token) => ua.includes(token))
}

/** Поисковик или бот превью — не блокировать и не требовать SITE_PASSWORD. */
export function isSeoBot(userAgent: string): boolean {
  return isSearchCrawler(userAgent) || isSocialPreviewBot(userAgent)
}
