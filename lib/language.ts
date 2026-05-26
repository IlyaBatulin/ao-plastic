export type Language = "ru" | "en"

export const LANG_COOKIE = "lang"

export function parseLanguage(value: string | undefined | null): Language {
  return value === "en" ? "en" : "ru"
}

export function persistLanguage(lang: Language) {
  if (typeof window === "undefined") return
  localStorage.setItem(LANG_COOKIE, lang)
  document.cookie = `${LANG_COOKIE}=${lang};path=/;max-age=31536000;SameSite=Lax`
}
