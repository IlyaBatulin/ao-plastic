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

    const limit = checkRateLimit(req, "rfp", 5)
    if (!limit.ok) return rateLimitedResponse(limit.retryAfter)

    const body = await readJsonBody(req)
    if (!body) {
      return NextResponse.json({ error: "Некорректный формат запроса" }, { status: 400 })
    }

    const companyName = asString(body.company_name, 200)
    const email = asString(body.email, 254)
    const phone = asOptionalString(body.phone, 50)
    const message = asOptionalString(body.message, 5000)
    const proposalUrl = asOptionalString(body.proposal_url, 1000)

    const rfpRequestId =
      typeof body.rfp_request_id === "string" || typeof body.rfp_request_id === "number"
        ? body.rfp_request_id
        : null

    if (!rfpRequestId || !companyName || !email) {
      return NextResponse.json({ error: "rfp_request_id, company_name и email обязательны" }, { status: 400 })
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Некорректный email" }, { status: 400 })
    }
    if (phone === undefined || message === undefined || proposalUrl === undefined) {
      return NextResponse.json({ error: "Некорректные данные формы" }, { status: 400 })
    }

    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from("rfp_responses")
      .insert({
        rfp_request_id: rfpRequestId,
        company_name: companyName,
        email,
        phone,
        message,
        proposal_url: proposalUrl,
        status: "new",
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error("Ошибка сохранения ответа на запрос:", error)
    return NextResponse.json({ error: "Не удалось сохранить ответ" }, { status: 500 })
  }
}
