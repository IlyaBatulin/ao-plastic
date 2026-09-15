"use client"

import { useEffect } from "react"
import { COOKIE_CONSENT_READY_EVENT } from "@/lib/cookie-consent"

// The home page owns its logo introduction within the hero.
export function LoadingScreen() {
  useEffect(() => {
    window.dispatchEvent(new Event(COOKIE_CONSENT_READY_EVENT))
  }, [])
  return null
}
