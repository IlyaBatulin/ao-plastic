/**
 * Простой rate limiting для защиты от перебора пароля.
 * В production лучше использовать Redis или подобное хранилище.
 */

const attempts = new Map<string, { count: number; blockedUntil: number }>()

const MAX_ATTEMPTS = 5
const BLOCK_DURATION_MS = 15 * 60 * 1000 // 15 минут

function getClientKey(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for")
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown"
  return ip
}

export function isRateLimited(req: Request): boolean {
  const key = getClientKey(req)
  const record = attempts.get(key)

  if (!record) return false

  if (Date.now() < record.blockedUntil) {
    return true
  }

  // Блокировка истекла — сбрасываем
  attempts.delete(key)
  return false
}

export function getBlockedUntil(req: Request): number | null {
  const key = getClientKey(req)
  const record = attempts.get(key)
  if (!record || Date.now() >= record.blockedUntil) return null
  return record.blockedUntil
}

export function recordFailedAttempt(req: Request): void {
  const key = getClientKey(req)
  const now = Date.now()
  const record = attempts.get(key)

  if (!record) {
    attempts.set(key, { count: 1, blockedUntil: 0 })
    return
  }

  if (now < record.blockedUntil) return // Уже заблокирован

  const newCount = record.count + 1
  if (newCount >= MAX_ATTEMPTS) {
    attempts.set(key, {
      count: newCount,
      blockedUntil: now + BLOCK_DURATION_MS,
    })
  } else {
    attempts.set(key, { count: newCount, blockedUntil: 0 })
  }
}

export function clearAttempts(req: Request): void {
  const key = getClientKey(req)
  attempts.delete(key)
}
