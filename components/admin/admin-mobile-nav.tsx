"use client"

import { usePathname } from "next/navigation"
import type { LucideIcon } from "lucide-react"
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  MessageSquare,
  ClipboardList,
  Users,
  FileText,
  Layers,
  UserCheck,
} from "lucide-react"
import { AdminLink } from "@/components/admin-link"
import { useAdminPath } from "@/hooks/use-admin-path"
import { cn } from "@/lib/utils"
import type { AdminRole } from "@/lib/admin-roles"

type NavItem = {
  href: string
  label: string
  icon: LucideIcon
}

/** До 5 самых нужных разделов для каждой роли — нижняя навигация на телефоне. */
const NAV_BY_ROLE: Record<AdminRole, NavItem[]> = {
  director: [
    { href: "/admin/dashboard", label: "Главная", icon: LayoutDashboard },
    { href: "/admin/orders", label: "Заказы", icon: ShoppingCart },
    { href: "/admin/products", label: "Товары", icon: Package },
    { href: "/admin/news", label: "Новости", icon: FileText },
    { href: "/admin/contact-messages", label: "Сообщения", icon: MessageSquare },
  ],
  sales: [
    { href: "/admin/dashboard", label: "Главная", icon: LayoutDashboard },
    { href: "/admin/orders", label: "Заказы", icon: ShoppingCart },
    { href: "/admin/rfp-requests", label: "Запросы", icon: ClipboardList },
    { href: "/admin/contact-messages", label: "Сообщения", icon: MessageSquare },
    { href: "/admin/managers", label: "Менеджеры", icon: Users },
  ],
  marketing: [
    { href: "/admin/dashboard", label: "Главная", icon: LayoutDashboard },
    { href: "/admin/products", label: "Товары", icon: Package },
    { href: "/admin/categories", label: "Категории", icon: Layers },
    { href: "/admin/news", label: "Новости", icon: FileText },
    { href: "/admin/vacancy-responses", label: "Отклики", icon: UserCheck },
  ],
}

export function AdminMobileNav({ role }: { role: AdminRole }) {
  const pathname = usePathname() ?? ""
  const adminPath = useAdminPath()
  const items = NAV_BY_ROLE[role]

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border/70 bg-card/95 backdrop-blur-lg pb-[env(safe-area-inset-bottom)] lg:hidden"
      aria-label="Разделы админ-панели"
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around">
        {items.map((item) => {
          const resolved = item.href.replace("/admin", adminPath)
          const isActive = pathname === resolved || pathname.startsWith(`${resolved}/`)

          return (
            <AdminLink
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-w-0 flex-1 flex-col items-center gap-1 px-1 py-2.5 text-[11px] font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "drop-shadow-sm")} strokeWidth={isActive ? 2.2 : 1.8} />
              <span className="truncate">{item.label}</span>
            </AdminLink>
          )
        })}
      </div>
    </nav>
  )
}
