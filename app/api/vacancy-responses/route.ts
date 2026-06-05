import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/utils/supabase/server"
import {
  asString,
  asOptionalString,
  checkRateLimit,
  isBodyTooLarge,
  isValidEmail,
  rateLimitedResponse,
} from "@/lib/form-guard"

export async function POST(req: NextRequest) {
  try {
    if (isBodyTooLarge(req)) {
      return NextResponse.json({ error: "Слишком большой запрос" }, { status: 413 })
    }

    const limit = checkRateLimit(req, "vacancy", 5)
    if (!limit.ok) return rateLimitedResponse(limit.retryAfter)

    const body = await req.json()

    const email = asString(body.email, 254)
    const companyName = asOptionalString(body.company_name, 200)
    const phone = asOptionalString(body.phone, 50)
    const message = asOptionalString(body.message, 5000)
    const resumeUrl = asOptionalString(body.resume_url, 1000)

    if (!body.vacancy_id || !email) {
      return NextResponse.json({ error: "vacancy_id и email обязательны" }, { status: 400 })
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Некорректный email" }, { status: 400 })
    }
    if (companyName === undefined || phone === undefined || message === undefined || resumeUrl === undefined) {
      return NextResponse.json({ error: "Некорректные данные формы" }, { status: 400 })
    }

    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from("vacancy_responses")
      .insert({
        vacancy_id: body.vacancy_id,
        company_name: companyName,
        email,
        phone,
        message,
        resume_url: resumeUrl,
        status: "new",
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error("Ошибка сохранения ответа на вакансию:", error)
    return NextResponse.json({ error: "Не удалось сохранить ответ" }, { status: 500 })
  }
}
