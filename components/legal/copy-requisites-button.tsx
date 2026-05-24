"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatCompanyRequisitesForClipboard } from "@/lib/company-requisites"
import { useToast } from "@/hooks/use-toast"

export function CopyRequisitesButton() {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatCompanyRequisitesForClipboard())
      setCopied(true)
      toast({
        title: "Скопировано",
        description: "Реквизиты скопированы в буфер обмена",
      })
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      toast({
        title: "Не удалось скопировать",
        description: "Разрешите доступ к буферу обмена в браузере",
        variant: "destructive",
      })
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className="shrink-0 border-primary/30 text-primary hover:bg-primary/10"
    >
      {copied ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Скопировано
        </>
      ) : (
        <>
          <Copy className="mr-2 h-4 w-4" />
          Скопировать карточку
        </>
      )}
    </Button>
  )
}
