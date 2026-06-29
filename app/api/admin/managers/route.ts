import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/utils/supabase/server"
import { isAdminAuthenticated } from "@/lib/admin-auth"

type ManagerRow = {
  id: number
  name: string
  tg_chat_id: string | null
  email?: string | null
  phone?: string | null
  is_active?: boolean | null
  created_at?: string | null
}

async function loadCategoryAssignments(supabase: ReturnType<typeof createServiceClient>) {
  const assignments = new Map<number, { id: string; name: string }[]>()

  const { data, error } = await supabase
    .from("manager_categories")
    .select("manager_id, category_id, categories:category_id ( id, name )")

  if (error || !data) return assignments

  for (const row of data as Array<{
    manager_id: number
    category_id: string
    categories: { id: string; name: string } | null
  }>) {
    if (!row.categories) continue
    const list = assignments.get(row.manager_id) ?? []
    list.push({ id: row.categories.id, name: row.categories.name })
    assignments.set(row.manager_id, list)
  }

  return assignments
}

async function loadOrderCounts(supabase: ReturnType<typeof createServiceClient>) {
  const counts = new Map<number, number>()
  const { data, error } = await supabase.from("orders").select("manager_id")

  if (error || !data) return counts

  for (const row of data) {
    if (!row.manager_id) continue
    counts.set(row.manager_id, (counts.get(row.manager_id) ?? 0) + 1)
  }

  return counts
}

export async function GET() {
  const isAuthenticated = await isAdminAuthenticated()
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const supabase = createServiceClient()

    const { data: managers, error } = await supabase
      .from("managers")
      .select("*")
      .order("name", { ascending: true })

    if (error) throw error

    const [orderCounts, categoryAssignments] = await Promise.all([
      loadOrderCounts(supabase),
      loadCategoryAssignments(supabase),
    ])

    const enriched = ((managers ?? []) as ManagerRow[]).map((manager) => ({
      ...manager,
      orders_count: orderCounts.get(manager.id) ?? 0,
      categories: categoryAssignments.get(manager.id) ?? [],
    }))

    const summary = {
      total: enriched.length,
      withTelegram: enriched.filter((m) => Boolean(m.tg_chat_id)).length,
      totalOrders: enriched.reduce((sum, m) => sum + m.orders_count, 0),
    }

    return NextResponse.json({ managers: enriched, summary })
  } catch (error: any) {
    console.error("Ошибка загрузки менеджеров:", error)
    return NextResponse.json({ error: error.message || "Не удалось загрузить менеджеров" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const isAuthenticated = await isAdminAuthenticated()
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
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
      .insert({
        name,
        tg_chat_id: tgChatId,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Ошибка создания менеджера:", error)
    return NextResponse.json({ error: error.message || "Не удалось создать менеджера" }, { status: 500 })
  }
}
