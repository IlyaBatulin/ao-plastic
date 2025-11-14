"use client"

import { useState, useEffect } from "react"
import { Briefcase, MapPin, Clock } from "lucide-react"
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
import { useToast } from "@/hooks/use-toast"

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
}

export function VacanciesClient() {
  const { toast } = useToast()
  const [vacancies, setVacancies] = useState<Vacancy[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    company_name: "",
    email: "",
    phone: "",
    message: "",
  })

  useEffect(() => {
    fetchVacancies()
  }, [])

  const fetchVacancies = async () => {
    try {
      const response = await fetch("/api/vacancies")
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

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Загрузка вакансий...</p>
      </div>
    )
  }

  if (vacancies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">На данный момент открытых вакансий нет</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {vacancies.map((vacancy) => (
        <div
          key={vacancy.id}
          className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-all"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-2xl font-semibold mb-2">{vacancy.title}</h3>
              {vacancy.department && (
                <p className="text-primary font-medium">{vacancy.department}</p>
              )}
            </div>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
          </div>

          {vacancy.description && (
            <p className="text-muted-foreground mb-4">{vacancy.description}</p>
          )}

          {vacancy.requirements && (
            <div className="mb-4">
              <h4 className="font-semibold text-foreground mb-2">Требования:</h4>
              <p className="text-muted-foreground whitespace-pre-line">{vacancy.requirements}</p>
            </div>
          )}

          {vacancy.responsibilities && (
            <div className="mb-4">
              <h4 className="font-semibold text-foreground mb-2">Обязанности:</h4>
              <p className="text-muted-foreground whitespace-pre-line">{vacancy.responsibilities}</p>
            </div>
          )}

          {vacancy.conditions && (
            <div className="mb-4">
              <h4 className="font-semibold text-foreground mb-2">Условия работы:</h4>
              <p className="text-muted-foreground whitespace-pre-line">{vacancy.conditions}</p>
            </div>
          )}

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            {vacancy.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {vacancy.location}
              </span>
            )}
            {vacancy.type && (
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {vacancy.type}
              </span>
            )}
            {vacancy.salary && <span>💰 {vacancy.salary}</span>}
          </div>

          <Button onClick={() => {
            setSelectedVacancy(vacancy)
            setFormData({ company_name: "", email: "", phone: "", message: "" })
            setIsDialogOpen(true)
          }}>
            Откликнуться
          </Button>
        </div>
      ))}

      {/* Response Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Отклик на вакансию: {selectedVacancy?.title}</DialogTitle>
            <DialogDescription>Заполните форму для отклика на вакансию</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              if (!selectedVacancy) return

              setIsSubmitting(true)
              try {
                const response = await fetch("/api/vacancy-responses", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    vacancy_id: selectedVacancy.id,
                    ...formData,
                  }),
                })

                if (response.ok) {
                  toast({
                    title: "Заявка отправлена",
                    description: "Ваша заявка отправлена и будет рассмотрена в ближайшее время. Мы свяжемся с вами по указанным контактам.",
                    duration: 5000,
                  })
                  setIsDialogOpen(false)
                  setFormData({ company_name: "", email: "", phone: "", message: "" })
                } else {
                  const error = await response.json()
                  toast({
                    title: "Ошибка отправки",
                    description: error.error || "Произошла ошибка при отправке заявки. Пожалуйста, попробуйте еще раз.",
                    variant: "destructive",
                    duration: 5000,
                  })
                }
              } catch (error) {
                console.error("Ошибка:", error)
                toast({
                  title: "Ошибка отправки",
                  description: "Произошла ошибка при отправке заявки. Пожалуйста, попробуйте еще раз.",
                  variant: "destructive",
                  duration: 5000,
                })
              } finally {
                setIsSubmitting(false)
              }
            }}
          >
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="company_name">Компания / ФИО</Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  placeholder="Название компании или ваше ФИО"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Телефон</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+7 (999) 123-45-67"
                />
              </div>
              <div>
                <Label htmlFor="message">Сопроводительное письмо</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  placeholder="Расскажите о себе, своем опыте..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Отмена
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Отправка..." : "Отправить отклик"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

