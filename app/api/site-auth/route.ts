import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import {
  clearAttempts,
  getBlockedUntil,
  isRateLimited,
  recordFailedAttempt,
} from "@/lib/admin-rate-limit"
import { safeEqual } from "@/lib/admin-session"
import { createSiteSessionToken, SITE_AUTH_COOKIE } from "@/lib/site-session"

const SITE_PASSWORD = process.env.SITE_PASSWORD || ""
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 дней
const RATE_LIMIT_SCOPE = "site-auth"

export async function POST(request: NextRequest) {
  try {
    if (!SITE_PASSWORD) {
      return NextResponse.json(
        { success: false, error: "Сервер не настроен" },
        { status: 500 }
      )
    }

    if (isRateLimited(request, RATE_LIMIT_SCOPE)) {
      const blockedUntil = getBlockedUntil(request, RATE_LIMIT_SCOPE)
      const minutesLeft = blockedUntil
        ? Math.ceil((blockedUntil - Date.now()) / 60000)
        : 15

      return NextResponse.json(
        {
          success: false,
          error: `Слишком много попыток. Попробуйте через ${minutesLeft} мин.`,
        },
        { status: 429 }
      )
    }

    const { password } = await request.json()

    if (typeof password === "string" && password && safeEqual(password, SITE_PASSWORD)) {
      clearAttempts(request, RATE_LIMIT_SCOPE)
      const response = NextResponse.json({ success: true })

      // Подписанный HMAC-токен вместо статичного значения
      response.cookies.set(SITE_AUTH_COOKIE, createSiteSessionToken(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: COOKIE_MAX_AGE,
        path: "/",
      })

      return response
    } else {
      recordFailedAttempt(request, RATE_LIMIT_SCOPE)
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

