"use client"

import { useRouter, usePathname } from "next/navigation"
import type { LucideIcon } from "lucide-react"
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Layers,
  FolderTree,
  FileText,
  Briefcase,
  UserCheck,
  ClipboardList,
  Inbox,
  MessageSquare,
  Users,
  LogOut,
} from "lucide-react"
import { AdminLink } from "@/components/admin-link"
import { useAdminPath } from "@/hooks/use-admin-path"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ADMIN_ROLE_LABELS, canAccessSection, type AdminRole } from "@/lib/admin-roles"

type NavItem = {
  section: string
  href: string
  label: string
  icon: LucideIcon
}

/** Полный список разделов админки; для каждой роли показываются только доступные. */
const ALL_SECTIONS: NavItem[] = [
  { section: "dashboard", href: "/admin/dashboard", label: "Главная", icon: LayoutDashboard },
  { section: "orders", href: "/admin/orders", label: "Заказы", icon: ShoppingCart },
  { section: "products", href: "/admin/products", label: "Товары", icon: Package },
  { section: "categories", href: "/admin/categories", label: "Категории", icon: Layers },
  { section: "subcategories", href: "/admin/subcategories", label: "Подкатегории", icon: FolderTree },
  { section: "news", href: "/admin/news", label: "Новости", icon: FileText },
  { section: "vacancies", href: "/admin/vacancies", label: "Вакансии", icon: Briefcase },
  { section: "vacancy-responses", href: "/admin/vacancy-responses", label: "Отклики", icon: UserCheck },
  { section: "rfp-requests", href: "/admin/rfp-requests", label: "Запросы", icon: ClipboardList },
  { section: "rfp-responses", href: "/admin/rfp-responses", label: "Предложения", icon: Inbox },
  { section: "contact-messages", href: "/admin/contact-messages", label: "Сообщения", icon: MessageSquare },
  { section: "managers", href: "/admin/managers", label: "Менеджеры", icon: Users },
]

/**
 * Общая десктопная навигация админ-панели (lg+).
 * На телефоне вместо неё показывается нижняя навигация (AdminMobileNav).
 */
export function AdminNav({ role }: { role: AdminRole }) {
  const router = useRouter()
  const pathname = usePathname() ?? ""
  const adminPath = useAdminPath()

  const items = ALL_SECTIONS.filter((item) => canAccessSection(role, item.section))

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" })
    router.push(adminPath)
    router.refresh()
  }

  return (
    <nav
      className="sticky top-0 z-40 hidden border-b border-border/70 bg-card/95 backdrop-blur-lg lg:block"
      aria-label="Разделы админ-панели"
    >
      <div className="container mx-auto flex items-center gap-3 px-4 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((item) => {
            const resolved = item.href.replace("/admin", adminPath)
            const isActive = pathname === resolved || pathname.startsWith(`${resolved}/`)

            return (
              <AdminLink
                key={item.section}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" strokeWidth={isActive ? 2.2 : 1.8} />
                {item.label}
              </AdminLink>
            )
          })}
        </div>

        <div className="flex shrink-0 items-center gap-2 py-2">
          <Badge variant="secondary" className="font-medium">
            {ADMIN_ROLE_LABELS[role]}
          </Badge>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-1.5 h-4 w-4" />
            Выйти
          </Button>
        </div>
      </div>
    </nav>
  )
}
