import { NextResponse } from "next/server"

// Проверка пароля на сервере: используем SITE_PASSWORD или NEXT_PUBLIC_SITE_PASSWORD
const EXPECTED_PASSWORD =
  process.env.SITE_PASSWORD || process.env.NEXT_PUBLIC_SITE_PASSWORD || "plastic2025"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const password = typeof body?.password === "string" ? body.password.trim() : ""

    if (!password) {
      return NextResponse.json({ success: false }, { status: 400 })
    }

    if (password === EXPECTED_PASSWORD) {
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false }, { status: 401 })
  } catch {
    return NextResponse.json({ success: false }, { status: 400 })
  }
}
