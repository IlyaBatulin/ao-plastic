import type React from "react"
import type { Metadata } from "next"
import { getAdminRole } from "@/lib/admin-auth"
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav"
import { AdminNav } from "@/components/admin/admin-nav"

export const metadata: Metadata = { robots: { index: false, follow: false } }

/**
 * Общий layout админки: на телефоне добавляет нижнюю навигацию,
 * на десктопе — верхнюю панель разделов, доступных роли текущей сессии.
 * На странице входа (нет сессии) навигация не показывается.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const role = await getAdminRole()

  if (!role) {
    return <>{children}</>
  }

  return (
    <>
      <AdminNav role={role} />
      <div className="pb-16 lg:pb-0">{children}</div>
      <AdminMobileNav role={role} />
    </>
  )
}
