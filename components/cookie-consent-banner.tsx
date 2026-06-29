"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import {
  acceptCookieConsent,
  COOKIE_CONSENT_READY_EVENT,
  getCookieConsentText,
  hasCookieConsent,
} from "@/lib/cookie-consent"

export function CookieConsentBanner() {
  const { t, lang } = useLanguage()
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const title = getCookieConsentText(lang, "title", t)
  const message = getCookieConsentText(lang, "message", t)
  const privacyLink = getCookieConsentText(lang, "privacyLink", t)
  const acceptLabel = getCookieConsentText(lang, "accept", t)
  const closeAria = getCookieConsentText(lang, "closeAria", t)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    if (hasCookieConsent()) return

    const showBanner = () => {
      if (!hasCookieConsent()) {
        setIsVisible(true)
      }
    }

    const splashPending = document.documentElement.classList.contains("splash-pending")

    if (!splashPending) {
      const timer = window.setTimeout(showBanner, 400)
      return () => window.clearTimeout(timer)
    }

    window.addEventListener(COOKIE_CONSENT_READY_EVENT, showBanner, { once: true })
    const fallbackTimer = window.setTimeout(showBanner, 4000)

    return () => {
      window.removeEventListener(COOKIE_CONSENT_READY_EVENT, showBanner)
      window.clearTimeout(fallbackTimer)
    }
  }, [mounted])

  const handleAccept = () => {
    acceptCookieConsent()
    setIsVisible(false)
  }

  if (!mounted || !isVisible) return null

  return createPortal(
    <div
      role="dialog"
      aria-live="polite"
      aria-label={title}
      className="fixed inset-x-0 bottom-0 z-[10001] px-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] pt-2 animate-in fade-in slide-in-from-bottom-4 duration-300 sm:px-6"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 rounded-2xl border border-border bg-background p-4 shadow-2xl sm:flex-row sm:items-center sm:gap-6 sm:p-5">
        <p className="flex-1 text-sm leading-relaxed text-foreground sm:text-base">
          {message}{" "}
          <Link
            href="/legal/privacy-policy"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            {privacyLink}
          </Link>
          .
        </p>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Button onClick={handleAccept} className="min-w-[7.5rem]">
            {acceptLabel}
          </Button>
          <button
            type="button"
            onClick={handleAccept}
            className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={closeAria}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
