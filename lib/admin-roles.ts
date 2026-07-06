/**
 * Роли админ-панели и права доступа к разделам.
 *
 * - director  (руководитель)  — полный доступ ко всем разделам
 * - sales     (продажник)     — заказы, заявки, сообщения, менеджеры
 * - marketing (маркетолог)    — контент: каталог, новости, вакансии
 *
 * Пароли ролей задаются в .env.local:
 *   ADMIN_PASSWORD           — руководитель (существующий пароль)
 *   ADMIN_SALES_PASSWORD     — продажник
 *   ADMIN_MARKETING_PASSWORD — маркетолог
 */

export type AdminRole = "director" | "sales" | "marketing"

export const ADMIN_ROLES: AdminRole[] = ["director", "sales", "marketing"]

export function isAdminRole(value: unknown): value is AdminRole {
  return value === "director" || value === "sales" || value === "marketing"
}

export const ADMIN_ROLE_LABELS: Record<AdminRole, string> = {
  director: "Руководитель",
  sales: "Отдел продаж",
  marketing: "Маркетинг",
}

/**
 * Разделы админки (совпадают с сегментами URL /admin/<section>
 * и путями API /api/admin/<section>).
 */
export const SECTION_ACCESS: Record<string, AdminRole[]> = {
  dashboard: ["director", "sales", "marketing"],
  stats: ["director", "sales", "marketing"],

  // Продажи
  orders: ["director", "sales"],
  "contact-messages": ["director", "sales"],
  "rfp-requests": ["director", "sales"],
  "rfp-responses": ["director", "sales"],
  managers: ["director", "sales"],

  // Контент / маркетинг
  products: ["director", "marketing"],
  categories: ["director", "marketing"],
  subcategories: ["director", "marketing"],
  news: ["director", "marketing"],
  vacancies: ["director", "marketing"],
  "vacancy-responses": ["director", "marketing"],
  management: ["director", "marketing"],
  upload: ["director", "marketing"],
}

export function canAccessSection(role: AdminRole, section: string): boolean {
  if (role === "director") return true
  const allowed = SECTION_ACCESS[section]
  // Неизвестный раздел — только руководителю, чтобы новые разделы
  // не открывались ролям случайно.
  if (!allowed) return false
  return allowed.includes(role)
}
