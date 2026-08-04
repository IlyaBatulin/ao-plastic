import { NextRequest, NextResponse } from "next/server"
import { createAuthServerClient } from "@/utils/supabase/auth-server"
import { createServiceClient } from "@/utils/supabase/server"
import { hasCustomerPreviewSession } from "@/lib/customer-preview"

export async function POST(request: NextRequest) {
  if (hasCustomerPreviewSession(request)) {
    return NextResponse.json({ reservation: { id: Date.now(), status: "requested" } }, { status: 201 })
  }
  const auth = await createAuthServerClient()
  const { data: { user } } = await auth.auth.getUser()
  if (!user) return NextResponse.json({ error: "Необходим вход" }, { status: 401 })
  const body = await request.json()
  const productName = String(body.productName || "").trim()
  const quantity = Number(body.quantity)
  const requestedDate = String(body.requestedDeliveryDate || "")
  if (!productName || !Number.isFinite(quantity) || quantity <= 0 || !/^\d{4}-\d{2}-\d{2}$/.test(requestedDate)) {
    return NextResponse.json({ error: "Заполните продукцию, объём и дату поставки" }, { status: 400 })
  }
  const { data, error } = await createServiceClient().from("customer_reservations").insert({
    user_id: user.id,
    product_name: productName.slice(0, 200),
    quantity,
    unit: body.unit === "уп." ? "уп." : "т",
    requested_delivery_date: requestedDate,
    comment: String(body.comment || "").slice(0, 1000),
    status: "requested",
  }).select().single()
  if (error) return NextResponse.json({ error: "Сервис резервирования пока не подключён" }, { status: 503 })
  return NextResponse.json({ reservation: data }, { status: 201 })
}
