import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const SITE_PASSWORD = process.env.SITE_PASSWORD || ""
const SITE_AUTH_COOKIE = "site_auth"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 дней

export async function POST(request: NextRequest) {
  try {
    if (!SITE_PASSWORD) {
      return NextResponse.json(
        { success: false, error: "Сервер не настроен" },
        { status: 500 }
      )
    }

    const { password } = await request.json()

    if (password === SITE_PASSWORD) {
      const response = NextResponse.json({ success: true })

      // Устанавливаем cookie с аутентификацией
      response.cookies.set(SITE_AUTH_COOKIE, "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: COOKIE_MAX_AGE,
        path: "/",
      })

      return response
    } else {
      return NextResponse.json(
        { success: false, error: "Неверный пароль" },
        { status: 401 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Ошибка сервера" },
      { status: 500 }
    )
  }
}

