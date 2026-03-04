"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Mail, Phone, Building2, Calendar, CheckCircle2, XCircle, Clock, ClipboardList } from "lucide-react"
import { AdminLink } from "@/components/admin-link"

interface RfpResponse {
  id: number
  rfp_request_id: number
  company_name: string
  email: string
  phone: string | null
  message: string | null
  status: string
  created_at: string
  rfp_request?: {
    id: number
    request_number: string
    title: string
  }
}

export function RfpResponsesAdmin() {
  const router = useRouter()
  const [responses, setResponses] = useState<RfpResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [groupedResponses, setGroupedResponses] = useState<Record<number, RfpResponse[]>>({})

  useEffect(() => {
    fetchResponses()
  }, [])

  useEffect(() => {
    // Группируем ответы по запросам
    const grouped: Record<number, RfpResponse[]> = {}
    responses.forEach((response) => {
      if (!grouped[response.rfp_request_id]) {
        grouped[response.rfp_request_id] = []
      }
      grouped[response.rfp_request_id].push(response)
    })
    setGroupedResponses(grouped)
  }, [responses])

  const fetchResponses = async () => {
    try {
      const response = await fetch("/api/admin/rfp-responses")
      if (response.ok) {
        const data = await response.json()
        setResponses(data)
      }
    } catch (error) {
      console.error("Ошибка загрузки ответов:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateStatus = async (responseId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/rfp-responses/${responseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        fetchResponses()
      }
    } catch (error) {
      console.error("Ошибка обновления статуса:", error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "reviewed":
        return <CheckCircle2 className="w-4 h-4 text-blue-500" />
      case "accepted":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "new":
        return "Новый"
      case "reviewed":
        return "Просмотрен"
      case "accepted":
        return "Принят"
      case "rejected":
        return "Отклонен"
      default:
        return status
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Загрузка...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <AdminLink href="/admin/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </AdminLink>
              <h1 className="text-2xl font-bold text-foreground">Ответы на запросы предложений</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 lg:px-8 py-8">
        {Object.keys(groupedResponses).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Ответов пока нет</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedResponses).map(([requestId, requestResponses]) => {
              const request = requestResponses[0]?.rfp_request
              return (
                <div key={requestId} className="bg-card rounded-xl border border-border p-6">
                  <div className="mb-6 pb-4 border-b border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <ClipboardList className="w-5 h-5 text-primary" />
                      <h2 className="text-2xl font-bold text-foreground">
                        {request?.request_number || `REQ-${requestId}`}
                      </h2>
                    </div>
                    <h3 className="text-lg text-muted-foreground mb-2">
                      {request?.title || `Запрос #${requestId}`}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Всего предложений: {requestResponses.length}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {requestResponses.map((response) => (
                      <div
                        key={response.id}
                        className="bg-background rounded-lg border border-border p-5 space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              {getStatusIcon(response.status)}
                              <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                                {getStatusLabel(response.status)}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(response.created_at).toLocaleString("ru-RU")}
                              </span>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm">
                                <Building2 className="w-4 h-4 text-primary" />
                                <span className="font-medium">{response.company_name}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="w-4 h-4 text-primary" />
                                <a href={`mailto:${response.email}`} className="text-primary hover:underline">
                                  {response.email}
                                </a>
                              </div>
                              {response.phone && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Phone className="w-4 h-4 text-primary" />
                                  <a href={`tel:${response.phone}`} className="text-primary hover:underline">
                                    {response.phone}
                                  </a>
                                </div>
                              )}
                              {response.message && (
                                <div className="mt-3 pt-3 border-t border-border">
                                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                                    {response.message}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-3 border-t border-border">
                          <Button
                            size="sm"
                            variant={response.status === "reviewed" ? "default" : "outline"}
                            onClick={() => updateStatus(response.id, "reviewed")}
                          >
                            Просмотрен
                          </Button>
                          <Button
                            size="sm"
                            variant={response.status === "accepted" ? "default" : "outline"}
                            onClick={() => updateStatus(response.id, "accepted")}
                          >
                            Принят
                          </Button>
                          <Button
                            size="sm"
                            variant={response.status === "rejected" ? "destructive" : "outline"}
                            onClick={() => updateStatus(response.id, "rejected")}
                          >
                            Отклонен
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

