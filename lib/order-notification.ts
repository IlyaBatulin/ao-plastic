export type OrderItemInfo = {
  name: string
  quantity: number
  categoryId: string | null
  subcategoryId: string | null
  packageQuantity?: number
}

export type OrderInfo = {
  customer_name?: string | null
  customer_phone?: string | null
  customer_email?: string | null
  created_at?: string | null
  comment?: string | null
  payload?: Record<string, unknown> | null
}

function formatQuantity(item: OrderItemInfo): string {
  const isPolystyrene = item.categoryId === "polystyrene"
  const isHousehold = item.categoryId === "hoztovary"

  if (isHousehold) {
    const packages = item.quantity || 1
    const packageQty = item.packageQuantity || 1
    const totalPieces = packages * packageQty
    return packageQty > 1 ? `${packages} уп. (${totalPieces} шт)` : `${packages} уп.`
  }

  if (isPolystyrene) {
    return typeof item.quantity === "number" && item.quantity % 1 !== 0
      ? `${item.quantity.toFixed(3)} т`
      : `${item.quantity} т`
  }

  if (typeof item.quantity === "number" && (item.quantity < 1 || item.quantity % 1 !== 0)) {
    return `${item.quantity.toFixed(3)} т`
  }

  return `${item.quantity} шт`
}

function getOrderTitle(orderType?: string): string {
  if (orderType === "custom_abs") return "Заявка на АБС-пластик на заказ"
  if (orderType === "category_inquiry") return "Заявка из каталога"
  return "Новый заказ с сайта"
}

export function buildOrderNotificationContent(
  orderId: number,
  orderInfo: OrderInfo | null | undefined,
  orderItems: OrderItemInfo[]
): { subject: string; text: string; html: string } {
  const orderType = (orderInfo?.payload as { orderType?: string } | undefined)?.orderType
  const title = getOrderTitle(orderType)
  const subject = `${title} №${orderId} — АО «Пластик»`

  const lines: string[] = [`${title} №${orderId}`, ""]

  if (orderInfo?.customer_name || orderInfo?.customer_phone || orderInfo?.customer_email) {
    lines.push("Клиент:")
    if (orderInfo.customer_name) lines.push(`  Имя: ${orderInfo.customer_name}`)
    if (orderInfo.customer_phone) lines.push(`  Телефон: ${orderInfo.customer_phone}`)
    if (orderInfo.customer_email) lines.push(`  Email: ${orderInfo.customer_email}`)
    lines.push("")
  }

  if (orderInfo?.comment) {
    lines.push("Комментарий:", orderInfo.comment, "")
  }

  if (orderItems.length > 0) {
    lines.push("Товары:")
    orderItems.forEach((item, index) => {
      lines.push(`  ${index + 1}. ${item.name} — ${formatQuantity(item)}`)
    })
    lines.push("")
  }

  lines.push(`Всего позиций: ${orderItems.length}`)

  if (orderInfo?.created_at) {
    lines.push(`Время: ${new Date(orderInfo.created_at).toLocaleString("ru-RU")}`)
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (siteUrl) {
    lines.push("", `Админка: ${siteUrl}/admin/orders`)
  }

  const text = lines.join("\n")

  const htmlItems = orderItems
    .map(
      (item, index) =>
        `<li><strong>${index + 1}. ${escapeHtml(item.name)}</strong> — ${escapeHtml(formatQuantity(item))}</li>`
    )
    .join("")

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111">
      <h2 style="margin:0 0 16px">${escapeHtml(title)} №${orderId}</h2>
      ${
        orderInfo?.customer_name || orderInfo?.customer_phone || orderInfo?.customer_email
          ? `<p><strong>Клиент:</strong><br>
        ${orderInfo.customer_name ? `Имя: ${escapeHtml(orderInfo.customer_name)}<br>` : ""}
        ${orderInfo.customer_phone ? `Телефон: ${escapeHtml(orderInfo.customer_phone)}<br>` : ""}
        ${orderInfo.customer_email ? `Email: ${escapeHtml(orderInfo.customer_email)}` : ""}
      </p>`
          : ""
      }
      ${orderInfo?.comment ? `<p><strong>Комментарий:</strong><br>${escapeHtml(orderInfo.comment)}</p>` : ""}
      ${orderItems.length ? `<p><strong>Товары:</strong></p><ul>${htmlItems}</ul>` : ""}
      <p><strong>Всего позиций:</strong> ${orderItems.length}</p>
      ${orderInfo?.created_at ? `<p><strong>Время:</strong> ${escapeHtml(new Date(orderInfo.created_at).toLocaleString("ru-RU"))}</p>` : ""}
      ${siteUrl ? `<p><a href="${escapeHtml(`${siteUrl}/admin/orders`)}">Открыть заказы в админке</a></p>` : ""}
    </div>
  `.trim()

  return { subject, text, html }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}
