import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import {
  isRateLimited,
  getBlockedUntil,
  recordFailedAttempt,
  clearAttempts,
} from "@/lib/admin-rate-limit"
import { createSessionToken, COOKIE_NAME } from "@/lib/admin-session"

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || ""

export async function POST(req: NextRequest) {
  try {
    if (!ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, error: "Сервер не настроен" },
        { status: 500 }
      )
    }

    // Защита от перебора пароля
    if (isRateLimited(req)) {
      const blockedUntil = getBlockedUntil(req)
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

    const { password } = await req.json()

    if (password === ADMIN_PASSWORD) {
      clearAttempts(req)

      const token = createSessionToken()
      const cookieStore = await cookies()
      cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 4 * 60 * 60, // 4 часа
        path: "/",
      })

      return NextResponse.json({ success: true })
    } else {
      recordFailedAttempt(req)
      return NextResponse.json({ success: false, error: "Неверный пароль" }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: "Ошибка сервера" }, { status: 500 })
  }
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
  return NextResponse.json({ success: true })
}

