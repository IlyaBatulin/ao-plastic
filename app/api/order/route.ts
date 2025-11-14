import { NextResponse } from "next/server"
import { createClient, createServiceClient } from "@/utils/supabase/server"

type OrderItem = {
	productId?: string
	categoryId?: string
	subcategoryId?: string
	quantity?: number
	price?: number
	isPackages?: boolean // true если заказ в упаковках (хозтовары)
	packageQuantity?: number // количество штук в одной упаковке
}

type OrderInput = {
	// Один товар (старый формат) или корзина
	items?: OrderItem[]
	// Обратная совместимость: один товар
	productId?: string
	categoryId?: string
	subcategoryId?: string
	quantity?: number
	// Данные клиента
	customerName?: string
	customerPhone?: string
	customerEmail?: string
	comment?: string
	payload?: Record<string, unknown>
}

export async function POST(req: Request) {
	try {
	const body = (await req.json()) as OrderInput
	
	console.log('[API/Order] Received request:', JSON.stringify(body, null, 2))
	
	const supabase = createClient()

		// Проверяем подключение к Supabase
		if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
			console.error('[API/Order] Supabase not configured')
			return NextResponse.json({ ok: false, error: "Database not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local" }, { status: 500 })
		}

		// Нормализуем: корзина или один товар
		const items: OrderItem[] = body.items?.length
			? body.items
			: body.productId || body.categoryId
				? [{ productId: body.productId, categoryId: body.categoryId, subcategoryId: body.subcategoryId, quantity: body.quantity }]
				: []

		if (!items.length) {
			console.error('[API/Order] No items in order')
			return NextResponse.json({ ok: false, error: "No items in order" }, { status: 400 })
		}

		// Создаём заказ
		const orderData = {
			customer_name: body.customerName?.trim() || null,
			customer_phone: body.customerPhone?.trim() || null,
			customer_email: body.customerEmail?.trim() || null,
			comment: body.comment?.trim() || null,
			payload: { ...body.payload, itemCount: items.length },
		}
		
		// Преобразуем пустые строки в null для соответствия constraints
		if (orderData.customer_name === '') orderData.customer_name = null
		if (orderData.customer_phone === '') orderData.customer_phone = null
		if (orderData.customer_email === '') orderData.customer_email = null
		if (orderData.comment === '') orderData.comment = null
		
		console.log('[API/Order] Inserting order data:', JSON.stringify(orderData, null, 2))
		
		const { data: order, error: orderError } = await supabase
			.from("orders")
			.insert(orderData)
			.select("id")
			.single()

		if (orderError || !order) {
			console.error('[API/Order] Failed to create order:', orderError)
			console.error('[API/Order] Full error details:', JSON.stringify(orderError, null, 2))
			return NextResponse.json({ ok: false, error: orderError?.message ?? "Failed to create order" }, { status: 400 })
		}

	// Получаем информацию о товарах для позиций
	const orderItemsData = []
	for (const item of items) {
		let categoryId = item.categoryId
		let subcategoryId = item.subcategoryId

		// Если указан productId, подтягиваем категорию из товара
		if (item.productId && !categoryId) {
			const { data: product } = await supabase
				.from("products")
				.select("category_id, subcategory_id")
				.eq("id", item.productId)
				.single()
			if (product) {
				categoryId = product.category_id
				subcategoryId = product.subcategory_id
			}
		}

		// Резолвим slug в ID для подкатегории, если необходимо
		if (item.subcategoryId && categoryId) {
			const slugCandidate = item.subcategoryId
			const altSlugCandidate = `ps-${item.subcategoryId}`
			
			const { data: subcategory } = await supabase
				.from("subcategories")
				.select("id")
				.eq("category_id", categoryId)
				.or(`slug.eq.${slugCandidate},slug.eq.${altSlugCandidate}`)
				.single()
			
			if (subcategory) {
				subcategoryId = subcategory.id
			}
		}

		orderItemsData.push({
			order_id: order.id,
			product_id: item.productId ?? null,
			category_id: categoryId ?? null,
			subcategory_id: subcategoryId ?? null,
			quantity: item.quantity ?? 1,
			price: item.price ?? null,
		})
	}

	// Создаём позиции корзины
	console.log('[API/Order] Inserting order items:', JSON.stringify(orderItemsData, null, 2))
	const { error: itemsError } = await supabase.from("order_items").insert(orderItemsData)

	if (itemsError) {
		console.error('[API/Order] Failed to insert order items:', itemsError)
		console.error('[API/Order] Full items error:', JSON.stringify(itemsError, null, 2))
		// Откатываем заказ (или оставляем, но логируем ошибку)
		return NextResponse.json({ ok: false, error: `Order created but items failed: ${itemsError.message}` }, { status: 400 })
	}
	
	console.log('[API/Order] Order items inserted successfully')

		// Назначаем менеджеров (триггер в БД или вызываем функцию)
		// После вставки items триггер сам вызовет assign_manager_to_order

		// Получаем финального менеджера заказа
		const { data: finalOrder } = await supabase
			.from("orders")
			.select("id, manager_id")
			.eq("id", order.id)
			.single()

		// Получаем менеджеров всех позиций
		const { data: itemsWithManagers } = await supabase
			.from("order_items")
			.select("id, manager_id, category_id, quantity")
			.eq("order_id", order.id)

		console.log('[API/Order] Final order manager:', finalOrder?.manager_id)
		console.log('[API/Order] Items managers:', itemsWithManagers)

		// Фан-аут интеграций (не блокируем ответ)
		queueIntegrations({
			orderId: order.id,
			mainManagerId: finalOrder?.manager_id ?? null,
			itemsManagers: itemsWithManagers ?? [],
		}).catch(() => {})

		return NextResponse.json({ ok: true, id: order.id, managerId: finalOrder?.manager_id ?? null })
	} catch (e: any) {
		return NextResponse.json({ ok: false, error: e?.message ?? "Unexpected error" }, { status: 500 })
	}
}

