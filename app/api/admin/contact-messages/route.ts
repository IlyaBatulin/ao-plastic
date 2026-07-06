import { NextResponse } from "next/server"
import { createServiceClient } from "@/utils/supabase/server"
import { hasAdminSectionAccess } from "@/lib/admin-auth"

export async function GET() {
  if (!(await hasAdminSectionAccess("contact-messages"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error: any) {
    console.error("Ошибка загрузки сообщений:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

