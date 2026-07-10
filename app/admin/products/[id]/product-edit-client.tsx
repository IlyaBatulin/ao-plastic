"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, Upload, X, Image as ImageIcon } from "lucide-react"
import { AdminLink } from "@/components/admin-link"
import Image from "next/image"
import { SpecificationsEditor } from "../_components/specifications-editor"

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
}

interface Product {
  id: string
  name: string
  slug: string
  category_id: string
  subcategory_id: string | null
  description: string | null
  brand: string | null
  type: string | null
  image: string | null
  specifications: any
  sort: number
  is_active: boolean
}

export function ProductEditClient({ 
  params, 
  isNew = false 
}: { 
  params?: { id: string }
  isNew?: boolean
}) {
  const router = useRouter()
  const [productId, setProductId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(!isNew)
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [imageSource, setImageSource] = useState<"url" | "file">("url")
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    slug: "",
    category_id: "",
    subcategory_id: null,
    description: "",
    brand: "",
    type: "",
    image: "",
    specifications: {},
    sort: 0,
    is_active: true,
  })

  useEffect(() => {
    const loadData = async () => {
      if (!isNew && params) {
        try {
          setProductId(params.id)
          await fetchProduct(params.id)
        } catch (error) {
          console.error("Ошибка загрузки товара:", error)
          setIsLoading(false)
        }
      } else {
        setIsLoading(false)
      }
      fetchCategories()
    }
    
    loadData()
  }, [params, isNew])

  useEffect(() => {
    if (formData.category_id) {
      fetchSubcategories(formData.category_id)
    } else {
      setSubcategories([])
    }
  }, [formData.category_id])

  useEffect(() => {
    if (formData.image) {
      setImagePreview(formData.image)
    } else {
      setImagePreview(null)
    }
  }, [formData.image])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append("file", file)

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formDataToSend,
      })

      if (response.ok) {
        const data = await response.json()
        setFormData((prev) => ({ ...prev, image: data.url }))
        setImagePreview(data.url)
      } else {
        const error = await response.json()
        alert(`Ошибка загрузки: ${error.error || "Неизвестная ошибка"}`)
      }
    } catch (error) {
      console.error("Ошибка загрузки файла:", error)
      alert("Ошибка загрузки файла")
    } finally {
      setIsUploading(false)
      // Сбрасываем input, чтобы можно было загрузить тот же файл снова
      e.target.value = ""
    }
  }

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: null }))
    setImagePreview(null)
  }

  const fetchProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/products/${id}`)
      if (response.ok) {
        const data = await response.json()
        setFormData({
          name: data.name || "",
          slug: data.slug || "",
          category_id: data.category_id || "",
          subcategory_id: data.subcategory_id || null,
          description: data.description || "",
          brand: data.brand || "",
          type: data.type || "",
          image: data.image || "",
          specifications: data.specifications || {},
          sort: data.sort || 0,
          is_active: data.is_active !== undefined ? data.is_active : true,
        })
      }
    } catch (error) {
      console.error("Ошибка загрузки товара:", error)
    } finally {
      setIsLoading(false)
    }
  }

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

  const fetchSubcategories = async (categoryId: string) => {
    try {
      const response = await fetch(`/api/admin/subcategories?category_id=${categoryId}`)
      if (response.ok) {
        const data = await response.json()
        setSubcategories(data)
      }
    } catch (error) {
      console.error("Ошибка загрузки подкатегорий:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = isNew ? "/api/admin/products" : `/api/admin/products/${productId}`
      const method = isNew ? "POST" : "PUT"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        router.push("/admin/products")
      } else {
        const error = await response.json()
        alert(`Ошибка: ${error.error || "Неизвестная ошибка"}`)
      }
    } catch (error) {
      console.error("Ошибка сохранения товара:", error)
      alert("Ошибка сохранения товара")
    }
  }

  // Автогенерация slug из названия
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
        <AdminLink href="/admin/products">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </AdminLink>
        <h1 className="text-h3">
          {isNew ? "Новый товар" : "Редактирование товара"}
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
                <Label htmlFor="name">Название товара *</Label>
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

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Категория *</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category_id: value, subcategory_id: null })
                    }
                    required
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subcategory">Подкатегория</Label>
                  <Select
                    value={formData.subcategory_id || undefined}
                    onValueChange={(value) =>
                      setFormData({ ...formData, subcategory_id: value || null })
                    }
                    disabled={!formData.category_id || subcategories.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={subcategories.length === 0 ? "Нет подкатегорий" : "Выберите подкатегорию (опционально)"} />
                    </SelectTrigger>
                    <SelectContent>
                      {subcategories.map((sub) => (
                        <SelectItem key={sub.id} value={sub.id}>
                          {sub.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.subcategory_id && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => setFormData({ ...formData, subcategory_id: null })}
                    >
                      Очистить подкатегорию
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Бренд</Label>
                  <Input
                    id="brand"
                    value={formData.brand || ""}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Тип</Label>
                  <Input
                    id="type"
                    value={formData.type || ""}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  />
                </div>
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

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Источник изображения</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={imageSource === "url" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setImageSource("url")}
                    >
                      URL
                    </Button>
                    <Button
                      type="button"
                      variant={imageSource === "file" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setImageSource("file")}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Загрузить файл
                    </Button>
                  </div>
                </div>

                {imageSource === "url" ? (
                  <div className="space-y-2">
                    <Label htmlFor="image">URL изображения</Label>
                    <Input
                      id="image"
                      type="url"
                      value={formData.image || ""}
                      onChange={(e) => {
                        setFormData({ ...formData, image: e.target.value })
                        setImagePreview(e.target.value)
                      }}
                      placeholder="/placeholder.jpg"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="file-upload">Загрузить изображение</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                        className="cursor-pointer"
                      />
                      {isUploading && (
                        <span className="text-sm text-muted-foreground">Загрузка...</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Максимальный размер файла: 5MB. Поддерживаемые форматы: JPG, PNG, WebP
                    </p>
                  </div>
                )}

                {/* Превью изображения */}
                {imagePreview && (
                  <div className="relative border rounded-lg overflow-hidden bg-muted">
                    <div className="relative h-64 w-full">
                      <Image
                        src={imagePreview}
                        alt="Превью"
                        fill
                        className="object-contain"
                        onError={() => setImagePreview(null)}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={handleRemoveImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {!imagePreview && (
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <ImageIcon className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Изображение не выбрано
                    </p>
                  </div>
                )}
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
                <Label htmlFor="is_active">Товар активен</Label>
              </div>
            </CardContent>
          </Card>

          {/* Характеристики */}
          <Card>
            <CardHeader>
              <CardTitle>Характеристики</CardTitle>
              <CardDescription>
                Управление характеристиками товара в формате ключ-значение
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SpecificationsEditor
                value={formData.specifications || {}}
                onChange={(specs) => setFormData({ ...formData, specifications: specs })}
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              {isNew ? "Создать товар" : "Сохранить изменения"}
            </Button>
            <AdminLink href="/admin/products">
              <Button type="button" variant="outline">
                Отмена
              </Button>
            </AdminLink>
          </div>
        </div>
      </form>
    </div>
  )
}

