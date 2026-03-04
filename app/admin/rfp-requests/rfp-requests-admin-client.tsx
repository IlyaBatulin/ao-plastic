"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Pencil, Trash2, ArrowLeft, ClipboardList } from "lucide-react"
import { AdminLink } from "@/components/admin-link"

interface RfpRequest {
  id: number
  request_number: string
  title: string
  description: string | null
  details: string | null
  deadline: string | null
  customer: string | null
  is_active: boolean
  sort: number
}

export function RfpRequestsAdmin() {
  const router = useRouter()
  const [requests, setRequests] = useState<RfpRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<RfpRequest | null>(null)
  const [formData, setFormData] = useState({
    request_number: "",
    title: "",
    description: "",
    details: "",
    deadline: "",
    customer: "АО «Пластик»",
    is_active: true,
    sort: 0,
  })

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/admin/rfp-requests")
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

  const handleCreate = () => {
    setSelectedRequest(null)
    // Генерируем следующий номер запроса
    const maxNumber = requests.length > 0 
      ? Math.max(...requests.map(r => {
          const match = r.request_number.match(/REQ-(\d+)/)
          return match ? parseInt(match[1]) : 0
        }))
      : 0
    const nextNumber = `REQ-${String(maxNumber + 1).padStart(3, '0')}`
    
    setFormData({
      request_number: nextNumber,
      title: "",
      description: "",
      details: "",
      deadline: "",
      customer: "АО «Пластик»",
      is_active: true,
      sort: 0,
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (request: RfpRequest) => {
    setSelectedRequest(request)
    setFormData({
      request_number: request.request_number || "",
      title: request.title || "",
      description: request.description || "",
      details: request.details || "",
      deadline: request.deadline || "",
      customer: request.customer || "АО «Пластик»",
      is_active: request.is_active,
      sort: request.sort || 0,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (request: RfpRequest) => {
    setSelectedRequest(request)
    setIsDeleteDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = selectedRequest
        ? `/api/admin/rfp-requests/${selectedRequest.id}`
        : "/api/admin/rfp-requests"
      const method = selectedRequest ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsDialogOpen(false)
        fetchRequests()
      } else {
        const error = await response.json()
        alert(error.error || "Ошибка сохранения")
      }
    } catch (error) {
      console.error("Ошибка сохранения:", error)
      alert("Ошибка сохранения")
    }
  }

  const confirmDelete = async () => {
    if (!selectedRequest) return

    try {
      const response = await fetch(`/api/admin/rfp-requests/${selectedRequest.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setIsDeleteDialogOpen(false)
        setSelectedRequest(null)
        fetchRequests()
      } else {
        alert("Ошибка удаления")
      }
    } catch (error) {
      console.error("Ошибка удаления:", error)
      alert("Ошибка удаления")
    }
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
              <h1 className="text-2xl font-bold text-foreground">Управление запросами предложений</h1>
            </div>
            <Button onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Создать запрос
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 lg:px-8 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Загрузка...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Запросы не найдены</p>
            <Button onClick={handleCreate}>Создать первый запрос</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
                        <ClipboardList className="w-4 h-4" />
                        {request.request_number}
                      </div>
                      {!request.is_active && (
                        <span className="text-xs px-2 py-1 bg-muted rounded text-muted-foreground">
                          Неактивен
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{request.title}</h3>
                    {request.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{request.description}</p>
                    )}
                    {request.deadline && (
                      <p className="text-xs text-primary mb-2">📅 {request.deadline}</p>
                    )}
                    {request.customer && (
                      <p className="text-xs text-muted-foreground">Заказчик: {request.customer}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="icon" onClick={() => handleEdit(request)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDelete(request)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedRequest ? "Редактировать запрос" : "Создать запрос предложений"}</DialogTitle>
            <DialogDescription>Заполните информацию о запросе предложений</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="request_number">Номер запроса *</Label>
                  <Input
                    id="request_number"
                    value={formData.request_number}
                    onChange={(e) => setFormData({ ...formData, request_number: e.target.value })}
                    placeholder="REQ-001"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="customer">Заказчик</Label>
                  <Input
                    id="customer"
                    value={formData.customer}
                    onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                    placeholder="АО «Пластик»"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="title">Название запроса *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Например: Закупка полистирола"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Краткое описание запроса"
                />
              </div>

              <div>
                <Label htmlFor="details">Детали запроса</Label>
                <Textarea
                  id="details"
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  rows={5}
                  placeholder="Укажите детали: объем, характеристики, требования и т.д. (каждая строка - отдельный пункт)"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Каждая строка будет отображаться как отдельный пункт списка
                </p>
              </div>

              <div>
                <Label htmlFor="deadline">Срок подачи предложений</Label>
                <Input
                  id="deadline"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  placeholder="Например: до 15.12.2024"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sort">Порядок сортировки</Label>
                  <Input
                    id="sort"
                    type="number"
                    value={formData.sort}
                    onChange={(e) => setFormData({ ...formData, sort: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="flex items-center gap-2 pt-8">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="is_active">Активен</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Отмена
              </Button>
              <Button type="submit">Сохранить</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить запрос?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить запрос "{selectedRequest?.request_number} - {selectedRequest?.title}"? Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

