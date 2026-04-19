import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const SITE_AUTH_COOKIE = "site_auth"

/** Поисковые роботы: им нужен доступ к страницам и sitemap (иначе сайт не проиндексируется). */
function isAllowedSearchCrawler(userAgent: string): boolean {
  const ua = userAgent.toLowerCase()
  const allow = [
    "googlebot",
    "google-inspectiontool",
    "bingbot",
    "slurp",
    "duckduckbot",
    "yandexbot",
    "yandeximages",
    "yandexmetrika",
    "applebot",
    "petalbot",
  ]
  return allow.some((token) => ua.includes(token))
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

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

  // Временная защита сайта паролем (если задан SITE_PASSWORD в .env)
  const sitePassword = process.env.SITE_PASSWORD
  if (
    sitePassword &&
    !isStaticFile &&
    !isApiRoute &&
    !isRobotsTxt &&
    !isSitemapXml &&
    !isSiteLoginPage
  ) {
    const siteAuth = request.cookies.get(SITE_AUTH_COOKIE)
    const hasSiteAuth = siteAuth?.value === "authenticated"

    if (!hasSiteAuth) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("return", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Блокировка ботов и скраперов
  if (!isStaticFile && !isApiRoute && !isRobotsTxt) {
    const userAgent = request.headers.get("user-agent") || ""
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

    if (isBot && !isAllowedSearchCrawler(userAgent)) {
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
    const adminSession = request.cookies.get("admin_session")
    const hasValidSession =
      adminSession?.value &&
      (adminSession.value === "authenticated" || adminSession.value.includes("."))

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

