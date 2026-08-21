import { NextResponse } from "next/server"
import { createPreviewSession, CUSTOMER_PREVIEW_COOKIE } from "@/lib/customer-preview"

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Недоступно" }, { status: 404 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set(CUSTOMER_PREVIEW_COOKIE, createPreviewSession(), {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
    maxAge: 28800,
  })
  return response
}
