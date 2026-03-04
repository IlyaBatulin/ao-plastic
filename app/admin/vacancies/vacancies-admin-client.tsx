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
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react"
import { AdminLink } from "@/components/admin-link"

interface Vacancy {
  id: number
  title: string
  department: string | null
  location: string | null
  type: string | null
  description: string | null
  requirements: string | null
  responsibilities: string | null
  conditions: string | null
  salary: string | null
  is_active: boolean
  sort: number
}

export function VacanciesAdmin() {
  const router = useRouter()
  const [vacancies, setVacancies] = useState<Vacancy[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    type: "",
    description: "",
    requirements: "",
    responsibilities: "",
    conditions: "",
    salary: "",
    is_active: true,
    sort: 0,
  })

  useEffect(() => {
    fetchVacancies()
  }, [])

  const fetchVacancies = async () => {
    try {
      const response = await fetch("/api/admin/vacancies")
      if (response.ok) {
        const data = await response.json()
        setVacancies(data)
      }
    } catch (error) {
      console.error("Ошибка загрузки вакансий:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = () => {
    setSelectedVacancy(null)
    setFormData({
      title: "",
      department: "",
      location: "",
      type: "",
      description: "",
      requirements: "",
      responsibilities: "",
      conditions: "",
      salary: "",
      is_active: true,
      sort: 0,
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (vacancy: Vacancy) => {
    setSelectedVacancy(vacancy)
    setFormData({
      title: vacancy.title || "",
      department: vacancy.department || "",
      location: vacancy.location || "",
      type: vacancy.type || "",
      description: vacancy.description || "",
      requirements: vacancy.requirements || "",
      responsibilities: vacancy.responsibilities || "",
      conditions: vacancy.conditions || "",
      salary: vacancy.salary || "",
      is_active: vacancy.is_active,
      sort: vacancy.sort || 0,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (vacancy: Vacancy) => {
    setSelectedVacancy(vacancy)
    setIsDeleteDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = selectedVacancy
        ? `/api/admin/vacancies/${selectedVacancy.id}`
        : "/api/admin/vacancies"
      const method = selectedVacancy ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsDialogOpen(false)
        fetchVacancies()
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
    if (!selectedVacancy) return

    try {
      const response = await fetch(`/api/admin/vacancies/${selectedVacancy.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setIsDeleteDialogOpen(false)
        setSelectedVacancy(null)
        fetchVacancies()
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
              <h1 className="text-2xl font-bold text-foreground">Управление вакансиями</h1>
            </div>
            <Button onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Создать вакансию
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
        ) : vacancies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Вакансии не найдены</p>
            <Button onClick={handleCreate}>Создать первую вакансию</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {vacancies.map((vacancy) => (
              <div
                key={vacancy.id}
                className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-foreground">{vacancy.title}</h3>
                      {!vacancy.is_active && (
                        <span className="text-xs px-2 py-1 bg-muted rounded text-muted-foreground">
                          Неактивна
                        </span>
                      )}
                    </div>
                    {vacancy.department && (
                      <p className="text-sm text-primary font-medium mb-2">{vacancy.department}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      {vacancy.location && <span>📍 {vacancy.location}</span>}
                      {vacancy.type && <span>⏰ {vacancy.type}</span>}
                      {vacancy.salary && <span>💰 {vacancy.salary}</span>}
                    </div>
                    {vacancy.description && (
                      <p className="text-muted-foreground line-clamp-2">{vacancy.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="icon" onClick={() => handleEdit(vacancy)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDelete(vacancy)}>
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
            <DialogTitle>{selectedVacancy ? "Редактировать вакансию" : "Создать вакансию"}</DialogTitle>
            <DialogDescription>Заполните информацию о вакансии</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="title">Название вакансии *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="department">Отдел</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Местоположение</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Тип занятости</Label>
                  <Input
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    placeholder="Например: Полная занятость"
                  />
                </div>
                <div>
                  <Label htmlFor="salary">Зарплата</Label>
                  <Input
                    id="salary"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    placeholder="Например: от 50000 руб"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="requirements">Требования</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="responsibilities">Обязанности</Label>
                <Textarea
                  id="responsibilities"
                  value={formData.responsibilities}
                  onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="conditions">Условия работы</Label>
                <Textarea
                  id="conditions"
                  value={formData.conditions}
                  onChange={(e) => setFormData({ ...formData, conditions: e.target.value })}
                  rows={3}
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
                  <Label htmlFor="is_active">Активна</Label>
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
            <AlertDialogTitle>Удалить вакансию?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить вакансию "{selectedVacancy?.title}"? Это действие нельзя отменить.
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

