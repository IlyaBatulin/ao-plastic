import { cookies } from "next/headers"
import { verifySessionToken } from "@/lib/admin-session"
import { COOKIE_NAME } from "@/lib/admin-session"

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get(COOKIE_NAME)
  if (!session?.value) return false

  // Поддержка старого формата для плавной миграции
  if (session.value === "authenticated") return true

  return verifySessionToken(session.value)
}

