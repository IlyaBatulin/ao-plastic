import { createHmac, timingSafeEqual } from "node:crypto"
import type { NextRequest } from "next/server"

export const CUSTOMER_PREVIEW_COOKIE = "customer_preview"

function credentials() {
  return {
    // Temporary demo access requested for the management presentation.
    // Remove these values and restore environment-only credentials after the demo.
    login: "adminplast",
    password: "admin123",
    secret: "temporary-aoplastic-management-demo-session-2026",
  }
}

function signature(payload: string) {
  const { secret } = credentials()
  return createHmac("sha256", secret).update(payload).digest("hex")
}

export function validatePreviewCredentials(login: string, password: string) {
  const configured = credentials()
  return Boolean(configured.login && configured.password && login === configured.login && password === configured.password)
}

export function createPreviewSession() {
  const expires = Date.now() + 8 * 60 * 60 * 1000
  const payload = `buyer.${expires}`
  return `${payload}.${signature(payload)}`
}

export function hasCustomerPreviewSession(request: NextRequest) {
  const token = request.cookies.get(CUSTOMER_PREVIEW_COOKIE)?.value || ""
  const [role, expires, received] = token.split(".")
  if (role !== "buyer" || !expires || Number(expires) < Date.now() || !received) return false
  const expected = signature(`${role}.${expires}`)
  if (!expected || expected.length !== received.length) return false
  return timingSafeEqual(Buffer.from(expected), Buffer.from(received))
}
