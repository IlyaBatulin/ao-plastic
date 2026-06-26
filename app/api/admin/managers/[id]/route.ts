import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/utils/supabase/server"
import { isAdminAuthenticated } from "@/lib/admin-auth"

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuthenticated = await isAdminAuthenticated()
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await req.json()
    const name = String(body.name ?? "").trim()

    if (!name) {
      return NextResponse.json({ error: "Укажите имя менеджера" }, { status: 400 })
    }

    const tgChatId =
      body.tg_chat_id != null && String(body.tg_chat_id).trim()
        ? String(body.tg_chat_id).trim()
        : null

    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from("managers")
      .update({
        name,
        tg_chat_id: tgChatId,
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Ошибка обновления менеджера:", error)
    return NextResponse.json({ error: error.message || "Не удалось обновить менеджера" }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuthenticated = await isAdminAuthenticated()
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const supabase = createServiceClient()
    const { error } = await supabase.from("managers").delete().eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Ошибка удаления менеджера:", error)
    return NextResponse.json({ error: error.message || "Не удалось удалить менеджера" }, { status: 500 })
  }
}
