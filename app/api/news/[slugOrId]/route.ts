import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slugOrId: string }> }
) {
  try {
    const { slugOrId } = await params
    const supabase = await createClient()

    const isNumeric = /^\d+$/.test(slugOrId)

    const query = supabase
      .from("news")
      .select("*")
      .eq("is_active", true)

    if (isNumeric) {
      query.eq("id", parseInt(slugOrId, 10))
    } else {
      query.eq("slug", slugOrId)
    }

    const { data, error } = await query.single()

    if (error || !data) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error: unknown) {
    console.error("Ошибка загрузки новости:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
