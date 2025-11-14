"use client"

import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from "react"

type Language = "ru" | "en"

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

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Определяем язык сразу при инициализации
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("lang") as Language
      if (saved && (saved === "ru" || saved === "en")) {
        return saved
      }
    }
    return "ru"
  })
  
  const [translations, setTranslations] = useState<Record<string, any>>(() => {
    // Пытаемся использовать кэш при инициализации
    if (typeof window !== "undefined" && translationsCache[lang]) {
      return translationsCache[lang] || {}
    }
    return {}
  })
  
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

  // Обработка изменения языка из localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem("lang") as Language
      if (saved && (saved === "ru" || saved === "en") && saved !== lang) {
        setLangState(saved)
      }
    }
    
    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [lang])

  const setLang = (newLang: Language) => {
    setLangState(newLang)
    localStorage.setItem("lang", newLang)
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
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
