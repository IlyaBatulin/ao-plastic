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
  
  const [isLoading, setIsLoading] = useState(true)

  // Загружаем переводы сразу при монтировании
  useEffect(() => {
    const loadTranslations = async () => {
      setIsLoading(true)
      try {
        // Проверяем кэш
        if (translationsCache[lang]) {
          setTranslations(translationsCache[lang]!)
          setIsLoading(false)
          return
        }
        
        const response = await fetch(`/locales/${lang}.json`)
        if (!response.ok) throw new Error("Failed to fetch translations")
        const data = await response.json()
        
        // Сохраняем в кэш
        translationsCache[lang] = data
        setTranslations(data)
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
      setLangState(validSaved)
      persistLanguage(validSaved)
      return
    }

    persistLanguage(validSaved ?? initialLang)
  }, [initialLang])

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem("lang") as Language | null
      if ((saved === "ru" || saved === "en") && saved !== lang) {
        setLangState(saved)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [lang])

  const setLang = (newLang: Language) => {
    setLangState(newLang)
    persistLanguage(newLang)
  }

  const t = useMemo(() => {
    return (key: string): any => {
      // Если переводы еще не загружены, возвращаем пустую строку
      // чтобы не показывать ключи типа "homepage"
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
  }, [translations, isLoading])

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
