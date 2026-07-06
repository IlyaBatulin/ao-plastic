import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/utils/supabase/server"
import { hasAdminSectionAccess } from "@/lib/admin-auth"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await hasAdminSectionAccess("subcategories"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const { id } = await params
    const supabase = createServiceClient()
    
    const { data, error } = await supabase
      .from("subcategories")
      .select(`
        *,
        category:categories(id, name, slug)
      `)
      .eq("id", id)
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Ошибка загрузки подкатегории:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await hasAdminSectionAccess("subcategories"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const { id } = await params
    const body = await req.json()
    const supabase = createServiceClient()

    const { data, error } = await supabase
      .from("subcategories")
      .update({
        name: body.name,
        slug: body.slug || id,
        category_id: body.category_id,
        description: body.description || null,
        sort: body.sort || 0,
        is_active: body.is_active !== undefined ? body.is_active : true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select(`
        *,
        category:categories(id, name, slug)
      `)
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Ошибка обновления подкатегории:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await hasAdminSectionAccess("subcategories"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const { id } = await params
    const supabase = createServiceClient()

    const { error } = await supabase
      .from("subcategories")
      .delete()
      .eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Ошибка удаления подкатегории:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

