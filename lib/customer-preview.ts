import { createHmac, timingSafeEqual } from "node:crypto"
import type { NextRequest } from "next/server"

export const CUSTOMER_PREVIEW_COOKIE = "customer_preview"

function credentials() {
  return {
    login: process.env.CUSTOMER_PREVIEW_LOGIN || (process.env.NODE_ENV !== "production" ? "adminplast" : ""),
    password: process.env.CUSTOMER_PREVIEW_PASSWORD || (process.env.NODE_ENV !== "production" ? "admin" : ""),
    secret: process.env.CUSTOMER_PREVIEW_SECRET || process.env.ADMIN_SESSION_SECRET || "",
  }
}

function signature(payload: string) {
  const { secret } = credentials()
  if (!secret && process.env.NODE_ENV === "production") return ""
  return createHmac("sha256", secret || "local-customer-preview").update(payload).digest("hex")
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
