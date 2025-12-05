"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ShoppingCart, Phone, Mail, User, Clock, Package, Calendar } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface OrderItem {
  id: number
  product_id: string | null
  category_id: string | null
  subcategory_id: string | null
  quantity: number
  price: number | null
  products: { name: string } | null
  categories: { name: string } | null
  subcategories: { name: string } | null
}

interface Order {
  id: number
  customer_name: string | null
  customer_phone: string | null
  customer_email: string | null
  comment: string | null
  created_at: string
  manager_id: number | null
  managers: { id: number; name: string } | null
  items: OrderItem[]
}

export function OrdersAdmin() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/admin/orders")
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error("Ошибка загрузки заказов:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getItemName = (item: OrderItem) => {
    if (item.products?.name) return item.products.name
    if (item.subcategories?.name) return item.subcategories.name
    if (item.categories?.name) return item.categories.name
    return "Неизвестный товар"
  }

  const formatQuantity = (quantity: number, categoryId: string | null) => {
    if (categoryId === "polystyrene") {
      return `${Number(quantity).toFixed(3)} т.`
    }
    if (categoryId === "hoztovary") {
      return `${quantity} уп.`
    }
    if (Number(quantity) < 1 || Number(quantity) % 1 !== 0) {
      return `${Number(quantity).toFixed(3)} т.`
    }
    return `${quantity} шт.`
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Загрузка заказов...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/admin/dashboard">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад в админку
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Заказы с сайта</h1>
            <p className="text-muted-foreground">Всего заказов: {orders.length}</p>
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Заказов пока нет</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-card rounded-xl border border-border p-6 hover:border-primary/50 transition-all cursor-pointer"
              onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge variant="outline" className="text-lg font-semibold">
                      Заказ #{order.id}
                    </Badge>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(order.created_at)}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {order.customer_name && (
                      <div className="flex items-center gap-2 text-foreground">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span>{order.customer_name}</span>
                      </div>
                    )}
                    {order.customer_phone && (
                      <div className="flex items-center gap-2 text-foreground">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <a href={`tel:${order.customer_phone}`} className="hover:text-primary">
                          {order.customer_phone}
                        </a>
                      </div>
                    )}
                    {order.customer_email && (
                      <div className="flex items-center gap-2 text-foreground">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <a href={`mailto:${order.customer_email}`} className="hover:text-primary">
                          {order.customer_email}
                        </a>
                      </div>
                    )}
                    {order.managers && (
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <span>Менеджер:</span>
                        <Badge variant="secondary">{order.managers.name}</Badge>
                      </div>
                    )}
                  </div>

                  {selectedOrder?.id === order.id && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Позиции заказа ({order.items.length})
                      </h4>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div
                            key={item.id}
                            className="bg-muted/50 rounded-lg p-3 flex items-center justify-between"
                          >
                            <div className="flex-1">
                              <p className="font-medium">{getItemName(item)}</p>
                              <p className="text-sm text-muted-foreground">
                                Количество: {formatQuantity(item.quantity, item.category_id)}
                              </p>
                            </div>
                            {item.price && (
                              <div className="text-right">
                                <p className="font-semibold">{item.price.toLocaleString("ru-RU")} ₽</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {order.comment && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <h4 className="font-semibold mb-2">Комментарий клиента:</h4>
                          <p className="text-muted-foreground bg-muted/50 rounded-lg p-3">{order.comment}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="ml-4 text-right">
                  <Badge variant="outline" className="mb-2">
                    {order.items.length} {order.items.length === 1 ? "позиция" : "позиций"}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

