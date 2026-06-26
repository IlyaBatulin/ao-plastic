import type { Language } from "@/lib/language"

export const COOKIE_CONSENT_COOKIE = "cookie_consent"
export const COOKIE_CONSENT_VALUE = "accepted"
export const COOKIE_CONSENT_MAX_AGE = 60 * 60 * 24 * 365
export const COOKIE_CONSENT_READY_EVENT = "cookie-consent:ready"

export const COOKIE_CONSENT_COPY = {
  ru: {
    title: "Уведомление об использовании cookies",
    message:
      "Мы используем cookies для корректной работы сайта, сохранения настроек и анализа посещаемости. Подробнее — в",
    privacyLink: "политике конфиденциальности",
    accept: "Принять",
    closeAria: "Закрыть уведомление о cookies",
  },
  en: {
    title: "Cookie notice",
    message:
      "We use cookies to ensure the site works properly, save your preferences, and analyze traffic. Learn more in our",
    privacyLink: "privacy policy",
    accept: "Accept",
    closeAria: "Close cookie notice",
  },
} as const satisfies Record<Language, Record<string, string>>

export type CookieConsentCopyKey = keyof (typeof COOKIE_CONSENT_COPY)["ru"]

export function getCookieConsentText(
  lang: Language,
  key: CookieConsentCopyKey,
  t: (key: string) => unknown
): string {
  const translated = t(`cookieConsent.${key}`)
  if (typeof translated === "string" && translated.trim()) {
    return translated
  }
  return COOKIE_CONSENT_COPY[lang][key]
}

export function hasCookieConsent(): boolean {
  if (typeof window === "undefined") return false

  try {
    if (localStorage.getItem(COOKIE_CONSENT_COOKIE) === COOKIE_CONSENT_VALUE) {
      return true
    }
  } catch {
    // ignore
  }

  return document.cookie
    .split(";")
    .some((part) => part.trim().startsWith(`${COOKIE_CONSENT_COOKIE}=${COOKIE_CONSENT_VALUE}`))
}

export function acceptCookieConsent() {
  if (typeof window === "undefined") return

  document.cookie = `${COOKIE_CONSENT_COOKIE}=${COOKIE_CONSENT_VALUE};path=/;max-age=${COOKIE_CONSENT_MAX_AGE};SameSite=Lax`

  try {
    localStorage.setItem(COOKIE_CONSENT_COOKIE, COOKIE_CONSENT_VALUE)
  } catch {
    // ignore
  }
}
