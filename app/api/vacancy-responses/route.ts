import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/utils/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const supabase = createServiceClient()

    // Валидация
    if (!body.vacancy_id || !body.email) {
      return NextResponse.json({ error: "vacancy_id и email обязательны" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("vacancy_responses")
      .insert({
        vacancy_id: body.vacancy_id,
        company_name: body.company_name || null,
        email: body.email,
        phone: body.phone || null,
        message: body.message || null,
        resume_url: body.resume_url || null,
        status: "new",
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error("Ошибка сохранения ответа на вакансию:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

