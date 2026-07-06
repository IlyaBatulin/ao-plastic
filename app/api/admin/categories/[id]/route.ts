import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/utils/supabase/server"
import { hasAdminSectionAccess } from "@/lib/admin-auth"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await hasAdminSectionAccess("categories"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const { id } = await params
    const supabase = createServiceClient()
    
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id", id)
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Ошибка загрузки категории:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await hasAdminSectionAccess("categories"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const { id } = await params
    const body = await req.json()
    const supabase = createServiceClient()

    const { data, error } = await supabase
      .from("categories")
      .update({
        name: body.name,
        slug: body.slug || id,
        description: body.description || null,
        image: body.image || null,
        sort: body.sort || 0,
        is_active: body.is_active !== undefined ? body.is_active : true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Ошибка обновления категории:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await hasAdminSectionAccess("categories"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const { id } = await params
    const supabase = createServiceClient()

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Ошибка удаления категории:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

