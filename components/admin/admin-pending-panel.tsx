"use client"

import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import { Bell, ClipboardList, MessageSquare, UserCheck } from "lucide-react"
import { AdminLink } from "@/components/admin-link"
import { cn } from "@/lib/utils"

type PendingItem = {
  label: string
  count: number
  href: string
  icon: LucideIcon
  accent: string
}

export function AdminPendingPanel({
  pending,
  loading,
}: {
  pending: {
    vacancyResponses: number
    rfpResponses: number
    contactMessages: number
  } | null
  loading?: boolean
}) {
  const items: PendingItem[] = [
    {
      label: "Отклики на вакансии",
      count: pending?.vacancyResponses ?? 0,
      href: "/admin/vacancy-responses",
      icon: UserCheck,
      accent: "bg-rose-500/10 text-rose-600",
    },
    {
      label: "Ответы поставщиков",
      count: pending?.rfpResponses ?? 0,
      href: "/admin/rfp-responses",
      icon: ClipboardList,
      accent: "bg-orange-500/10 text-orange-600",
    },
    {
      label: "Сообщения с сайта",
      count: pending?.contactMessages ?? 0,
      href: "/admin/contact-messages",
      icon: MessageSquare,
      accent: "bg-sky-500/10 text-sky-600",
    },
  ]

  const totalPending = items.reduce((sum, item) => sum + item.count, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.28, ease: "easeOut" }}
      className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm"
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Требуют внимания</h3>
          <p className="text-sm text-muted-foreground">Новые обращения и отклики</p>
        </div>
        <div className="relative rounded-2xl bg-primary/10 p-3 text-primary">
          <Bell className="h-5 w-5" />
          {!loading && totalPending > 0 ? (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
              {totalPending > 99 ? "99+" : totalPending}
            </span>
          ) : null}
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <AdminLink
            key={item.href}
            href={item.href}
            className={cn(
              "group flex items-center gap-4 rounded-xl border border-border/60 bg-background/60 p-4 transition-all duration-200 hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm",
              item.count > 0 && "border-primary/20"
            )}
          >
            <div className={cn("rounded-xl p-2.5 transition-transform duration-200 group-hover:scale-110", item.accent)}>
              <item.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground">
                {loading ? "Загрузка…" : item.count > 0 ? "Есть новые записи" : "Нет новых записей"}
              </p>
            </div>
            {loading ? (
              <div className="h-7 w-10 animate-pulse rounded-full bg-muted" />
            ) : (
              <span
                className={cn(
                  "flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-xs font-bold tabular-nums",
                  item.count > 0 ? "bg-destructive text-white shadow-sm" : "bg-muted text-muted-foreground"
                )}
              >
                {item.count > 99 ? "99+" : item.count}
              </span>
            )}
          </AdminLink>
        ))}
      </div>
    </motion.div>
  )
}
