"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatCompanyRequisitesForClipboard } from "@/lib/company-requisites"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"

export function CopyRequisitesButton() {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()
  const { lang } = useLanguage()
  const en = lang === "en"

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatCompanyRequisitesForClipboard(lang))
      setCopied(true)
      toast({
        title: en ? "Copied" : "Скопировано",
        description: en ? "Company details copied to the clipboard" : "Реквизиты скопированы в буфер обмена",
      })
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      toast({
        title: en ? "Could not copy" : "Не удалось скопировать",
        description: en ? "Allow clipboard access in your browser" : "Разрешите доступ к буферу обмена в браузере",
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
          {en ? "Copied" : "Скопировано"}
        </>
      ) : (
        <>
          <Copy className="mr-2 h-4 w-4" />
          {en ? "Copy details" : "Скопировать карточку"}
        </>
      )}
    </Button>
  )
}