async function queueIntegrations({
	orderId,
	mainManagerId,
	itemsManagers,
}: {
	orderId: number
	mainManagerId: number | null
	itemsManagers: Array<{ id: number; manager_id: number | null; category_id: string | null; quantity: number | null }>
}) {
	// Используем service client для чтения order_items (обходит RLS)
	const supabase = createServiceClient()
	
	// Получаем полную информацию о заказе для Telegram
	const { data: orderInfo } = await supabase
		.from("orders")
		.select("customer_name, customer_phone, customer_email, created_at, comment, payload")
		.eq("id", orderId)
		.single()

    // Небольшая задержка, чтобы убедиться, что позиции заказа записались
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Получаем позиции заказа один раз (используем для Bitrix24 и Telegram)
    const { data: orderItemsData, error: orderItemsError } = await supabase
        .from("order_items")
        .select("id, product_id, quantity, category_id, subcategory_id")
        .eq("order_id", orderId)

    if (orderItemsError) {
        console.error('[Supabase] Failed to fetch order items for integrations:', orderItemsError)
    }

    const orderItemsInfo: Array<{
        name: string
        quantity: number
        categoryId: string | null
        subcategoryId: string | null
    }> = []

    if (orderItemsData && orderItemsData.length > 0) {
        for (const itemData of orderItemsData) {
            if (itemData.product_id) {
                const { data: product } = await supabase
                    .from("products")
                    .select("name")
                    .eq("id", itemData.product_id)
                    .single()

                orderItemsInfo.push({
                    name: product?.name || 'Неизвестный товар',
                    quantity: itemData.quantity || 1,
                    categoryId: itemData.category_id,
                    subcategoryId: itemData.subcategory_id,
                })
            } else {
                let itemName = ''

                if (itemData.subcategory_id) {
                    const { data: subcategory } = await supabase
                        .from("subcategories")
                        .select("name")
                        .eq("id", itemData.subcategory_id)
                        .single()
                    itemName = subcategory?.name || itemData.subcategory_id
                } else if (itemData.category_id) {
                    const { data: category } = await supabase
                        .from("categories")
                        .select("name")
                        .eq("id", itemData.category_id)
                        .single()
                    itemName = category?.name || itemData.category_id
                }

                if (itemName) {
                    orderItemsInfo.push({
                        name: itemName,
                        quantity: itemData.quantity || 1,
                        categoryId: itemData.category_id,
                        subcategoryId: itemData.subcategory_id,
                    })
                }
            }
        }
    }

    console.log('[Integrations] Order items info prepared:', JSON.stringify(orderItemsInfo, null, 2))

    // Bitrix24: создаём лид через REST API
    const b24Url = process.env.BITRIX_WEBHOOK_URL
    console.log('[Bitrix24] Webhook configured:', !!b24Url)

    if (b24Url) {
        try {
            const endpoint = `${b24Url}crm.lead.add.json`
            const defaultAssignee = process.env.BITRIX_DEFAULT_ASSIGNED_ID?.trim()

            const itemsText = orderItemsInfo.length
                ? orderItemsInfo
                    .map((item, index) => {
                        const isPolystyrene = item.categoryId === 'polystyrene'
                        if (isPolystyrene) {
                            const asNumber = typeof item.quantity === 'number' ? item.quantity : Number(item.quantity)
                            const value = Number.isFinite(asNumber) ? asNumber : 0
                            return `${index + 1}. ${item.name} — ${value.toFixed(3)} т.`
                        }
                        const quantityValue = typeof item.quantity === 'number' ? item.quantity : Number(item.quantity)
                        const isTon = Number.isFinite(quantityValue) && (quantityValue < 1 || quantityValue % 1 !== 0)
                        const formatted = Number.isFinite(quantityValue)
                            ? isTon
                                ? `${quantityValue.toFixed(3)} т.`
                                : `${quantityValue} шт.`
                            : `${item.quantity}`
                        return `${index + 1}. ${item.name} — ${formatted}`
                    })
                    .join('\n')
                : 'Позиции не определены'

            const commentParts = [
                `Заказ с сайта №${orderId}`,
                '',
                'Позиции:',
                itemsText,
            ]

            if (orderInfo?.comment) {
                commentParts.push('', 'Комментарий клиента:', orderInfo.comment)
            }

            commentParts.push('', `Ссылка на заказ (Supabase): ${process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/admin/orders/${orderId}` : `ID ${orderId}`}`)

            const leadFields: Record<string, unknown> = {
                TITLE: `Заказ #${orderId} с сайта`,
                SOURCE_ID: 'WEB',
                COMMENTS: commentParts.join('\n'),
                CURRENCY_ID: 'RUB',
                AMOUNT: null,
            }

            const customerName = orderInfo?.customer_name?.trim()
            const customerPhone = orderInfo?.customer_phone?.trim()
            const customerEmail = orderInfo?.customer_email?.trim()

            if (customerName) {
                leadFields.NAME = customerName
            } else {
                leadFields.NAME = 'Клиент сайта'
            }

            if (customerPhone) {
                leadFields.PHONE = [{ VALUE: customerPhone, VALUE_TYPE: 'WORK' }]
            }

            if (customerEmail) {
                leadFields.EMAIL = [{ VALUE: customerEmail, VALUE_TYPE: 'WORK' }]
            }

            if (defaultAssignee) {
                leadFields.ASSIGNED_BY_ID = Number.isNaN(Number(defaultAssignee)) ? defaultAssignee : Number(defaultAssignee)
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fields: leadFields,
                    params: { REGISTER_SONET_EVENT: 'Y' },
                }),
            })

            const result = await response.json()

            if (response.ok && result?.result) {
                console.log('[Bitrix24] Lead created:', result.result)
            } else {
                console.error('[Bitrix24] Failed to create lead:', result)
            }
        } catch (error) {
            console.error('[Bitrix24] Error:', error)
        }
    }

    // Telegram: отправляем главному менеджеру + каждому менеджеру позиций (если они разные)
	const tgToken = process.env.TG_BOT_TOKEN
	const tgDefaultChat = process.env.TG_DEFAULT_CHAT_ID
	
	console.log('[Telegram] Token configured:', !!tgToken)
	console.log('[Telegram] Default chat:', tgDefaultChat)
	
    if (tgToken) {
        const notifiedManagers = new Set<number | null>()

        console.log('[Telegram] Order items info:', JSON.stringify(orderItemsInfo, null, 2))

		// Уведомление главному менеджеру
		if (mainManagerId) {
			try {
				const { data: manager } = await supabase
					.from("managers")
					.select("tg_chat_id, name")
					.eq("id", mainManagerId)
					.single()
				const chatId = manager?.tg_chat_id ?? tgDefaultChat
				if (chatId) {
					const url = `https://api.telegram.org/bot${tgToken}/sendMessage`
					
				// Формируем подробное сообщение
				const isCustomOrder = (orderInfo?.payload as any)?.orderType === "custom_abs"
				const orderTitle = isCustomOrder ? "🔧 Заявка об АБС пластике на заказ" : "🛒 Новый заказ"
				let message = `*${orderTitle} #${orderId}*\n\n`
				
				// Информация о клиенте
				if (orderInfo?.customer_name || orderInfo?.customer_phone) {
					message += `👤 *Клиент:*\n`
					if (orderInfo.customer_name) message += `   ${orderInfo.customer_name}\n`
					if (orderInfo.customer_phone) message += `   📞 ${orderInfo.customer_phone}\n`
					if (orderInfo.customer_email) message += `   ✉️ ${orderInfo.customer_email}\n`
					message += `\n`
				}
				
				// Комментарий/описание заказа
				if (orderInfo?.comment) {
					message += `📝 *Комментарий:*\n${orderInfo.comment}\n\n`
				}
				
				// Список товаров
				if (orderItemsInfo.length > 0) {
					message += `📦 *Товары в заказе:*\n`
					orderItemsInfo.forEach((item, index) => {
						// Определяем единицу измерения
						const isPolystyrene = item.categoryId === 'polystyrene'
						const isHousehold = item.categoryId === 'hoztovary'
						let quantityText = ''
						
						if (isHousehold) {
							// Для хозтоваров - упаковки
							const packages = item.quantity || 1
							const packageQty = (item as any).packageQuantity || 1
							const totalPieces = packages * packageQty
							quantityText = packageQty > 1 
								? `${packages} уп. (${totalPieces} шт)`
								: `${packages} уп.`
						} else if (isPolystyrene) {
							// Для полистирола всегда тонны
							quantityText = typeof item.quantity === 'number' && item.quantity % 1 !== 0 
								? `${item.quantity.toFixed(3)} т.` 
								: `${item.quantity} т.`
						} else {
							// Для остальных товаров: если количество меньше 1 или имеет дробную часть - тонны, иначе штуки
							if (typeof item.quantity === 'number' && (item.quantity < 1 || item.quantity % 1 !== 0)) {
								quantityText = `${item.quantity.toFixed(3)} т.`
							} else {
								quantityText = `${item.quantity} шт.`
							}
						}
						message += `   ${index + 1}. ${item.name} - ${quantityText}\n`
					})
					message += `\n`
				}
				
				// Информация о менеджере
				message += `👨‍💼 *Главный менеджер:* ${manager?.name ?? "Не назначен"}\n`
				message += `📦 *Всего позиций:* ${orderItemsInfo.length}\n`
					
					// Время
					if (orderInfo?.created_at) {
						const orderTime = new Date(orderInfo.created_at).toLocaleString('ru-RU')
						message += `\n🕐 ${orderTime}`
					}
					
					await fetch(url, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							chat_id: chatId,
							text: message,
							parse_mode: "Markdown",
						}),
					})
					notifiedManagers.add(mainManagerId)
				}
			} catch {}
		} else if (tgDefaultChat) {
			// Если менеджер не назначен, отправляем на дефолтный чат
			try {
				const url = `https://api.telegram.org/bot${tgToken}/sendMessage`
				
				// Формируем подробное сообщение
				const isCustomOrder = (orderInfo?.payload as any)?.orderType === "custom_abs"
				const orderTitle = isCustomOrder ? "🔧 Заявка об АБС пластике на заказ" : "🛒 Новый заказ"
				let message = `*${orderTitle} #${orderId}*\n\n`
				
				// Информация о клиенте
				if (orderInfo?.customer_name || orderInfo?.customer_phone) {
					message += `👤 *Клиент:*\n`
					if (orderInfo.customer_name) message += `   ${orderInfo.customer_name}\n`
					if (orderInfo.customer_phone) message += `   📞 ${orderInfo.customer_phone}\n`
					if (orderInfo.customer_email) message += `   ✉️ ${orderInfo.customer_email}\n`
					message += `\n`
				}
				
				// Комментарий/описание заказа
				if (orderInfo?.comment) {
					message += `📝 *Комментарий:*\n${orderInfo.comment}\n\n`
				}
				
				// Список товаров
				if (orderItemsInfo.length > 0) {
					message += `📦 *Товары в заказе:*\n`
					orderItemsInfo.forEach((item, index) => {
						// Определяем единицу измерения
						const isPolystyrene = item.categoryId === 'polystyrene'
						const isHousehold = item.categoryId === 'hoztovary'
						let quantityText = ''
						
						if (isHousehold) {
							// Для хозтоваров - упаковки
							const packages = item.quantity || 1
							const packageQty = (item as any).packageQuantity || 1
							const totalPieces = packages * packageQty
							quantityText = packageQty > 1 
								? `${packages} уп. (${totalPieces} шт)`
								: `${packages} уп.`
						} else if (isPolystyrene) {
							// Для полистирола всегда тонны
							quantityText = typeof item.quantity === 'number' && item.quantity % 1 !== 0 
								? `${item.quantity.toFixed(3)} т.` 
								: `${item.quantity} т.`
						} else {
							// Для остальных товаров: если количество меньше 1 или имеет дробную часть - тонны, иначе штуки
							if (typeof item.quantity === 'number' && (item.quantity < 1 || item.quantity % 1 !== 0)) {
								quantityText = `${item.quantity.toFixed(3)} т.`
							} else {
								quantityText = `${item.quantity} шт.`
							}
						}
						message += `   ${index + 1}. ${item.name} - ${quantityText}\n`
					})
					message += `\n`
				}
				
				// Информация о менеджере
				message += `👨‍💼 *Главный менеджер:* Не назначен\n`
				message += `📦 *Всего позиций:* ${orderItemsInfo.length}\n`
				
				// Время
				if (orderInfo?.created_at) {
					const orderTime = new Date(orderInfo.created_at).toLocaleString('ru-RU')
					message += `\n🕐 ${orderTime}`
				}
				
				const response = await fetch(url, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						chat_id: tgDefaultChat,
						text: message,
						parse_mode: "Markdown",
					}),
				})
				
				if (response.ok) {
					console.log('[Telegram] Message sent to default chat')
				} else {
					console.error('[Telegram] Failed to send to default chat:', response.statusText)
				}
			} catch (error) {
				console.error('[Telegram] Error sending to default chat:', error)
			}
		}

		// Уведомления менеджерам позиций (если они отличаются от главного)
		for (const item of itemsManagers) {
			if (item.manager_id && !notifiedManagers.has(item.manager_id)) {
				try {
					const { data: manager } = await supabase
						.from("managers")
						.select("tg_chat_id, name")
						.eq("id", item.manager_id)
						.single()
					const chatId = manager?.tg_chat_id ?? tgDefaultChat
					if (chatId) {
						const url = `https://api.telegram.org/bot${tgToken}/sendMessage`
						
						// Формируем сообщение для менеджера позиции
						let message = `📋 *Позиция в заказе #${orderId}*\n\n`
						message += `📦 *Категория:* ${item.category_id || 'Не указана'}\n`
						message += `🔢 *Количество:* ${item.quantity || 1}\n`
						message += `\n👨‍💼 *Ответственный:* Вы`
						
						await fetch(url, {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								chat_id: chatId,
								text: message,
								parse_mode: "Markdown",
							}),
						})
						notifiedManagers.add(item.manager_id)
					}
				} catch {}
			}
		}
	}
}


