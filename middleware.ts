import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

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

    if (isBot) {
      return new NextResponse("Access Denied", { status: 403 })
    }
  }

  // Защита всех /admin роутов кроме страницы входа
  if (pathname.startsWith("/admin") && pathname !== "/admin") {
    const adminSession = request.cookies.get("admin_session")

    if (!adminSession || adminSession.value !== "authenticated") {
      return NextResponse.redirect(new URL("/admin", request.url))
    }
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

