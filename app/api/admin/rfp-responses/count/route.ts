import { NextResponse } from "next/server"
import { createServiceClient } from "@/utils/supabase/server"
import { hasAdminSectionAccess } from "@/lib/admin-auth"

export async function GET() {
  if (!(await hasAdminSectionAccess("rfp-responses"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const supabase = createServiceClient()
    const { count, error } = await supabase
      .from("rfp_responses")
      .select("*", { count: "exact", head: true })
      .eq("status", "new")

    if (error) throw error

    return NextResponse.json({ count: count || 0 })
  } catch (error: any) {
    console.error("Ошибка подсчета ответов:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

