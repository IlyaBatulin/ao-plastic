"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

interface Category {
  id: string
  name: string
  slug: string
}

interface Subcategory {
  id: string
  name: string
  slug: string
  category_id: string
  description: string | null
  sort: number
  is_active: boolean
}

export function SubcategoryEditClient({ 
  params, 
  isNew = false 
}: { 
  params?: { id: string }
  isNew?: boolean
}) {
  const router = useRouter()
  const [subcategoryId, setSubcategoryId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(!isNew)
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState<Partial<Subcategory>>({
    name: "",
    slug: "",
    category_id: "",
    description: "",
    sort: 0,
    is_active: true,
  })

  useEffect(() => {
    fetchCategories()
    
    const loadData = async () => {
      if (!isNew && params) {
        try {
          setSubcategoryId(params.id)
          await fetchSubcategory(params.id)
        } catch (error) {
          console.error("Ошибка загрузки подкатегории:", error)
          setIsLoading(false)
        }
      } else {
        setIsLoading(false)
      }
    }
    
    loadData()
  }, [params, isNew])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error("Ошибка загрузки категорий:", error)
    }
  }

  const fetchSubcategory = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/subcategories/${id}`)
      if (response.ok) {
        const data = await response.json()
        setFormData({
          name: data.name || "",
          slug: data.slug || "",
          category_id: data.category_id || "",
          description: data.description || "",
          sort: data.sort || 0,
          is_active: data.is_active !== undefined ? data.is_active : true,
        })
      }
    } catch (error) {
      console.error("Ошибка загрузки подкатегории:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.category_id) {
      alert("Необходимо выбрать категорию")
      return
    }

    try {
      const url = isNew ? "/api/admin/subcategories" : `/api/admin/subcategories/${subcategoryId}`
      const method = isNew ? "POST" : "PUT"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push("/admin/subcategories")
      } else {
        const error = await response.json()
        alert(`Ошибка: ${error.error || "Неизвестная ошибка"}`)
      }
    } catch (error) {
      console.error("Ошибка сохранения подкатегории:", error)
      alert("Ошибка сохранения подкатегории")
    }
  }

  const handleNameChange = (value: string) => {
    setFormData({ ...formData, name: value })
    if (!formData.slug || formData.slug === "") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-zа-я0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
      setFormData((prev) => ({ ...prev, slug }))
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Загрузка...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <Link href="/admin/subcategories">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">
          {isNew ? "Новая подкатегория" : "Редактирование подкатегории"}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Основная информация */}
          <Card>
            <CardHeader>
              <CardTitle>Основная информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Категория *</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category_id: value })
                  }
                  required
                  disabled={!isNew}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!isNew && (
                  <p className="text-xs text-muted-foreground">
                    Категорию нельзя изменить после создания
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Название подкатегории *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Настройки */}
          <Card>
            <CardHeader>
              <CardTitle>Настройки</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sort">Порядок сортировки</Label>
                <Input
                  id="sort"
                  type="number"
                  value={formData.sort || 0}
                  onChange={(e) =>
                    setFormData({ ...formData, sort: parseInt(e.target.value) || 0 })
                  }
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_active: checked })
                  }
                />
                <Label htmlFor="is_active">Подкатегория активна</Label>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              {isNew ? "Создать подкатегорию" : "Сохранить изменения"}
            </Button>
            <Link href="/admin/subcategories">
              <Button type="button" variant="outline">
                Отмена
              </Button>
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}

