import { createHmac, randomBytes } from "crypto"

const SESSION_DURATION_MS = 4 * 60 * 60 * 1000 // 4 часа
const COOKIE_NAME = "admin_session"

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET or ADMIN_PASSWORD must be set")
  }
  return secret
}

export function createSessionToken(): string {
  const secret = getSecret()
  const exp = Date.now() + SESSION_DURATION_MS
  const rnd = randomBytes(32).toString("hex")
  const payload = `${exp}.${rnd}`
  const signature = createHmac("sha256", secret).update(payload).digest("hex")
  return `${Buffer.from(payload).toString("base64url")}.${signature}`
}

export function verifySessionToken(token: string): boolean {
  try {
    const secret = getSecret()
    const [payloadB64, signature] = token.split(".")
    if (!payloadB64 || !signature) return false

    const payload = Buffer.from(payloadB64, "base64url").toString("utf8")
    const expectedSig = createHmac("sha256", secret).update(payload).digest("hex")
    if (signature !== expectedSig) return false

    const [expStr] = payload.split(".")
    const exp = parseInt(expStr, 10)
    return Date.now() < exp
  } catch {
    return false
  }
}

export { COOKIE_NAME }
