import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/utils/supabase/server"
import { hasAdminSectionAccess } from "@/lib/admin-auth"

export async function GET() {
  if (!(await hasAdminSectionAccess("management"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const supabase = createServiceClient()
    
    const { data, error } = await supabase
      .from("management_team")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error: any) {
    console.error("Ошибка загрузки руководства:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!(await hasAdminSectionAccess("management"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const body = await req.json()
    const supabase = createServiceClient()

    const { data, error } = await supabase
      .from("management_team")
      .insert({
        full_name: body.full_name,
        position: body.position,
        bio: body.bio || null,
        email: body.email || null,
        phone: body.phone || null,
        image_url: body.image_url || null,
        sort_order: body.sort_order || 0,
        is_active: body.is_active !== undefined ? body.is_active : true,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Ошибка создания руководителя:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
