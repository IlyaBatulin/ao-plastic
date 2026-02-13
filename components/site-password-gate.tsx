"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"

const STORAGE_KEY = "site_access_granted"

export function SitePasswordGate({ children }: { children: React.ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return
    const stored = typeof window !== "undefined" && sessionStorage.getItem(STORAGE_KEY)
    if (stored === "1") {
      setIsUnlocked(true)
    }
  }, [isClient])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(false)
    setLoading(true)
    try {
      const res = await fetch("/api/site-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: password.trim() }),
      })
      const data = await res.json()
      if (data.success) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem(STORAGE_KEY, "1")
        }
        setIsUnlocked(true)
      } else {
        setError(true)
      }
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  // До гидратации — показываем контент, чтобы не было мигания
  if (!isClient) {
    return <>{children}</>
  }

  if (isUnlocked) {
    return <>{children}</>
  }

  return (
    <>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background">
        <div className="mx-4 w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-xl">
          <div className="mb-6 flex items-center justify-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-xl font-bold">Сайт в разработке</h1>
          </div>
          <p className="mb-6 text-center text-muted-foreground">
            Введите пароль для раннего доступа
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError(false)
              }}
              className="h-12 text-center"
              autoFocus
            />
            {error && (
              <p className="text-center text-sm text-destructive">
                Неверный пароль. Попробуйте ещё раз.
              </p>
            )}
            <Button type="submit" className="w-full h-12" disabled={loading}>
              {loading ? "Проверка…" : "Войти"}
            </Button>
          </form>
        </div>
      </div>
      {children}
    </>
  )
}
