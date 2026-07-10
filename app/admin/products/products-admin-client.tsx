"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Pencil, Trash2, ArrowLeft, Package, Image as ImageIcon, Search } from "lucide-react"
import { AdminLink } from "@/components/admin-link"
import Image from "next/image"

const PAGE_SIZE = 24

interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  brand: string | null
  type: string | null
  image: string | null
  specifications: any
  sort: number
  is_active: boolean
  category: { id: string; name: string; slug: string } | null
  subcategory: { id: string; name: string; slug: string } | null
}

export function ProductsAdminClient() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [search, setSearch] = useState("")
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  useEffect(() => {
    fetchProducts()
  }, [])

  // Сбрасываем пагинацию при изменении фильтров/поиска.
  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [filterCategory, filterStatus, search])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/admin/products")
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error("Ошибка загрузки товаров:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить этот товар?")) return

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setProducts(products.filter((p) => p.id !== id))
      } else {
        alert("Ошибка удаления товара")
      }
    } catch (error) {
      console.error("Ошибка удаления товара:", error)
      alert("Ошибка удаления товара")
    }
  }

  // Дедуплицируем категории по id
  const categories = useMemo(() => {
    const categoriesMap = new Map<string, { id: string; name: string; slug: string }>()
    products.forEach((p) => {
      if (p.category && !categoriesMap.has(p.category.id)) {
        categoriesMap.set(p.category.id, p.category)
      }
    })
    return Array.from(categoriesMap.values())
  }, [products])

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase()
    return products.filter((p) => {
      if (filterCategory !== "all" && p.category?.id !== filterCategory) return false
      if (filterStatus === "active" && !p.is_active) return false
      if (filterStatus === "inactive" && p.is_active) return false
      if (q) {
        const haystack = [p.name, p.brand, p.type, p.category?.name, p.subcategory?.name]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [products, filterCategory, filterStatus, search])

  const visibleProducts = filteredProducts.slice(0, visibleCount)

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
            <h1 className="text-h3">Управление товарами</h1>
            <p className="text-muted-foreground">
              Всего товаров: {products.length}
            </p>
          </div>
        </div>
        <Button onClick={() => router.push("/admin/products/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Добавить товар
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по названию, бренду, типу…"
            className="pl-9"
          />
        </div>

        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-full sm:w-[220px]">
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

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Все статусы" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value="active">Активные</SelectItem>
            <SelectItem value="inactive">Неактивные</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Счётчик результатов */}
      <p className="mb-4 text-sm text-muted-foreground">
        Показано {Math.min(visibleProducts.length, filteredProducts.length)} из {filteredProducts.length}
        {filteredProducts.length !== products.length && ` (всего ${products.length})`}
      </p>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Товары не найдены</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="relative h-48 bg-muted">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading="lazy"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge variant={product.is_active ? "default" : "secondary"}>
                    {product.is_active ? "Активен" : "Неактивен"}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-2">{product.name}</CardTitle>
                <CardDescription>
                  {product.category?.name}
                  {product.subcategory && ` • ${product.subcategory.name}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {product.description || "Нет описания"}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => router.push(`/admin/products/${product.id}`)}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Редактировать
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {visibleCount < filteredProducts.length && (
        <div className="mt-8 flex justify-center">
          <Button variant="outline" onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}>
            Показать ещё ({filteredProducts.length - visibleCount})
          </Button>
        </div>
      )}
    </div>
  )
}

