"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ProductsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[products]", error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-background px-4 py-24">
      <div className="max-w-md text-center">
        <h1 className="mb-3 text-2xl font-bold text-foreground">
          Не удалось загрузить каталог
        </h1>
        <p className="mb-8 text-muted-foreground">
          Возможно, база данных временно недоступна. Попробуйте обновить страницу.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button type="button" onClick={() => reset()}>
            Попробовать снова
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/">На главную</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
