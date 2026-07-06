"use client"

import { useState, useEffect } from "react"
import { ClipboardList } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface RfpRequest {
  id: number
  request_number: string
  title: string
  description: string | null
  details: string | null
  deadline: string | null
  customer: string | null
}

export function RfpRequestsClient() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [requests, setRequests] = useState<RfpRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState<Record<number, { company_name: string; email: string; phone: string; message: string }>>({})
  const [isSubmitting, setIsSubmitting] = useState<Record<number, boolean>>({})

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/rfp-requests")
      if (response.ok) {
        const data = await response.json()
        setRequests(data)
      }
    } catch (error) {
      console.error("Ошибка загрузки запросов:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Загрузка запросов...</p>
      </div>
    )
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">На данный момент открытых запросов нет</p>
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {requests.map((request) => {
        // Парсим details (каждая строка - отдельный пункт)
        const detailsList = request.details
          ? request.details.split('\n').filter(line => line.trim())
          : []

        return (
          <div key={request.id} className="rounded-3xl border border-border bg-card/80 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-border/60">
              <div className="inline-flex items-center gap-2 text-caption text-primary">
                <ClipboardList className="w-4 h-4" />
                {request.request_number}
              </div>
              <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary/80">
                {request.customer || t("suppliersPage.rfps.customer")}
              </span>
            </div>
            
            <h3 className="text-xl font-semibold text-foreground">{request.title}</h3>
            
            {request.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">{request.description}</p>
            )}
            
            {detailsList.length > 0 && (
              <ul className="space-y-2 text-sm text-muted-foreground">
                {detailsList.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{detail.trim()}</span>
                  </li>
                ))}
              </ul>
            )}
            
            {request.deadline && (
              <div className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 px-4 py-3 text-sm text-primary">
                📅 {request.deadline}
              </div>
            )}
            
            <form
              className="rounded-2xl border border-border bg-background p-5 space-y-4"
              onSubmit={async (e) => {
                e.preventDefault()
                const currentFormData = formData[request.id] || { company_name: "", email: "", phone: "", message: "" }
                
                if (!currentFormData.company_name || !currentFormData.email) {
                  toast({
                    title: "Заполните обязательные поля",
                    description: "Пожалуйста, укажите название компании и email для отправки предложения.",
                    variant: "destructive",
                    duration: 4000,
                  })
                  return
                }

                setIsSubmitting({ ...isSubmitting, [request.id]: true })
                try {
                  const response = await fetch("/api/rfp-responses", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      rfp_request_id: request.id,
                      ...currentFormData,
                    }),
                  })

                  if (response.ok) {
                    toast({
                      title: "Предложение отправлено",
                      description: "Ваше предложение отправлено и будет рассмотрено в ближайшее время. Мы свяжемся с вами по указанным контактам.",
                      duration: 5000,
                    })
                    setFormData({ ...formData, [request.id]: { company_name: "", email: "", phone: "", message: "" } })
                  } else {
                    const error = await response.json()
                    toast({
                      title: "Ошибка отправки",
                      description: error.error || "Произошла ошибка при отправке предложения. Пожалуйста, попробуйте еще раз.",
                      variant: "destructive",
                      duration: 5000,
                    })
                  }
                } catch (error) {
                  console.error("Ошибка:", error)
                  toast({
                    title: "Ошибка отправки",
                    description: "Произошла ошибка при отправке предложения. Пожалуйста, попробуйте еще раз.",
                    variant: "destructive",
                    duration: 5000,
                  })
                } finally {
                  setIsSubmitting({ ...isSubmitting, [request.id]: false })
                }
              }}
            >
              <h4 className="text-sm font-semibold text-foreground">{t("suppliersPage.rfps.submitProposal")}</h4>
              <p className="text-xs text-muted-foreground">
                {t("suppliersPage.rfps.submitDescription")}
              </p>
              <div className="grid gap-3">
                <Input
                  type="text"
                  placeholder={t("suppliersPage.rfps.companyPlaceholder")}
                  value={formData[request.id]?.company_name || ""}
                  onChange={(e) => setFormData({
                    ...formData,
                    [request.id]: { ...(formData[request.id] || { company_name: "", email: "", phone: "", message: "" }), company_name: e.target.value }
                  })}
                  required
                />
                <Input
                  type="email"
                  placeholder={t("suppliersPage.rfps.emailPlaceholder")}
                  value={formData[request.id]?.email || ""}
                  onChange={(e) => setFormData({
                    ...formData,
                    [request.id]: { ...(formData[request.id] || { company_name: "", email: "", phone: "", message: "" }), email: e.target.value }
                  })}
                  required
                />
                <Input
                  type="tel"
                  placeholder="Телефон"
                  value={formData[request.id]?.phone || ""}
                  onChange={(e) => setFormData({
                    ...formData,
                    [request.id]: { ...(formData[request.id] || { company_name: "", email: "", phone: "", message: "" }), phone: e.target.value }
                  })}
                />
                <Textarea
                  placeholder={t("suppliersPage.rfps.conditionsPlaceholder")}
                  rows={3}
                  value={formData[request.id]?.message || ""}
                  onChange={(e) => setFormData({
                    ...formData,
                    [request.id]: { ...(formData[request.id] || { company_name: "", email: "", phone: "", message: "" }), message: e.target.value }
                  })}
                />
                <button
                  type="submit"
                  disabled={isSubmitting[request.id]}
                  className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.02] hover:bg-primary/90 disabled:opacity-50"
                >
                  {isSubmitting[request.id] ? "Отправка..." : t("suppliersPage.rfps.submitButton")}
                </button>
              </div>
            </form>
          </div>
        )
      })}
    </div>
  )
}

