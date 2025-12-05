import { NextResponse } from "next/server"
import { createServiceClient } from "@/utils/supabase/server"
import { isAdminAuthenticated } from "@/lib/admin-auth"

export async function GET() {
  const isAuthenticated = await isAdminAuthenticated()
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const supabase = createServiceClient()

    // Получаем все заказы с информацией о менеджерах
    const { data: orders, error } = await supabase
      .from("orders")
      .select(`
        id,
        customer_name,
        customer_phone,
        customer_email,
        comment,
        created_at,
        manager_id,
        managers:manager_id (
          id,
          name
        )
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Ошибка получения заказов:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Получаем позиции для каждого заказа
    const ordersWithItems = await Promise.all(
      (orders || []).map(async (order) => {
        const { data: items } = await supabase
          .from("order_items")
          .select(`
            id,
            product_id,
            category_id,
            subcategory_id,
            quantity,
            price,
            products:product_id (
              name
            ),
            categories:category_id (
              name
            ),
            subcategories:subcategory_id (
              name
            )
          `)
          .eq("order_id", order.id)

        return {
          ...order,
          items: items || [],
        }
      })
    )

    return NextResponse.json(ordersWithItems)
  } catch (error: any) {
    console.error("Ошибка API заказов:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

