import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/utils/supabase/server"
import { hasAdminSectionAccess } from "@/lib/admin-auth"

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await hasAdminSectionAccess("vacancies"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const { id } = await params
    const body = await req.json()
    const supabase = createServiceClient()

    const { data, error } = await supabase
      .from("vacancies")
      .update({
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
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Ошибка обновления вакансии:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await hasAdminSectionAccess("vacancies"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const { id } = await params
    const supabase = createServiceClient()

    const { error } = await supabase.from("vacancies").delete().eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Ошибка удаления вакансии:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

