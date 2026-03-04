"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RichTextEditor } from "@/components/rich-text-editor"
import { Label } from "@/components/ui/label"
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
import { Plus, Pencil, Trash2, ArrowLeft, Save, Upload, X, Image as ImageIcon } from "lucide-react"
import { AdminLink } from "@/components/admin-link"

interface NewsItem {
  id: number
  title: string
  slug: string | null
  excerpt: string | null
  content: string | null
  image_url: string | null
  video_url: string | null
  published_at: string | null
  is_active: boolean
  sort: number
  created_at: string
}

export function NewsAdmin() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image_url: "",
    video_url: "",
    published_at: new Date().toISOString().slice(0, 16),
    is_active: true,
    sort: 0,
  })
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      const response = await fetch("/api/admin/news")
      if (response.ok) {
        const data = await response.json()
        setNews(data)
      }
    } catch (error) {
      console.error("Ошибка загрузки новостей:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = () => {
    setSelectedNews(null)
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      image_url: "",
      video_url: "",
      published_at: new Date().toISOString().slice(0, 16),
      is_active: true,
      sort: 0,
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (item: NewsItem) => {
    setSelectedNews(item)
    setFormData({
      title: item.title || "",
      slug: item.slug || "",
      excerpt: item.excerpt || "",
      content: item.content || "",
      image_url: item.image_url || "",
      video_url: (item as { video_url?: string }).video_url || "",
      published_at: item.published_at
        ? new Date(item.published_at).toISOString().slice(0, 16)
        : new Date().toISOString().slice(0, 16),
      is_active: item.is_active,
      sort: item.sort || 0,
    })
    setIsDialogOpen(true)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append("file", file)

      const response = await fetch("/api/admin/upload?folder=news", {
        method: "POST",
        body: formDataToSend,
      })

      if (response.ok) {
        const data = await response.json()
        setFormData((prev) => ({ ...prev, image_url: data.url }))
      } else {
        const error = await response.json()
        alert(`Ошибка загрузки: ${error.error || "Неизвестная ошибка"}`)
      }
    } catch (error) {
      console.error("Ошибка загрузки файла:", error)
      alert("Ошибка загрузки файла")
    } finally {
      setIsUploading(false)
      e.target.value = ""
    }
  }

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image_url: "" }))
  }

  // Преобразование URL YouTube/Vimeo в embed
  const getVideoEmbedUrl = (url: string) => {
    if (!url?.trim()) return null
    const u = url.trim()
    const ytMatch = u.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`
    const vimeoMatch = u.match(/vimeo\.com\/(?:video\/)?(\d+)/)
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`
    return null
  }

  const handleDelete = (item: NewsItem) => {
    setSelectedNews(item)
    setIsDeleteDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = selectedNews ? `/api/admin/news/${selectedNews.id}` : "/api/admin/news"
      const method = selectedNews ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          slug: formData.slug || null,
          video_url: formData.video_url || null,
          published_at: formData.published_at ? new Date(formData.published_at).toISOString() : null,
        }),
      })

      if (response.ok) {
        setIsDialogOpen(false)
        fetchNews()
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
    if (!selectedNews) return

    try {
      const response = await fetch(`/api/admin/news/${selectedNews.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setIsDeleteDialogOpen(false)
        setSelectedNews(null)
        fetchNews()
      } else {
        alert("Ошибка удаления")
      }
    } catch (error) {
      console.error("Ошибка удаления:", error)
      alert("Ошибка удаления")
    }
  }

  // Режим создания/редактирования — форма на всю страницу
  if (isDialogOpen) {
    return (
      <>
      <form onSubmit={handleSubmit} className="min-h-screen bg-background flex flex-col">
        <header className="border-b border-border bg-card shrink-0">
          <div className="container mx-auto px-4 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button type="button" variant="ghost" size="icon" onClick={() => setIsDialogOpen(false)}>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <h1 className="text-2xl font-bold text-foreground">
                  {selectedNews ? "Редактировать новость" : "Новая новость"}
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" />
                  Сохранить
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-col flex-1 min-h-0">
          <div className="container mx-auto px-4 lg:px-8 py-4 flex flex-col flex-1 min-h-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4 shrink-0">
              <div className="lg:col-span-2">
                <Label htmlFor="title">Заголовок *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="published_at">Дата публикации</Label>
                <Input
                  id="published_at"
                  type="datetime-local"
                  value={formData.published_at}
                  onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div className="lg:col-span-3">
                <Label htmlFor="excerpt">Краткое описание (анонс)</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={2}
                  placeholder="Краткий текст для списка новостей"
                  className="mt-1"
                />
              </div>
              <div className="lg:col-span-3">
                <Label>Изображение (превью)</Label>
                <div className="mt-1 flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {isUploading ? "Загрузка…" : "Выбрать и загрузить"}
                    </Button>
                    <Input
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="Или вставьте URL изображения"
                      className="max-w-xs"
                    />
                    {formData.image_url && (
                      <Button type="button" variant="ghost" size="icon" onClick={handleRemoveImage} title="Удалить">
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  {formData.image_url && (
                    <div className="relative w-40 h-28 rounded-lg border border-border overflow-hidden bg-muted">
                      <img
                        src={formData.image_url}
                        alt="Превью"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="lg:col-span-3">
                <Label htmlFor="video_url">Видео (превью) — YouTube или Vimeo</Label>
                <Input
                  id="video_url"
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=... или https://vimeo.com/..."
                  className="mt-1"
                />
                {getVideoEmbedUrl(formData.video_url) && (
                  <div className="mt-2 aspect-video max-w-md rounded-lg overflow-hidden border border-border">
                    <iframe
                      src={getVideoEmbedUrl(formData.video_url)!}
                      title="Превью видео"
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 pt-8">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="is_active">Показывать на сайте</Label>
              </div>
            </div>

            <div className="flex-1 min-h-0 flex flex-col">
              <Label htmlFor="content">Полный текст</Label>
              <RichTextEditor
                value={formData.content}
                onChange={(html) => setFormData({ ...formData, content: html })}
                placeholder="Введите текст или используйте кнопки форматирования"
                minHeight="calc(100vh - 320px)"
                className="flex-1 min-h-0 flex flex-col"
              />
            </div>
          </div>
        </div>
      </form>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить новость?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить новость «{selectedNews?.title}»? Это действие нельзя отменить.
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
      </>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <AdminLink href="/admin/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </AdminLink>
              <h1 className="text-2xl font-bold text-foreground">Управление новостями</h1>
            </div>
            <Button onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Добавить новость
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 lg:px-8 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Загрузка...</p>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Новостей пока нет</p>
            <Button onClick={handleCreate}>Добавить первую новость</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {news.map((item) => (
              <div
                key={item.id}
                className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
                      {!item.is_active && (
                        <span className="text-xs px-2 py-1 bg-muted rounded text-muted-foreground">
                          Скрыта
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {item.published_at
                        ? new Date(item.published_at).toLocaleDateString("ru-RU", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "Без даты"}
                    </p>
                    {(item.excerpt || item.content) && (
                      <p className="text-muted-foreground line-clamp-2">
                        {item.excerpt || (item.content || "").replace(/<[^>]*>/g, "").slice(0, 150)}…
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="icon" onClick={() => handleEdit(item)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDelete(item)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить новость?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить новость «{selectedNews?.title}»? Это действие нельзя отменить.
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
