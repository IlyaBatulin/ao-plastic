"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AdminLink } from "@/components/admin-link"
import {
  ArrowLeft,
  Bell,
  Mail,
  MessageCircle,
  Package,
  Pencil,
  Phone,
  Plus,
  ShoppingCart,
  Trash2,
  UserRound,
  Users,
} from "lucide-react"

type Manager = {
  id: number
  name: string
  tg_chat_id: string | null
  email?: string | null
  phone?: string | null
  is_active?: boolean | null
  created_at?: string | null
  orders_count: number
  categories: { id: string; name: string }[]
}

type ManagersSummary = {
  total: number
  withTelegram: number
  totalOrders: number
}

const emptyForm = {
  name: "",
  tg_chat_id: "",
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

export function ManagersAdmin() {
  const [managers, setManagers] = useState<Manager[]>([])
  const [summary, setSummary] = useState<ManagersSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null)
  const [formData, setFormData] = useState(emptyForm)

  useEffect(() => {
    fetchManagers()
  }, [])

  const fetchManagers = async () => {
    try {
      const response = await fetch("/api/admin/managers")
      if (response.ok) {
        const data = await response.json()
        setManagers(data.managers ?? [])
        setSummary(data.summary ?? null)
      }
    } catch (error) {
      console.error("Ошибка загрузки менеджеров:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = () => {
    setSelectedManager(null)
    setFormData(emptyForm)
    setIsDialogOpen(true)
  }

  const handleEdit = (manager: Manager) => {
    setSelectedManager(manager)
    setFormData({
      name: manager.name || "",
      tg_chat_id: manager.tg_chat_id || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (manager: Manager) => {
    setSelectedManager(manager)
    setIsDeleteDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = selectedManager
        ? `/api/admin/managers/${selectedManager.id}`
        : "/api/admin/managers"
      const method = selectedManager ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsDialogOpen(false)
        fetchManagers()
      } else {
        const error = await response.json()
        alert(error.error || "Ошибка сохранения")
      }
    } catch (error) {
      console.error("Ошибка сохранения:", error)
      alert("Ошибка сохранения")
    }
  }

  const confirmDelete = async () => {
    if (!selectedManager) return

    try {
      const response = await fetch(`/api/admin/managers/${selectedManager.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setIsDeleteDialogOpen(false)
        setSelectedManager(null)
        fetchManagers()
      } else {
        const error = await response.json()
        alert(error.error || "Ошибка удаления")
      }
    } catch (error) {
      console.error("Ошибка удаления:", error)
      alert("Ошибка удаления")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 via-background to-background">
      <header className="border-b border-border/70 bg-card/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <AdminLink href="/admin/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </AdminLink>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Менеджеры</h1>
                <p className="text-sm text-muted-foreground">Ответственные за заказы и уведомления</p>
              </div>
            </div>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Добавить менеджера
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 lg:px-8">
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <SummaryCard
            title="Всего менеджеров"
            value={summary?.total ?? managers.length}
            icon={Users}
            accent="bg-blue-500/10 text-blue-600"
            loading={isLoading}
          />
          <SummaryCard
            title="С Telegram"
            value={summary?.withTelegram ?? managers.filter((m) => m.tg_chat_id).length}
            icon={MessageCircle}
            accent="bg-emerald-500/10 text-emerald-600"
            loading={isLoading}
          />
          <SummaryCard
            title="Заказов назначено"
            value={summary?.totalOrders ?? managers.reduce((sum, m) => sum + m.orders_count, 0)}
            icon={ShoppingCart}
            accent="bg-violet-500/10 text-violet-600"
            loading={isLoading}
          />
        </div>

        <div className="mb-8 rounded-2xl border border-primary/20 bg-primary/5 p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
              <Bell className="h-5 w-5" />
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Как это работает</p>
              <p>
                При оформлении заказа система автоматически назначает ответственного менеджера по категории
                товара. Если у менеджера указан Telegram Chat ID, ему приходит уведомление о новом заказе.
              </p>
              <p>
                Если чат не задан, уведомление уходит в общий чат из переменной{" "}
                <code className="rounded bg-background px-1.5 py-0.5 text-xs">TG_DEFAULT_CHAT_ID</code>.
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-muted-foreground">Загрузка менеджеров...</div>
        ) : managers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UserRound className="h-8 w-8" />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-foreground">Менеджеров пока нет</h2>
            <p className="mx-auto mb-6 max-w-md text-muted-foreground">
              Добавьте менеджеров, чтобы заказы автоматически распределялись и приходили уведомления в Telegram.
            </p>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Добавить первого менеджера
            </Button>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {managers.map((manager) => (
              <article
                key={manager.id}
                className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-lg"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/70 via-primary to-primary/40 opacity-0 transition-opacity group-hover:opacity-100" />

                <div className="mb-5 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-lg font-bold text-primary">
                      {getInitials(manager.name)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{manager.name}</h3>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {manager.is_active === false ? (
                          <Badge variant="secondary">Неактивен</Badge>
                        ) : (
                          <Badge className="bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10">Активен</Badge>
                        )}
                        {manager.tg_chat_id ? (
                          <Badge className="bg-sky-500/10 text-sky-700 hover:bg-sky-500/10">Telegram</Badge>
                        ) : (
                          <Badge variant="outline">Без Telegram</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <Button variant="outline" size="icon" onClick={() => handleEdit(manager)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDelete(manager)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>

                <div className="mb-4 space-y-2 text-sm text-muted-foreground">
                  {manager.email ? (
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4 shrink-0" />
                      {manager.email}
                    </p>
                  ) : null}
                  {manager.phone ? (
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4 shrink-0" />
                      {manager.phone}
                    </p>
                  ) : null}
                  {manager.tg_chat_id ? (
                    <p className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 shrink-0" />
                      Chat ID: {manager.tg_chat_id}
                    </p>
                  ) : null}
                </div>

                <div className="mb-4 flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3">
                  <div className="flex items-center gap-2 text-sm">
                    <ShoppingCart className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">Заказов</span>
                  </div>
                  <span className="text-xl font-bold tabular-nums text-foreground">{manager.orders_count}</span>
                </div>

                {manager.categories.length > 0 ? (
                  <div>
                    <p className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      <Package className="h-3.5 w-3.5" />
                      Категории
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {manager.categories.map((category) => (
                        <Badge key={category.id} variant="secondary">
                          {category.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">Категории не привязаны</p>
                )}
              </article>
            ))}
          </div>
        )}
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedManager ? "Редактировать менеджера" : "Новый менеджер"}</DialogTitle>
            <DialogDescription>
              Укажите контакты и Telegram Chat ID для уведомлений о заказах
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-2">
              <div>
                <Label htmlFor="name">Имя *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Иванов Иван"
                  required
                />
              </div>

              <div>
                <Label htmlFor="tg_chat_id">Telegram Chat ID</Label>
                <Input
                  id="tg_chat_id"
                  value={formData.tg_chat_id}
                  onChange={(e) => setFormData({ ...formData, tg_chat_id: e.target.value })}
                  placeholder="123456789"
                />
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Отмена
              </Button>
              <Button type="submit">{selectedManager ? "Сохранить" : "Создать"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить менеджера?</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedManager
                ? `Менеджер «${selectedManager.name}» будет удалён. Связанные заказы останутся в системе.`
                : "Подтвердите удаление менеджера."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-white hover:bg-destructive/90">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function SummaryCard({
  title,
  value,
  icon: Icon,
  accent,
  loading,
}: {
  title: string
  value: number
  icon: typeof Users
  accent: string
  loading?: boolean
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          {loading ? (
            <div className="mt-2 h-9 w-16 animate-pulse rounded-lg bg-muted" />
          ) : (
            <p className="mt-1 text-3xl font-bold tabular-nums text-foreground">{value}</p>
          )}
        </div>
        <div className={`rounded-2xl p-3 ${accent}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}
