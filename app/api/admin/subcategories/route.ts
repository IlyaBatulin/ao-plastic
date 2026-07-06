import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/utils/supabase/server"
import { hasAdminSectionAccess } from "@/lib/admin-auth"

export async function GET(req: NextRequest) {
  if (!(await hasAdminSectionAccess("subcategories"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const supabase = createServiceClient()
    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get("category_id")
    
    let query = supabase
      .from("subcategories")
      .select(`
        *,
        category:categories(id, name, slug)
      `)
      .order("sort", { ascending: true })
      .order("created_at", { ascending: false })

    if (categoryId) {
      query = query.eq("category_id", categoryId)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error: any) {
    console.error("Ошибка загрузки подкатегорий:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!(await hasAdminSectionAccess("subcategories"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const body = await req.json()
    const supabase = createServiceClient()

    if (!body.category_id) {
      return NextResponse.json({ error: "category_id обязателен" }, { status: 400 })
    }

    // Генерируем slug из названия, если не указан
    let slug = body.slug || body.name
      .toLowerCase()
      .replace(/[^a-zа-я0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")

    const { data, error } = await supabase
      .from("subcategories")
      .insert({
        id: body.id || `${body.category_id}-${slug}`,
        category_id: body.category_id,
        slug: slug,
        name: body.name,
        description: body.description || null,
        sort: body.sort || 0,
        is_active: body.is_active !== undefined ? body.is_active : true,
      })
      .select(`
        *,
        category:categories(id, name, slug)
      `)
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Ошибка создания подкатегории:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

