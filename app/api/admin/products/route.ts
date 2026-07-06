import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/utils/supabase/server"
import { hasAdminSectionAccess } from "@/lib/admin-auth"

export async function GET() {
  if (!(await hasAdminSectionAccess("products"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const supabase = createServiceClient()
    
    // Получаем все товары с категориями и подкатегориями
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        category:categories(id, name, slug),
        subcategory:subcategories(id, name, slug)
      `)
      .order("sort", { ascending: true })
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error: any) {
    console.error("Ошибка загрузки товаров:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!(await hasAdminSectionAccess("products"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const body = await req.json()
    const supabase = createServiceClient()

    // Генерируем slug из названия, если не указан
    let slug = body.slug || body.name
      .toLowerCase()
      .replace(/[^a-zа-я0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")

    const { data, error } = await supabase
      .from("products")
      .insert({
        id: body.id || slug,
        slug: slug,
        category_id: body.category_id,
        subcategory_id: body.subcategory_id || null,
        name: body.name,
        description: body.description || null,
        brand: body.brand || null,
        type: body.type || null,
        image: body.image || null,
        specifications: body.specifications || {},
        sort: body.sort || 0,
        is_active: body.is_active !== undefined ? body.is_active : true,
      })
      .select(`
        *,
        category:categories(id, name, slug),
        subcategory:subcategories(id, name, slug)
      `)
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Ошибка создания товара:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

