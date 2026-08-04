import { NextRequest, NextResponse } from "next/server"
import { createPreviewSession, CUSTOMER_PREVIEW_COOKIE, validatePreviewCredentials } from "@/lib/customer-preview"

export async function POST(request: NextRequest) {
  const body = await request.json()
  if (!validatePreviewCredentials(String(body.login || ""), String(body.password || ""))) {
    return NextResponse.json({ error: "Неверные данные" }, { status: 401 })
  }
  const response = NextResponse.json({ ok: true })
  response.cookies.set(CUSTOMER_PREVIEW_COOKIE, createPreviewSession(), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 28800 })
  return response
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set(CUSTOMER_PREVIEW_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 })
  return response
}
