import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/utils/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const supabase = createServiceClient()

    // Валидация
    if (!body.source || !body.name || !body.email || !body.message) {
      return NextResponse.json({ error: "source, name, email и message обязательны" }, { status: 400 })
    }

    // Проверяем, что source является допустимым значением
    if (!['contacts', 'homepage'].includes(body.source)) {
      return NextResponse.json({ error: "source должен быть 'contacts' или 'homepage'" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("contact_messages")
      .insert({
        source: body.source,
        name: body.name,
        email: body.email,
        phone: body.phone || null,
        message: body.message,
        status: "new",
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error("Ошибка сохранения сообщения:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

