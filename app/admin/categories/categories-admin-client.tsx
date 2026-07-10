"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, ArrowLeft, Folder, Image as ImageIcon } from "lucide-react"
import { AdminLink } from "@/components/admin-link"
import Image from "next/image"

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  sort: number
  is_active: boolean
}

export function CategoriesAdminClient() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
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
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить эту категорию? Все подкатегории и товары в ней также будут удалены.")) return

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setCategories(categories.filter((c) => c.id !== id))
      } else {
        const error = await response.json()
        alert(`Ошибка удаления: ${error.error || "Неизвестная ошибка"}`)
      }
    } catch (error) {
      console.error("Ошибка удаления категории:", error)
      alert("Ошибка удаления категории")
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
            <h1 className="text-h3">Управление категориями</h1>
            <p className="text-muted-foreground">
              Всего категорий: {categories.length}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <AdminLink href="/admin/subcategories">
            <Button variant="outline">
              Подкатегории
            </Button>
          </AdminLink>
          <Button onClick={() => router.push("/admin/categories/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Добавить категорию
          </Button>
        </div>
      </div>

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Folder className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Категории не найдены</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category.id} className="overflow-hidden">
              <div className="relative h-48 bg-muted">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge variant={category.is_active ? "default" : "secondary"}>
                    {category.is_active ? "Активна" : "Неактивна"}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-2">{category.name}</CardTitle>
                <CardDescription>
                  {category.slug}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {category.description || "Нет описания"}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => router.push(`/admin/categories/${category.id}`)}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Редактировать
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(category.id)}
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

