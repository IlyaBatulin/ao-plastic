"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Pencil, Trash2, ArrowLeft, FolderTree } from "lucide-react"
import { AdminLink } from "@/components/admin-link"

interface Subcategory {
  id: string
  name: string
  slug: string
  category_id: string
  description: string | null
  sort: number
  is_active: boolean
  category: { id: string; name: string; slug: string } | null
}

interface Category {
  id: string
  name: string
  slug: string
}

export function SubcategoriesAdminClient() {
  const router = useRouter()
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
    fetchSubcategories()
  }, [])

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

  const fetchSubcategories = async () => {
    try {
      const response = await fetch("/api/admin/subcategories")
      if (response.ok) {
        const data = await response.json()
        setSubcategories(data)
      }
    } catch (error) {
      console.error("Ошибка загрузки подкатегорий:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить эту подкатегорию? Все товары в ней также будут удалены.")) return

    try {
      const response = await fetch(`/api/admin/subcategories/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setSubcategories(subcategories.filter((s) => s.id !== id))
      } else {
        const error = await response.json()
        alert(`Ошибка удаления: ${error.error || "Неизвестная ошибка"}`)
      }
    } catch (error) {
      console.error("Ошибка удаления подкатегории:", error)
      alert("Ошибка удаления подкатегории")
    }
  }

  const filteredSubcategories = filterCategory === "all" 
    ? subcategories 
    : subcategories.filter((s) => s.category_id === filterCategory)

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Загрузка...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <AdminLink href="/admin/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </AdminLink>
          <div>
            <h1 className="text-3xl font-bold">Управление подкатегориями</h1>
            <p className="text-muted-foreground">
              Всего подкатегорий: {subcategories.length}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <AdminLink href="/admin/categories">
            <Button variant="outline">
              Категории
            </Button>
          </AdminLink>
          <Button onClick={() => router.push("/admin/subcategories/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Добавить подкатегорию
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2">
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Все категории" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все категории</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Subcategories Grid */}
      {filteredSubcategories.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FolderTree className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Подкатегории не найдены</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubcategories.map((subcategory) => (
            <Card key={subcategory.id}>
              <CardHeader>
                <CardTitle className="line-clamp-2">{subcategory.name}</CardTitle>
                <CardDescription>
                  {subcategory.category?.name || "Без категории"} • {subcategory.slug}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {subcategory.description || "Нет описания"}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant={subcategory.is_active ? "default" : "secondary"}>
                    {subcategory.is_active ? "Активна" : "Неактивна"}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => router.push(`/admin/subcategories/${subcategory.id}`)}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Редактировать
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(subcategory.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

