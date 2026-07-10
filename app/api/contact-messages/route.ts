import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/utils/supabase/server"
import {
  asString,
  asOptionalString,
  checkRateLimit,
  isBodyTooLarge,
  isValidEmail,
  rateLimitedResponse,
  readJsonBody,
} from "@/lib/form-guard"

export async function POST(req: NextRequest) {
  try {
    if (isBodyTooLarge(req)) {
      return NextResponse.json({ error: "Слишком большой запрос" }, { status: 413 })
    }

    const limit = checkRateLimit(req, "contact", 5)
    if (!limit.ok) return rateLimitedResponse(limit.retryAfter)

    const body = await readJsonBody(req)
    if (!body) {
      return NextResponse.json({ error: "Некорректный формат запроса" }, { status: 400 })
    }

    // Валидация
    const source = typeof body.source === "string" ? body.source : ""
    if (!["contacts", "homepage"].includes(source)) {
      return NextResponse.json({ error: "source должен быть 'contacts' или 'homepage'" }, { status: 400 })
    }

    const name = asString(body.name, 200)
    const email = asString(body.email, 254)
    const message = asString(body.message, 5000)
    const phone = asOptionalString(body.phone, 50)

    if (!name || !email || !message) {
      return NextResponse.json({ error: "name, email и message обязательны" }, { status: 400 })
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Некорректный email" }, { status: 400 })
    }
    if (phone === undefined) {
      return NextResponse.json({ error: "Некорректный телефон" }, { status: 400 })
    }

    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from("contact_messages")
      .insert({ source, name, email, phone, message, status: "new" })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error("Ошибка сохранения сообщения:", error)
    return NextResponse.json({ error: "Не удалось сохранить сообщение" }, { status: 500 })
  }
}
