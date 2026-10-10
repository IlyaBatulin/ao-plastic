"use client"

import { use, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Lock } from "lucide-react"
import type { NextPageProps } from "@/lib/next-page-props"
import { useLanguage } from "@/contexts/language-context"

export default function SiteLogin({ params, searchParams }: NextPageProps) {
  const { lang } = useLanguage()
  const en = lang === "en"
  use(params ?? Promise.resolve({}))
  use(searchParams ?? Promise.resolve({}))
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/site-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Перенаправляем на главную страницу или туда, откуда пришли
        const returnUrl = new URLSearchParams(window.location.search).get("return") || "/"
        router.push(returnUrl)
        router.refresh()
      } else {
        setError(en ? "Unable to sign in. Please check your password and try again." : data.error || "Неверный пароль")
      }
    } catch (err) {
      setError(en ? "Connection error. Please try again." : "Ошибка подключения")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-xl border border-border p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{en ? "Website access" : "Доступ к сайту"}</h1>
            <p className="text-muted-foreground">{en ? "Enter your password to continue" : "Введите пароль для входа"}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                {en ? "Password" : "Пароль"}
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={en ? "Enter password" : "Введите пароль"}
                className="h-12"
                autoFocus
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? (en ? "Checking…" : "Проверка...") : (en ? "Sign in" : "Войти")}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

