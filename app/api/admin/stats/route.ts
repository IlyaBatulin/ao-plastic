import { NextResponse } from "next/server"
import { createServiceClient } from "@/utils/supabase/server"
import { hasAdminSectionAccess } from "@/lib/admin-auth"

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

function startOfDay(date: Date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function startOfWeek(date: Date) {
  const d = startOfDay(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return d
}

function buildTrendTemplate(days: number) {
  const today = startOfDay(new Date())
  return Array.from({ length: days }, (_, index) => {
    const d = new Date(today)
    d.setDate(today.getDate() - (days - 1 - index))
    return {
      date: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("ru-RU", { day: "numeric", month: "short" }),
      count: 0,
    }
  })
}

export async function GET() {
  if (!(await hasAdminSectionAccess("stats"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const supabase = createServiceClient()
    const now = new Date()
    const weekStart = startOfWeek(now).toISOString()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const trendStart = new Date(startOfDay(now))
    trendStart.setDate(trendStart.getDate() - 13)

    const [
      orders,
      products,
      categories,
      managers,
      ordersThisWeek,
      ordersThisMonth,
      recentOrders,
      vacancyResponses,
      rfpResponses,
      contactMessages,
    ] = await Promise.all([
      countOf(supabase, "orders"),
      countOf(supabase, "products"),
      countOf(supabase, "categories"),
      countOf(supabase, "managers"),
      countOf(supabase, "orders", (q) => q.gte("created_at", weekStart)),
      countOf(supabase, "orders", (q) => q.gte("created_at", monthStart)),
      supabase
        .from("orders")
        .select("created_at")
        .gte("created_at", trendStart.toISOString()),
      countOf(supabase, "vacancy_responses", (q) => q.eq("status", "new")),
      countOf(supabase, "rfp_responses", (q) => q.eq("status", "new")),
      countOf(supabase, "contact_messages", (q) => q.eq("status", "new")),
    ])

    const ordersTrend = buildTrendTemplate(14)
    const trendMap = new Map(ordersTrend.map((item) => [item.date, item]))

    if (!recentOrders.error && recentOrders.data) {
      for (const order of recentOrders.data) {
        const key = new Date(order.created_at).toISOString().slice(0, 10)
        const bucket = trendMap.get(key)
        if (bucket) bucket.count += 1
      }
    }

    return NextResponse.json({
      orders,
      products,
      categories,
      managers,
      ordersThisWeek,
      ordersThisMonth,
      ordersTrend,
      pending: {
        vacancyResponses,
        rfpResponses,
        contactMessages,
      },
    })
  } catch (error: any) {
    console.error("Ошибка загрузки статистики:", error)
    return NextResponse.json({ error: "Не удалось загрузить статистику" }, { status: 500 })
  }
}
