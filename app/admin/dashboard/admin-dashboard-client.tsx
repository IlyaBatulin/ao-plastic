"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useAdminPath } from "@/hooks/use-admin-path"
import {
  LogOut,
  Package,
  ShoppingCart,
  Users,
  FileText,
  ClipboardList,
  MessageSquare,
  Layers,
  Sparkles,
} from "lucide-react"
import { AdminLink } from "@/components/admin-link"
import { Badge } from "@/components/ui/badge"
import { AdminStatCard } from "@/components/admin/admin-stat-card"
import { AdminOrdersChart } from "@/components/admin/admin-orders-chart"
import { AdminPendingPanel } from "@/components/admin/admin-pending-panel"
import { ADMIN_ROLE_LABELS, canAccessSection, type AdminRole } from "@/lib/admin-roles"

type DashboardStats = {
  orders: number
  products: number
  categories: number
  managers: number
  ordersThisWeek: number
  ordersThisMonth: number
  ordersTrend: { date: string; label: string; count: number }[]
  pending: {
    vacancyResponses: number
    rfpResponses: number
    contactMessages: number
  }
}

/** Разделы админки; показываются только доступные роли. */
const SECTION_LINKS: {
  section: string
  href: string
  icon: typeof ShoppingCart
  title: string
  description: string
  pendingKey?: keyof DashboardStats["pending"]
}[] = [
  { section: "orders", href: "/admin/orders", icon: ShoppingCart, title: "Заказы", description: "Просмотр и управление заказами" },
  { section: "products", href: "/admin/products", icon: Package, title: "Товары", description: "Управление товарами" },
  { section: "categories", href: "/admin/categories", icon: Layers, title: "Категории", description: "Управление категориями и подкатегориями" },
  { section: "news", href: "/admin/news", icon: FileText, title: "Новости", description: "Управление новостями компании" },
  { section: "vacancies", href: "/admin/vacancies", icon: FileText, title: "Вакансии", description: "Управление вакансиями" },
  { section: "vacancy-responses", href: "/admin/vacancy-responses", icon: FileText, title: "Отклики на вакансии", description: "Просмотр откликов на вакансии", pendingKey: "vacancyResponses" },
  { section: "rfp-requests", href: "/admin/rfp-requests", icon: ClipboardList, title: "Запросы предложений", description: "Управление запросами для поставщиков" },
  { section: "rfp-responses", href: "/admin/rfp-responses", icon: ClipboardList, title: "Ответы на запросы", description: "Просмотр предложений от поставщиков", pendingKey: "rfpResponses" },
  { section: "contact-messages", href: "/admin/contact-messages", icon: MessageSquare, title: "Сообщения с сайта", description: "Просмотр сообщений из форм обратной связи", pendingKey: "contactMessages" },
  { section: "managers", href: "/admin/managers", icon: Users, title: "Менеджеры", description: "Управление менеджерами" },
]

