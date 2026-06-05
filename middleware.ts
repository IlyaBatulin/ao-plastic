import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { isSearchCrawler, isSeoBot } from "@/lib/seo/crawlers"

const SITE_AUTH_COOKIE = "site_auth"
const ADMIN_SESSION_COOKIE = "admin_session"
const CYRILLIC_MAP: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ё: "e",
  ж: "zh",
  з: "z",
  и: "i",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "h",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "sch",
  ъ: "",
  ы: "y",
  ь: "",
  э: "e",
  ю: "yu",
  я: "ya",
}

function transliterate(input: string): string {
  let out = ""
  for (const char of input) {
    const lower = char.toLowerCase()
    out += CYRILLIC_MAP[lower] ?? char
  }
  return out
}

function slugifyPart(input: string): string {
  const transliterated = transliterate(input).toLowerCase().replace(/&/g, " and ")
  const normalized = transliterated
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "")
  return normalized || "file"
}

function normalizeSegment(segment: string): string {
  if (!segment) return segment
  const dot = segment.lastIndexOf(".")
  if (dot <= 0 || dot === segment.length - 1) {
    return slugifyPart(segment)
  }

  const stem = segment.slice(0, dot)
  const extRaw = segment.slice(dot + 1).toLowerCase()
  const ext = extRaw.replace(/[^a-z0-9]/g, "")
  const normalizedStem = slugifyPart(stem)
  return ext ? `${normalizedStem}.${ext}` : normalizedStem
}

function normalizeLegacyAssetPath(pathname: string): string {
  if (!pathname.startsWith("/images/") && !pathname.startsWith("/docs/") && !pathname.startsWith("/videos/")) {
    return pathname
  }

  let decoded = pathname
  try {
    decoded = decodeURIComponent(pathname)
  } catch {
    // Keep original pathname if malformed percent-encoding.
  }

  const parts = decoded.split("/")
  if (parts.length <= 2) return pathname

  const normalizedParts = parts.map((part, idx) => {
    if (idx <= 1 || !part) return part
    return normalizeSegment(part)
  })

  const normalized = normalizedParts.join("/")
  return normalized || pathname
}

function getAdminSessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || ""
}

function decodeBase64Url(value: string): string {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/")
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=")
  return atob(padded)
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
}

function secureCompare(left: string, right: string): boolean {
  if (left.length !== right.length) return false

  let mismatch = 0
  for (let i = 0; i < left.length; i++) {
    mismatch |= left.charCodeAt(i) ^ right.charCodeAt(i)
  }
  return mismatch === 0
}

async function verifyAdminSessionToken(token: string): Promise<boolean> {
  try {
    const secret = getAdminSessionSecret()
    if (!secret) return false

    const [payloadB64, signature] = token.split(".")
    if (!payloadB64 || !signature) return false

    const payload = decodeBase64Url(payloadB64)
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    )
    const expectedSignature = toHex(
      await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload))
    )
    if (!secureCompare(signature, expectedSignature)) return false

    const [expStr] = payload.split(".")
    const exp = Number.parseInt(expStr, 10)
    return Number.isFinite(exp) && Date.now() < exp
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const normalizedAssetPath = normalizeLegacyAssetPath(pathname)
  if (normalizedAssetPath !== pathname) {
    const rewriteUrl = request.nextUrl.clone()
    rewriteUrl.pathname = normalizedAssetPath
    return NextResponse.rewrite(rewriteUrl)
  }

  // Исключаем статические файлы, API routes и страницу входа
  const isStaticFile = pathname.startsWith("/_next") || 
                       pathname.startsWith("/favicon") ||
                       pathname.startsWith("/images/") ||
                       pathname.startsWith("/videos/") ||
                       pathname.startsWith("/locales/") ||
                       pathname.startsWith("/uploads/") ||
                       pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|woff|woff2|ttf|eot|pdf|mp4)$/)
  
  const isApiRoute = pathname.startsWith("/api")
  const isRobotsTxt = pathname === "/robots.txt"
  const isSitemapXml = pathname === "/sitemap.xml"
  const isSiteLoginPage = pathname === "/login"
  const userAgent = request.headers.get("user-agent") || ""
  const isSearchBot = isSearchCrawler(userAgent)

  // Временная защита сайта паролем (если задан SITE_PASSWORD в .env).
  // Поисковые роботы пропускаем — иначе сайт не проиндексируется в Google/Яндекс.
  const sitePassword = process.env.SITE_PASSWORD
  if (
    sitePassword &&
    !isStaticFile &&
    !isApiRoute &&
    !isRobotsTxt &&
    !isSitemapXml &&
    !isSiteLoginPage &&
    !isSearchBot
  ) {
    const siteAuth = request.cookies.get(SITE_AUTH_COOKIE)
    const hasSiteAuth = siteAuth?.value === "authenticated"

    if (!hasSiteAuth) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("return", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Блокировка ботов и скраперов (поисковики, sitemap и боты превью соцсетей — пропускаем)
  if (!isStaticFile && !isApiRoute && !isRobotsTxt && !isSitemapXml) {
    const botPatterns = [
      /bot/i,
      /crawler/i,
      /spider/i,
      /scraper/i,
      /facebookexternalhit/i,
      /twitterbot/i,
      /linkedinbot/i,
      /whatsapp/i,
      /telegrambot/i,
      /bingbot/i,
      /googlebot/i,
      /yandex/i,
      /baiduspider/i,
      /duckduckbot/i,
      /slurp/i,
      /ia_archiver/i,
      /archive\.org/i,
      /semrush/i,
      /ahrefs/i,
      /mj12bot/i,
      /dotbot/i,
      /blexbot/i,
      /petalbot/i,
    ]

    const isBot = botPatterns.some((pattern) => pattern.test(userAgent))

    if (isBot && !isSeoBot(userAgent)) {
      return new NextResponse("Access Denied", { status: 403 })
    }
  }

  // Секретный путь к админке (если задан ADMIN_PATH в .env)
  const adminPath = process.env.ADMIN_PATH
  const adminBase = adminPath ? (adminPath.startsWith("/") ? adminPath : `/${adminPath}`) : "/admin"
  const isAdminRoute = pathname.startsWith("/admin") || (adminPath && pathname.startsWith(adminBase))
  const isLoginPage = pathname === "/admin" || pathname === adminBase

  // Защита админ-роутов: проверка сессии (кроме страницы входа)
  if (isAdminRoute && !isLoginPage) {
    const adminSession = request.cookies.get(ADMIN_SESSION_COOKIE)
    const hasValidSession = adminSession?.value
      ? await verifyAdminSessionToken(adminSession.value)
      : false

    if (!hasValidSession) {
      return NextResponse.redirect(new URL(adminBase, request.url))
    }
  }

  // Скрываем стандартный /admin, если задан секретный путь
  if (adminPath && pathname.startsWith("/admin")) {
    return new NextResponse("Not Found", { status: 404 })
  }

  // Rewrite секретного пути на /admin
  if (adminPath && pathname.startsWith(adminBase)) {
    const internalPath = pathname.replace(adminBase, "/admin") || "/admin"
    return NextResponse.rewrite(new URL(internalPath, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}

