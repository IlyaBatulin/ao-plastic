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
  const isLoginPage = pathname === "/login"

  // Проверка доступа к сайту (для всех страниц кроме исключений)
  if (!isStaticFile && !isApiRoute && !isLoginPage) {
    const siteAuth = request.cookies.get("site_auth")

    if (!siteAuth || siteAuth.value !== "authenticated") {
      // Сохраняем URL для редиректа после входа
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("return", pathname)
      return NextResponse.redirect(loginUrl)
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

