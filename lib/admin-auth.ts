import { cookies } from "next/headers"
import { verifySessionToken, COOKIE_NAME } from "@/lib/admin-session"
import { canAccessSection, type AdminRole } from "@/lib/admin-roles"

/** Возвращает роль текущей админ-сессии или null. */
export async function getAdminRole(): Promise<AdminRole | null> {
  const cookieStore = await cookies()
  const session = cookieStore.get(COOKIE_NAME)
  if (!session?.value) return null

  return verifySessionToken(session.value)
}

export async function isAdminAuthenticated(): Promise<boolean> {
  return (await getAdminRole()) !== null
}

/**
 * Проверка доступа роли к разделу админки.
 * Использовать в API-роутах: hasAdminSectionAccess("orders").
 */
export async function hasAdminSectionAccess(section: string): Promise<boolean> {
  const role = await getAdminRole()
  if (!role) return false
  return canAccessSection(role, section)
}
