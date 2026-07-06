import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import {
  isRateLimited,
  getBlockedUntil,
  recordFailedAttempt,
  clearAttempts,
} from "@/lib/admin-rate-limit"
import { createSessionToken, safeEqual, COOKIE_NAME } from "@/lib/admin-session"
import { ADMIN_ROLE_LABELS, type AdminRole } from "@/lib/admin-roles"

/** Пароль каждой роли задаётся своей env-переменной. */
function getRolePasswords(): Array<{ role: AdminRole; password: string }> {
  const entries: Array<{ role: AdminRole; password: string }> = [
    { role: "director", password: process.env.ADMIN_PASSWORD || "" },
    { role: "sales", password: process.env.ADMIN_SALES_PASSWORD || "" },
    { role: "marketing", password: process.env.ADMIN_MARKETING_PASSWORD || "" },
  ]
  return entries.filter((entry) => entry.password.length > 0)
}

export async function POST(req: NextRequest) {
  try {
    const rolePasswords = getRolePasswords()
    if (rolePasswords.length === 0) {
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
    if (typeof password !== "string" || !password) {
      recordFailedAttempt(req)
      return NextResponse.json({ success: false, error: "Неверный пароль" }, { status: 401 })
    }

    // Сравниваем со всеми паролями (постоянное время, без раннего выхода)
    let matchedRole: AdminRole | null = null
    for (const entry of rolePasswords) {
      if (safeEqual(password, entry.password)) {
        matchedRole = entry.role
      }
    }

    if (matchedRole) {
      clearAttempts(req)

      const token = createSessionToken(matchedRole)
      const cookieStore = await cookies()
      cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 4 * 60 * 60, // 4 часа
        path: "/",
      })

      return NextResponse.json({
        success: true,
        role: matchedRole,
        roleLabel: ADMIN_ROLE_LABELS[matchedRole],
      })
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
