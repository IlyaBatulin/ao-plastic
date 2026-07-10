/**
 * Защита публичных форм: rate limiting + валидация ввода.
 *
 * Хранилище в памяти процесса. Этого достаточно для одного инстанса.
 * Для нескольких инстансов / serverless нужен внешний стор (Redis/Upstash).
 */

import { NextResponse } from "next/server"

type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()
let lastSweep = 0

/** Периодически чистим протухшие записи, чтобы Map не рос бесконечно. */
function sweep(now: number): void {
  if (now - lastSweep < 60_000) return
  lastSweep = now
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key)
  }
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()
  return req.headers.get("x-real-ip")?.trim() || "unknown"
}

/**
 * Проверяет лимит запросов для (scope + IP).
 * @returns ok=false если лимит исчерпан, с retryAfter в секундах.
 */
export function checkRateLimit(
  req: Request,
  scope: string,
  max = 5,
  windowMs = 10 * 60 * 1000
): { ok: boolean; retryAfter: number } {
  const now = Date.now()
  sweep(now)

  const key = `${scope}:${getClientIp(req)}`
  const bucket = buckets.get(key)

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, retryAfter: 0 }
  }

  if (bucket.count >= max) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) }
  }

  bucket.count += 1
  return { ok: true, retryAfter: 0 }
}

/** Готовый ответ 429 с заголовком Retry-After. */
export function rateLimitedResponse(retryAfter: number): NextResponse {
  const minutes = Math.max(1, Math.ceil(retryAfter / 60))
  return NextResponse.json(
    { error: `Слишком много запросов. Попробуйте через ${minutes} мин.` },
    { status: 429, headers: { "Retry-After": String(retryAfter) } }
  )
}

/** Отклоняет слишком большое тело запроса по заголовку Content-Length. */
export function isBodyTooLarge(req: Request, maxBytes = 100_000): boolean {
  const length = Number(req.headers.get("content-length") || 0)
  return Number.isFinite(length) && length > maxBytes
}

/**
 * Нормализует строковое поле: тримит и проверяет длину.
 * @returns строку или null, если пусто/не строка/слишком длинно.
 */
export function asString(value: unknown, maxLen: number): string | null {
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  if (!trimmed || trimmed.length > maxLen) return null
  return trimmed
}

/** Опциональное строковое поле: пусто → null, иначе валидация длины. */
export function asOptionalString(value: unknown, maxLen: number): string | null | undefined {
  if (value === undefined || value === null || value === "") return null
  if (typeof value !== "string") return undefined
  const trimmed = value.trim()
  if (!trimmed) return null
  if (trimmed.length > maxLen) return undefined
  return trimmed
}

export function isValidEmail(value: string): boolean {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

/**
 * Безопасно читает JSON-тело запроса.
 * @returns объект тела или null, если тело отсутствует, не JSON или не объект.
 */
export async function readJsonBody<T extends Record<string, unknown> = Record<string, unknown>>(
  req: Request
): Promise<T | null> {
  try {
    const parsed = await req.json()
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null
    return parsed as T
  } catch {
    return null
  }
}