export function AdminDashboard({ role }: { role: AdminRole }) {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoadingStats, setIsLoadingStats] = useState(true)

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats")
      if (res.ok) {
        setStats(await res.json())
      }
    } catch (error) {
      console.error("Ошибка загрузки статистики:", error)
    } finally {
      setIsLoadingStats(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 30000)
    const handleFocus = () => fetchStats()
    window.addEventListener("focus", handleFocus)
    return () => {
      clearInterval(interval)
      window.removeEventListener("focus", handleFocus)
    }
  }, [fetchStats])

  const adminPath = useAdminPath()
  const [adminUrl, setAdminUrl] = useState(adminPath)
  const pending = stats?.pending

  useEffect(() => {
    setAdminUrl(`${window.location.origin}${adminPath}`)
  }, [adminPath])

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" })
    router.push(adminPath)
    router.refresh()
  }

  const canSales = canAccessSection(role, "orders")
  const canContent = canAccessSection(role, "products")
  const visibleSections = SECTION_LINKS.filter((link) => canAccessSection(role, link.section))

  // Карточки статистики по ролям
  const statCards = [
    canSales && {
      title: "Заказы",
      value: stats?.orders ?? 0,
      subtitle: stats
        ? `${stats.ordersThisWeek} за неделю · ${stats.ordersThisMonth} за месяц`
        : "Всего заказов",
      icon: ShoppingCart,
      accent: "blue" as const,
      badge: stats && stats.ordersThisWeek > 0 ? `+${stats.ordersThisWeek}` : undefined,
    },
    canContent && {
      title: "Товары",
      value: stats?.products ?? 0,
      subtitle: "В каталоге",
      icon: Package,
      accent: "emerald" as const,
    },
    canContent && {
      title: "Категории",
      value: stats?.categories ?? 0,
      subtitle: "Разделов каталога",
      icon: Layers,
      accent: "violet" as const,
    },
    canSales && {
      title: "Менеджеры",
      value: stats?.managers ?? 0,
      subtitle: "Активных менеджеров",
      icon: Users,
      accent: "amber" as const,
    },
  ].filter((card): card is Exclude<typeof card, false> => Boolean(card))

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 via-background to-background">
      <header className="border-b border-border/70 bg-card/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-bold text-foreground sm:text-2xl">Админ-панель</h1>
                  <Badge variant="secondary" className="font-medium">
                    {ADMIN_ROLE_LABELS[role]}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground sm:text-sm">Управление сайтом АО «Пластик»</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Выйти</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h2 className="mb-2 text-2xl font-bold text-foreground sm:text-3xl">Панель управления</h2>
          <p className="text-muted-foreground">Обзор ключевых показателей и быстрый доступ к разделам</p>
        </motion.div>

        {role === "director" && (
          <div className="mb-8 rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-5">
            <h3 className="mb-2 font-semibold text-foreground">Ссылка на админку</h3>
            <p className="mb-2 text-sm text-muted-foreground">
              {adminPath !== "/admin" ? (
                <>Используется секретный путь. Сохраните ссылку — стандартный /admin заблокирован.</>
              ) : (
                <>Добавьте секретный путь в .env.local для усиления защиты:</>
              )}
            </p>
            <code className="block break-all rounded-lg bg-background p-3 font-mono text-sm">
              {adminUrl}
            </code>
            {adminPath === "/admin" && (
              <pre className="mt-3 overflow-x-auto rounded-lg bg-background p-3 font-mono text-xs">
{`# Добавьте в .env.local (придумайте свой код):
ADMIN_PATH=panel-ваш-код

# Путь НЕ попадёт в браузер — его нельзя найти в DevTools`}
              </pre>
            )}
          </div>
        )}

        <section className="mb-8">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-foreground">Статистика</h3>
            {!isLoadingStats && stats ? (
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700">
                Обновлено только что
              </span>
            ) : null}
          </div>

          <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((card, index) => (
              <AdminStatCard
                key={card.title}
                title={card.title}
                value={card.value}
                subtitle={card.subtitle}
                icon={card.icon}
                accent={card.accent}
                index={index}
                badge={card.badge}
                loading={isLoadingStats}
              />
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {canSales && (
              <div className="lg:col-span-2">
                <AdminOrdersChart data={stats?.ordersTrend ?? []} loading={isLoadingStats} />
              </div>
            )}
            <div className={canSales ? "" : "lg:col-span-3"}>
              <AdminPendingPanel pending={pending ?? null} loading={isLoadingStats} role={role} />
            </div>
          </div>
        </section>

        <section>
          <h3 className="mb-4 text-lg font-semibold text-foreground">Разделы</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleSections.map((link) => (
              <QuickActionLink
                key={link.href}
                href={link.href}
                icon={link.icon}
                title={link.title}
                description={link.description}
                badge={link.pendingKey ? pending?.[link.pendingKey] : undefined}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

function QuickActionLink({
  href,
  icon: Icon,
  title,
  description,
  badge,
}: {
  href: string
  icon: typeof ShoppingCart
  title: string
  description: string
  badge?: number
}) {
  return (
    <AdminLink
      href={href}
      className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg"
    >
      {badge && badge > 0 ? (
        <Badge
          variant="destructive"
          className="absolute right-3 top-3 flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs font-bold shadow-lg"
        >
          {badge > 99 ? "99+" : badge}
        </Badge>
      ) : null}
      <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3 text-primary transition-transform duration-300 group-hover:scale-110">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </AdminLink>
  )
}
