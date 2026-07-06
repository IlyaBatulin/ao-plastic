import { NextResponse } from "next/server"
import { createServiceClient } from "@/utils/supabase/server"
import { hasAdminSectionAccess } from "@/lib/admin-auth"

export async function GET() {
  if (!(await hasAdminSectionAccess("rfp-responses"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from("rfp_responses")
      .select(`
        *,
        rfp_request:rfp_requests(id, request_number, title)
      `)
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error: any) {
    console.error("Ошибка загрузки ответов:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

