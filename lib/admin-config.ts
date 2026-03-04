/**
 * Путь к админ-панели. Только для сервера (middleware, redirect).
 * На клиенте используйте useAdminPath() — путь берётся из URL, не из кода.
 */
export function getAdminPath(): string {
  const path = process.env.ADMIN_PATH || "admin"
  return path.startsWith("/") ? path : `/${path}`
}
