import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/utils/supabase/server"
import { isAdminAuthenticated } from "@/lib/admin-auth"

export async function GET() {
  const isAuthenticated = await isAdminAuthenticated()
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error: unknown) {
    console.error("Ошибка загрузки новостей:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  const isAuthenticated = await isAdminAuthenticated()
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const supabase = createServiceClient()

    const { data, error } = await supabase
      .from("news")
      .insert({
        title: body.title,
        slug: body.slug || null,
        excerpt: body.excerpt || null,
        content: body.content || null,
        image_url: body.image_url || null,
        video_url: body.video_url || null,
        published_at: body.published_at || new Date().toISOString(),
        is_active: body.is_active !== undefined ? body.is_active : true,
        sort: body.sort || 0,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: unknown) {
    console.error("Ошибка создания новости:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
