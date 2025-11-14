import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/utils/supabase/server"
import { isAdminAuthenticated } from "@/lib/admin-auth"

export async function GET() {
  const isAuthenticated = await isAdminAuthenticated()
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from("rfp_requests")
      .select("*")
      .order("sort", { ascending: true })
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error: any) {
    console.error("Ошибка загрузки запросов:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const isAuthenticated = await isAdminAuthenticated()
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const supabase = createServiceClient()

    const { data, error } = await supabase
      .from("rfp_requests")
      .insert({
        request_number: body.request_number,
        title: body.title,
        description: body.description || null,
        details: body.details || null,
        deadline: body.deadline || null,
        customer: body.customer || "АО «Пластик»",
        is_active: body.is_active !== undefined ? body.is_active : true,
        sort: body.sort || 0,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Ошибка создания запроса:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

