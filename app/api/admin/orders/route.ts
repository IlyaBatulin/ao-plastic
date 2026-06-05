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
      return NextResponse.json({ error: "Не удалось загрузить заказы" }, { status: 500 })
    }

    const orderIds = (orders || []).map((o) => o.id)

    // Один запрос на все позиции вместо N+1 (по запросу на каждый заказ).
    let itemsByOrder = new Map<number, any[]>()
    if (orderIds.length > 0) {
      const { data: allItems, error: itemsError } = await supabase
        .from("order_items")
        .select(`
          id,
          order_id,
          product_id,
          category_id,
          subcategory_id,
          quantity,
          price,
          products:product_id ( name ),
          categories:category_id ( name ),
          subcategories:subcategory_id ( name )
        `)
        .in("order_id", orderIds)

      if (itemsError) {
        console.error("Ошибка получения позиций заказов:", itemsError)
      } else {
        for (const item of allItems || []) {
          const list = itemsByOrder.get(item.order_id) || []
          list.push(item)
          itemsByOrder.set(item.order_id, list)
        }
      }
    }

    const ordersWithItems = (orders || []).map((order) => ({
      ...order,
      items: itemsByOrder.get(order.id) || [],
    }))

    return NextResponse.json(ordersWithItems)
  } catch (error: any) {
    console.error("Ошибка API заказов:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}

