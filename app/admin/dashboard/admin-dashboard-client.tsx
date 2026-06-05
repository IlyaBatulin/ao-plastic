"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useAdminPath } from "@/hooks/use-admin-path"
import { LogOut, Package, ShoppingCart, Users, FileText, ClipboardList, MessageSquare, Box } from "lucide-react"
import { AdminLink } from "@/components/admin-link"
import { Badge } from "@/components/ui/badge"

export function AdminDashboard() {
  const router = useRouter()
  const [vacancyResponsesCount, setVacancyResponsesCount] = useState(0)
  const [rfpResponsesCount, setRfpResponsesCount] = useState(0)
  const [contactMessagesCount, setContactMessagesCount] = useState(0)
  const [stats, setStats] = useState<{ orders: number; products: number; categories: number; managers: number } | null>(null)

  useEffect(() => {
    fetchCounts()
    fetchStats()
    // Обновляем счетчики каждые 30 секунд
    const interval = setInterval(fetchCounts, 30000)
    
    // Обновляем счетчики при возврате на вкладку
    const handleFocus = () => {
      fetchCounts()
    }
    window.addEventListener("focus", handleFocus)
    
    return () => {
      clearInterval(interval)
      window.removeEventListener("focus", handleFocus)
    }
  }, [])

  const fetchCounts = async () => {
    try {
      const [vacancyRes, rfpRes, contactRes] = await Promise.all([
        fetch("/api/admin/vacancy-responses/count"),
        fetch("/api/admin/rfp-responses/count"),
        fetch("/api/admin/contact-messages/count"),
      ])

      if (vacancyRes.ok) {
        const data = await vacancyRes.json()
        setVacancyResponsesCount(data.count || 0)
      }

      if (rfpRes.ok) {
        const data = await rfpRes.json()
        setRfpResponsesCount(data.count || 0)
      }

      if (contactRes.ok) {
        const data = await contactRes.json()
        setContactMessagesCount(data.count || 0)
      }
    } catch (error) {
      console.error("Ошибка загрузки счетчиков:", error)
    }
  }

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats")
      if (res.ok) {
        setStats(await res.json())
      }
    } catch (error) {
      console.error("Ошибка загрузки статистики:", error)
    }
  }

  const adminPath = useAdminPath()

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" })
    router.push(adminPath)
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Админ-панель</h1>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="container mx-auto px-4 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Панель управления</h2>
          <p className="text-muted-foreground">Добро пожаловать в админ-панель</p>
        </div>

        {/* Секретная ссылка */}
        <div className="mb-8 p-4 rounded-xl bg-primary/5 border border-primary/20">
          <h3 className="font-semibold text-foreground mb-2">Ссылка на админку</h3>
          <p className="text-sm text-muted-foreground mb-2">
            {adminPath !== "/admin" ? (
              <>Используется секретный путь. Сохраните ссылку — стандартный /admin заблокирован.</>
            ) : (
              <>Добавьте секретный путь в .env.local для усиления защиты:</>
            )}
          </p>
          <code className="block p-3 rounded-lg bg-background text-sm font-mono break-all">
            {typeof window !== "undefined" ? window.location.origin + adminPath : adminPath}
          </code>
          {adminPath === "/admin" && (
            <pre className="mt-3 p-3 rounded-lg bg-background text-xs font-mono overflow-x-auto">
{`# Добавьте в .env.local (придумайте свой код):
ADMIN_PATH=panel-ваш-код

# Путь НЕ попадёт в браузер — его нельзя найти в DevTools`}
            </pre>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Заказы</h3>
              <ShoppingCart className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">{stats ? stats.orders : "…"}</p>
            <p className="text-xs text-muted-foreground mt-2">Всего заказов</p>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Товары</h3>
              <Package className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">{stats ? stats.products : "…"}</p>
            <p className="text-xs text-muted-foreground mt-2">Всего товаров</p>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Категории</h3>
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">{stats ? stats.categories : "…"}</p>
            <p className="text-xs text-muted-foreground mt-2">Всего категорий</p>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Менеджеры</h3>
              <Users className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">{stats ? stats.managers : "…"}</p>
            <p className="text-xs text-muted-foreground mt-2">Всего менеджеров</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AdminLink
            href="/admin/orders"
            className="bg-card rounded-xl border border-border p-6 hover:border-primary/50 hover:shadow-lg transition-all group"
          >
            <ShoppingCart className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Заказы</h3>
            <p className="text-sm text-muted-foreground">Просмотр и управление заказами</p>
          </AdminLink>

          <AdminLink
            href="/admin/products"
            className="bg-card rounded-xl border border-border p-6 hover:border-primary/50 hover:shadow-lg transition-all group"
          >
            <Package className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Товары</h3>
            <p className="text-sm text-muted-foreground">Управление товарами</p>
          </AdminLink>

          <AdminLink
            href="/admin/categories"
            className="bg-card rounded-xl border border-border p-6 hover:border-primary/50 hover:shadow-lg transition-all group"
          >
            <FileText className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Категории</h3>
            <p className="text-sm text-muted-foreground">Управление категориями и подкатегориями</p>
          </AdminLink>

          <AdminLink
            href="/admin/news"
            className="bg-card rounded-xl border border-border p-6 hover:border-primary/50 hover:shadow-lg transition-all group"
          >
            <FileText className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Новости</h3>
            <p className="text-sm text-muted-foreground">Управление новостями компании</p>
          </AdminLink>

          <AdminLink
            href="/admin/vacancies"
            className="bg-card rounded-xl border border-border p-6 hover:border-primary/50 hover:shadow-lg transition-all group"
          >
            <FileText className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Вакансии</h3>
            <p className="text-sm text-muted-foreground">Управление вакансиями</p>
          </AdminLink>

          <AdminLink
            href="/admin/vacancy-responses"
            className="bg-card rounded-xl border border-border p-6 hover:border-primary/50 hover:shadow-lg transition-all group relative"
          >
            {vacancyResponsesCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute top-2 right-2 min-w-[24px] h-6 flex items-center justify-center px-1.5 text-xs font-bold rounded-full shadow-lg"
              >
                {vacancyResponsesCount > 99 ? "99+" : vacancyResponsesCount}
              </Badge>
            )}
            <FileText className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Ответы на вакансии</h3>
            <p className="text-sm text-muted-foreground">Просмотр откликов на вакансии</p>
          </AdminLink>

          <AdminLink
            href="/admin/rfp-requests"
            className="bg-card rounded-xl border border-border p-6 hover:border-primary/50 hover:shadow-lg transition-all group"
          >
            <ClipboardList className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Запросы предложений</h3>
            <p className="text-sm text-muted-foreground">Управление запросами для поставщиков</p>
          </AdminLink>

          <AdminLink
            href="/admin/rfp-responses"
            className="bg-card rounded-xl border border-border p-6 hover:border-primary/50 hover:shadow-lg transition-all group relative"
          >
            {rfpResponsesCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute top-2 right-2 min-w-[24px] h-6 flex items-center justify-center px-1.5 text-xs font-bold rounded-full shadow-lg"
              >
                {rfpResponsesCount > 99 ? "99+" : rfpResponsesCount}
              </Badge>
            )}
            <ClipboardList className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Ответы на запросы</h3>
            <p className="text-sm text-muted-foreground">Просмотр предложений от поставщиков</p>
          </AdminLink>

          <AdminLink
            href="/admin/contact-messages"
            className="bg-card rounded-xl border border-border p-6 hover:border-primary/50 hover:shadow-lg transition-all group relative"
          >
            {contactMessagesCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute top-2 right-2 min-w-[24px] h-6 flex items-center justify-center px-1.5 text-xs font-bold rounded-full shadow-lg"
              >
                {contactMessagesCount > 99 ? "99+" : contactMessagesCount}
              </Badge>
            )}
            <MessageSquare className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Сообщения с сайта</h3>
            <p className="text-sm text-muted-foreground">Просмотр сообщений из форм обратной связи</p>
          </AdminLink>

          <AdminLink
            href="/admin/managers"
            className="bg-card rounded-xl border border-border p-6 hover:border-primary/50 hover:shadow-lg transition-all group"
          >
            <Users className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Менеджеры</h3>
            <p className="text-sm text-muted-foreground">Управление менеджерами</p>
          </AdminLink>
        </div>
      </main>
    </div>
  )
}

