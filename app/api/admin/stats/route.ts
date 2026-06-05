import { NextResponse } from "next/server"
import { createServiceClient } from "@/utils/supabase/server"
import { isAdminAuthenticated } from "@/lib/admin-auth"

async function countOf(
  supabase: ReturnType<typeof createServiceClient>,
  table: string,
  filter?: (q: any) => any
): Promise<number> {
  let query = supabase.from(table).select("*", { count: "exact", head: true })
  if (filter) query = filter(query)
  const { count, error } = await query
  if (error) {
    console.error(`Ошибка подсчёта ${table}:`, error)
    return 0
  }
  return count || 0
}

export async function GET() {
  const isAuthenticated = await isAdminAuthenticated()
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const supabase = createServiceClient()

    const [orders, products, categories, managers] = await Promise.all([
      countOf(supabase, "orders"),
      countOf(supabase, "products"),
      countOf(supabase, "categories"),
      countOf(supabase, "managers"),
    ])

    return NextResponse.json({ orders, products, categories, managers })
  } catch (error: any) {
    console.error("Ошибка загрузки статистики:", error)
    return NextResponse.json({ error: "Не удалось загрузить статистику" }, { status: 500 })
  }
}
