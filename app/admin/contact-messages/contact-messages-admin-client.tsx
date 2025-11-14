"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Mail, Phone, User, Clock, CheckCircle2, XCircle, Archive, MessageSquare } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ContactMessage {
  id: number
  source: string
  name: string
  email: string
  phone: string | null
  message: string
  status: string
  created_at: string
}

export function ContactMessagesAdmin() {
  const router = useRouter()
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterSource, setFilterSource] = useState<string>("all")

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/admin/contact-messages")
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    } catch (error) {
      console.error("Ошибка загрузки сообщений:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateStatus = async (messageId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/contact-messages/${messageId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        fetchMessages()
      }
    } catch (error) {
      console.error("Ошибка обновления статуса:", error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "read":
        return <CheckCircle2 className="w-4 h-4 text-blue-500" />
      case "replied":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case "archived":
        return <Archive className="w-4 h-4 text-gray-500" />
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "new":
        return "Новое"
      case "read":
        return "Прочитано"
      case "replied":
        return "Отвечено"
      case "archived":
        return "В архиве"
      default:
        return status
    }
  }

  const getSourceLabel = (source: string) => {
    switch (source) {
      case "contacts":
        return "Контакты"
      case "homepage":
        return "Главная страница"
      default:
        return source
    }
  }

  const filteredMessages = messages.filter((message) => {
    if (filterStatus !== "all" && message.status !== filterStatus) return false
    if (filterSource !== "all" && message.source !== filterSource) return false
    return true
  })

  const newMessagesCount = messages.filter((m) => m.status === "new").length

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
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground">Сообщения с сайта</h1>
                {newMessagesCount > 0 && (
                  <Badge variant="destructive" className="min-w-[24px] h-6 flex items-center justify-center px-1.5 text-xs font-bold rounded-full shadow-lg">
                    {newMessagesCount > 99 ? "99+" : newMessagesCount}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-foreground">Статус:</label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Все статусы" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="new">Новые</SelectItem>
                <SelectItem value="read">Прочитанные</SelectItem>
                <SelectItem value="replied">Отвеченные</SelectItem>
                <SelectItem value="archived">В архиве</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-foreground">Источник:</label>
            <Select value={filterSource} onValueChange={setFilterSource}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Все источники" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все источники</SelectItem>
                <SelectItem value="contacts">Контакты</SelectItem>
                <SelectItem value="homepage">Главная страница</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredMessages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Сообщений не найдено</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMessages.map((message) => (
              <div
                key={message.id}
                className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(message.status)}
                      <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                        {getStatusLabel(message.status)}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {getSourceLabel(message.source)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(message.created_at).toLocaleString("ru-RU")}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-primary" />
                        <span className="font-medium">{message.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-primary" />
                        <a href={`mailto:${message.email}`} className="text-primary hover:underline">
                          {message.email}
                        </a>
                      </div>
                      {message.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-primary" />
                          <a href={`tel:${message.phone}`} className="text-primary hover:underline">
                            {message.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-start gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground whitespace-pre-line">{message.message}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 mt-4 border-t border-border">
                  <Button
                    size="sm"
                    variant={message.status === "read" ? "default" : "outline"}
                    onClick={() => updateStatus(message.id, "read")}
                  >
                    Прочитано
                  </Button>
                  <Button
                    size="sm"
                    variant={message.status === "replied" ? "default" : "outline"}
                    onClick={() => updateStatus(message.id, "replied")}
                  >
                    Отвечено
                  </Button>
                  <Button
                    size="sm"
                    variant={message.status === "archived" ? "default" : "outline"}
                    onClick={() => updateStatus(message.id, "archived")}
                  >
                    В архив
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

