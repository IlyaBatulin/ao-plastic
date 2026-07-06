import { createHmac, randomBytes, timingSafeEqual, createHash } from "crypto"
import { isAdminRole, type AdminRole } from "@/lib/admin-roles"

const SESSION_DURATION_MS = 4 * 60 * 60 * 1000 // 4 часа
const COOKIE_NAME = "admin_session"

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET or ADMIN_PASSWORD must be set")
  }
  return secret
}

/**
 * Сравнение строк за постоянное время (защита от timing-атак).
 * Сначала хэшируем, чтобы не раскрывать длину секрета.
 */
export function safeEqual(left: string, right: string): boolean {
  const a = createHash("sha256").update(left).digest()
  const b = createHash("sha256").update(right).digest()
  return timingSafeEqual(a, b)
}

export function createSessionToken(role: AdminRole): string {
  const secret = getSecret()
  const exp = Date.now() + SESSION_DURATION_MS
  const rnd = randomBytes(32).toString("hex")
  const payload = `${exp}.${rnd}.${role}`
  const signature = createHmac("sha256", secret).update(payload).digest("hex")
  return `${Buffer.from(payload).toString("base64url")}.${signature}`
}

/**
 * Проверяет токен сессии. Возвращает роль или null, если токен невалиден.
 * Старые токены без роли считаются невалидными (потребуется повторный вход).
 */
export function verifySessionToken(token: string): AdminRole | null {
  try {
    const secret = getSecret()
    const [payloadB64, signature] = token.split(".")
    if (!payloadB64 || !signature) return null

    const payload = Buffer.from(payloadB64, "base64url").toString("utf8")
    const expectedSig = createHmac("sha256", secret).update(payload).digest("hex")
    if (!safeEqual(signature, expectedSig)) return null

    const [expStr, , role] = payload.split(".")
    const exp = parseInt(expStr, 10)
    if (!Number.isFinite(exp) || Date.now() >= exp) return null
    if (!isAdminRole(role)) return null

    return role
  } catch {
    return null
  }
}

export { COOKIE_NAME }
