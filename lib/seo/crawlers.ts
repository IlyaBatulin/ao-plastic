/**
 * Классификация User-Agent для SEO: поисковые роботы и боты превью соцсетей.
 * Используется в middleware, чтобы не блокировать индексацию и шаринг ссылок.
 */

const SEARCH_CRAWLERS = [
  "googlebot",
  "google-inspectiontool",
  "storebot-google",
  "bingbot",
  "msnbot",
  "slurp",
  "duckduckbot",
  "yandexbot",
  "yandeximages",
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

/** Краулеры ИИ-систем — нужны для появления компании в ответах ChatGPT, Claude, Perplexity и т.д. */
const AI_CRAWLERS = [
  "gptbot",
  "chatgpt-user",
  "oai-searchbot",
  "claudebot",
  "anthropic-ai",
  "claude-web",
  "perplexitybot",
  "perplexity-user",
  "google-extended",
  "ccbot",
  "amazonbot",
  "bytespider",
  "youbot",
  "diffbot",
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

/** Краулеры ИИ-сервисов, индексирующие контент для ответов нейросетей. */
export function isAiCrawler(userAgent: string): boolean {
  const ua = userAgent.toLowerCase()
  return AI_CRAWLERS.some((token) => ua.includes(token))
}

/** Поисковик, бот превью или ИИ-краулер — не блокировать и не требовать SITE_PASSWORD. */
export function isSeoBot(userAgent: string): boolean {
  return isSearchCrawler(userAgent) || isSocialPreviewBot(userAgent) || isAiCrawler(userAgent)
}
