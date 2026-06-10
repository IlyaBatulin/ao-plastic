"use client"

import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from "react"
import { type Language, persistLanguage } from "@/lib/language"

interface LanguageContextType {
  lang: Language
  setLang: (lang: Language) => void
  t: (key: string) => any
  translations: Record<string, any>
  isLoading: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Предзагружаем переводы для быстрого доступа
let translationsCache: Record<Language, Record<string, any> | null> = {
  ru: null,
  en: null,
}

export function LanguageProvider({
  children,
  initialLang = "ru",
}: {
  children: ReactNode
  initialLang?: Language
}) {
  const [lang, setLangState] = useState<Language>(initialLang)

  const [translations, setTranslations] = useState<Record<string, any>>(
    () => translationsCache[initialLang] || {}
  )
  const [loadedLang, setLoadedLang] = useState<Language | null>(() =>
    translationsCache[initialLang] ? initialLang : null
  )

  const [isLoading, setIsLoading] = useState(true)

  const applyTranslations = (nextLang: Language, data: Record<string, any>) => {
    translationsCache[nextLang] = data
    setTranslations(data)
    setLoadedLang(nextLang)
  }

  // Загружаем переводы сразу при монтировании
  useEffect(() => {
    const loadTranslations = async () => {
      setIsLoading(true)
      try {
        // Проверяем кэш
        if (translationsCache[lang]) {
          applyTranslations(lang, translationsCache[lang]!)
          setIsLoading(false)
          return
        }

        // Не показываем переводы другого языка, пока грузится выбранный
        setTranslations({})
        setLoadedLang(null)

        const response = await fetch(`/locales/${lang}.json`)
        if (!response.ok) throw new Error("Failed to fetch translations")
        const data = await response.json()

        applyTranslations(lang, data)
      } catch (error) {
        console.error("Failed to load translations:", error)
        // В случае ошибки используем пустой объект
        setTranslations({})
      } finally {
        setIsLoading(false)
      }
    }
    loadTranslations()
  }, [lang])

  // Синхронизация localStorage/cookie после гидратации (без чтения localStorage в useState)
  useEffect(() => {
    const saved = localStorage.getItem("lang") as Language | null
    const validSaved = saved === "en" || saved === "ru" ? saved : null

    if (validSaved && validSaved !== initialLang) {
      setLang(validSaved)
      return
    }

    persistLanguage(validSaved ?? initialLang)
  }, [initialLang])

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem("lang") as Language | null
      if ((saved === "ru" || saved === "en") && saved !== lang) {
        setLang(saved)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [lang])

  const setLang = (newLang: Language) => {
    setLangState(newLang)
    persistLanguage(newLang)
    if (translationsCache[newLang]) {
      applyTranslations(newLang, translationsCache[newLang]!)
      setIsLoading(false)
    } else {
      setTranslations({})
      setLoadedLang(null)
      setIsLoading(true)
    }
  }

  const t = useMemo(() => {
    return (key: string): any => {
      if (!key) return ""

      // Если переводы еще не загружены, возвращаем пустую строку
      // чтобы не показывать ключи типа "homepage"
      if (loadedLang !== lang) {
        return ""
      }

      if (isLoading && Object.keys(translations).length === 0) {
        return ""
      }

      // Поддержка вложенных ключей через точку (например, "dealersPage.badge")
      const keys = key.split(".")
      let value: any = translations
      
      for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
          value = value[k]
        } else {
          // Если ключ не найден, возвращаем пустую строку вместо ключа
          return ""
        }
      }
      
      // Возвращаем значение как есть (может быть строка, массив, объект и т.д.)
      return value !== undefined ? value : ""
    }
  }, [translations, isLoading, loadedLang, lang])

  return <LanguageContext.Provider value={{ lang, setLang, t, translations, isLoading }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    return {
      lang: "ru",
      setLang: () => {},
      t: () => "",
      translations: {},
      isLoading: true,
    }
  }
  return context
}
