import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/utils/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const supabase = createServiceClient()

    // Валидация
    if (!body.rfp_request_id || !body.company_name || !body.email) {
      return NextResponse.json({ error: "rfp_request_id, company_name и email обязательны" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("rfp_responses")
      .insert({
        rfp_request_id: body.rfp_request_id,
        company_name: body.company_name,
        email: body.email,
        phone: body.phone || null,
        message: body.message || null,
        proposal_url: body.proposal_url || null,
        status: "new",
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error("Ошибка сохранения ответа на запрос:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

