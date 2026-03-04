"use client"

import { usePathname } from "next/navigation"

/**
 * Получает путь к админке из текущего URL.
 * Путь НЕ хранится в коде — только в URL, когда вы уже на странице админки.
 * Так путь нельзя найти в DevTools или исходниках страницы.
 */
export function useAdminPath(): string {
  const pathname = usePathname() ?? ""

  // Если мы на /admin (без секретного пути)
  if (pathname.startsWith("/admin")) {
    return "/admin"
  }

  // Извлекаем первый сегмент пути: /panel-xyz/dashboard → /panel-xyz
  const firstSegment = pathname.split("/").filter(Boolean)[0]
  return firstSegment ? `/${firstSegment}` : "/admin"
}
