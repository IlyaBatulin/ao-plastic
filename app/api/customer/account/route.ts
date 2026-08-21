import { NextRequest, NextResponse } from "next/server"
import { createAuthServerClient } from "@/utils/supabase/auth-server"
import { createServiceClient } from "@/utils/supabase/server"
import { hasCustomerPreviewSession } from "@/lib/customer-preview"

async function authenticatedUser() {
  const auth = await createAuthServerClient()
  const { data: { user } } = await auth.auth.getUser()
  return user
}

export async function GET(request: NextRequest) {
  if (hasCustomerPreviewSession(request)) {
    return NextResponse.json({
      demoMode: true,
      profile: { account_type: "company", company_name: "Тестовый покупатель", inn: "7100000000", contact_name: "Администратор проверки", phone: "+7 (495) 201-03-33", email: "info@td-plastic.ru", is_approved: true },
      manager: { name: "Отдел продаж АО «Пластик»", email: "info@td-plastic.ru", phone: "+7 (495) 201-03-33" },
      orders: [
        { id: 1048, created_at: "2026-07-28T10:00:00Z", manager_id: 1, items: [{ id: 1, quantity: 10, price: 164000, category_id: "abs", products: { name: "АБС-пластик 2020-31" } }, { id: 2, quantity: 5, price: 128000, category_id: "polystyrene", products: { name: "Полистирол общего назначения" } }] },
        { id: 1012, created_at: "2026-06-10T10:00:00Z", manager_id: 1, items: [{ id: 3, quantity: 20, price: 159500, category_id: "abs", products: { name: "АБС-пластик 2525-31" } }] },
      ],
      reservations: [{ id: 1, product_name: "АБС-пластик 2020-31", quantity: 12, unit: "т", requested_delivery_date: "2026-08-20", status: "confirmed" }],
      reservationsAvailable: true,
    })
  }
  const user = await authenticatedUser()
  if (!user?.email) return NextResponse.json({ error: "Необходим вход" }, { status: 401 })

  const db = createServiceClient()
  const metadata = user.user_metadata || {}
  const profileResult = await db.from("customer_profiles").select("*").eq("id", user.id).maybeSingle()

  const { data: orders } = await db
    .from("orders")
    .select("id, customer_name, customer_email, comment, created_at, manager_id")
    .ilike("customer_email", user.email)
    .order("created_at", { ascending: false })
    .limit(100)

  const orderIds = (orders || []).map((order) => order.id)
  const itemsResult = orderIds.length
    ? await db.from("order_items").select("id, order_id, product_id, category_id, subcategory_id, quantity, price, products:product_id(name)").in("order_id", orderIds)
    : { data: [] as any[] }

  const itemsByOrder = new Map<number, any[]>()
  for (const item of itemsResult.data || []) {
    const list = itemsByOrder.get(item.order_id) || []
    list.push(item)
    itemsByOrder.set(item.order_id, list)
  }

  const managerId = profileResult.data?.manager_id || orders?.find((order) => order.manager_id)?.manager_id
  const managerResult = managerId
    ? await db.from("managers").select("id, name, email, phone").eq("id", managerId).maybeSingle()
    : { data: null }

  const reservationsResult = await db
    .from("customer_reservations")
    .select("id, product_name, quantity, unit, requested_delivery_date, status, expires_at, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20)

  const profile = profileResult.data || {
    id: user.id,
    account_type: metadata.account_type || "company",
    company_name: metadata.company_name || "",
    inn: metadata.inn || "",
    contact_name: metadata.contact_name || "",
    phone: metadata.phone || "",
    email: user.email,
    delivery_address: metadata.delivery_address || "",
    is_approved: false,
  }

  return NextResponse.json({
    demoMode: false,
    profile,
    manager: managerResult.data,
    orders: (orders || []).map((order) => ({ ...order, items: itemsByOrder.get(order.id) || [] })),
    reservations: reservationsResult.data || [],
    reservationsAvailable: !reservationsResult.error,
  })
}

export async function PATCH(request: NextRequest) {
  const user = await authenticatedUser()
  if (!user?.email) return NextResponse.json({ error: "Необходим вход" }, { status: 401 })
  const body = await request.json()
  const allowed = {
    id: user.id,
    account_type: body.account_type === "individual" ? "individual" : "company",
    company_name: String(body.company_name || "").slice(0, 200),
    inn: String(body.inn || "").replace(/\D/g, "").slice(0, 12),
    contact_name: String(body.contact_name || "").slice(0, 160),
    phone: String(body.phone || "").slice(0, 40),
    email: user.email,
    delivery_address: String(body.delivery_address || "").slice(0, 500),
    updated_at: new Date().toISOString(),
  }
  const db = createServiceClient()
  const { data, error } = await db.from("customer_profiles").upsert(allowed).select().single()
  if (error) return NextResponse.json({ error: "Профиль пока недоступен. Примените миграцию кабинета." }, { status: 503 })
  return NextResponse.json({ profile: data })
}
