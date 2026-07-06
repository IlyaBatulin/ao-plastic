import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/utils/supabase/server"
import { hasAdminSectionAccess } from "@/lib/admin-auth"

export async function GET() {
  if (!(await hasAdminSectionAccess("vacancies"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from("vacancies")
      .select("*")
      .order("sort", { ascending: true })
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error: any) {
    console.error("Ошибка загрузки вакансий:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!(await hasAdminSectionAccess("vacancies"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const body = await req.json()
    const supabase = createServiceClient()

    const { data, error } = await supabase
      .from("vacancies")
      .insert({
        title: body.title,
        department: body.department || null,
        location: body.location || null,
        type: body.type || null,
        description: body.description || null,
        requirements: body.requirements || null,
        responsibilities: body.responsibilities || null,
        conditions: body.conditions || null,
        salary: body.salary || null,
        is_active: body.is_active !== undefined ? body.is_active : true,
        sort: body.sort || 0,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Ошибка создания вакансии:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

