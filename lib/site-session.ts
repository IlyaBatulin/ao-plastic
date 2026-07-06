import { createHmac, randomBytes } from "crypto"
import { safeEqual } from "@/lib/admin-session"

/**
 * Подписанный токен для парольного доступа к сайту (SITE_PASSWORD).
 * Раньше кука хранила статичное значение "authenticated", которое можно
 * было просто подставить руками — теперь значение подписано HMAC.
 */

const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000 // 30 дней
const COOKIE_NAME = "site_auth"

function getSecret(): string {
  return process.env.SITE_SESSION_SECRET || process.env.SITE_PASSWORD || ""
}

export function createSiteSessionToken(): string {
  const secret = getSecret()
  if (!secret) throw new Error("SITE_PASSWORD must be set")
  const exp = Date.now() + SESSION_DURATION_MS
  const rnd = randomBytes(16).toString("hex")
  const payload = `${exp}.${rnd}`
  const signature = createHmac("sha256", secret).update(payload).digest("hex")
  return `${Buffer.from(payload).toString("base64url")}.${signature}`
}

export function verifySiteSessionToken(token: string): boolean {
  try {
    const secret = getSecret()
    if (!secret) return false
    const [payloadB64, signature] = token.split(".")
    if (!payloadB64 || !signature) return false

    const payload = Buffer.from(payloadB64, "base64url").toString("utf8")
    const expectedSig = createHmac("sha256", secret).update(payload).digest("hex")
    if (!safeEqual(signature, expectedSig)) return false

    const [expStr] = payload.split(".")
    const exp = parseInt(expStr, 10)
    return Number.isFinite(exp) && Date.now() < exp
  } catch {
    return false
  }
}

export { COOKIE_NAME as SITE_AUTH_COOKIE }
