import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const ADMIN_PASSWORD = "admin123"

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json()

    if (password === ADMIN_PASSWORD) {
      // Создаем сессию через cookie
      const cookieStore = await cookies()
      cookieStore.set("admin_session", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 часа
        path: "/",
      })

      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false, error: "Неверный пароль" }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: "Ошибка сервера" }, { status: 500 })
  }
}

export async function DELETE() {
  // Выход из админки
  const cookieStore = await cookies()
  cookieStore.delete("admin_session")

  return NextResponse.json({ success: true })
}

