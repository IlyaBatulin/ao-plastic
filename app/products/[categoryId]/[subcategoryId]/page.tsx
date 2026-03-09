import { Footer } from "@/components/footer"
import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import { FilteredProductsSection } from "@/app/products/_components/filtered-products-section"
import { CategoryHero } from "@/app/products/_components/category-hero"
import { CustomOrderForm } from "@/app/products/_components/custom-order-form"
import { AbsCustomInfo } from "@/app/products/_components/abs-custom-info"
import { AbsInjectionInfo } from "@/app/products/_components/abs-injection-info"
import { AbsExtrusionInfo } from "@/app/products/_components/abs-extrusion-info"
import { getCategoryVideo } from "@/lib/video-config"
import productsData from "@/data/products.json"

export const revalidate = 300

export default async function SubcategoryPage({ params }: { params: Promise<{ categoryId: string; subcategoryId: string }> }) {
  const resolvedParams = await params
  const { categoryId, subcategoryId } = resolvedParams
  const supabase = createClient()

  // Получаем подкатегорию по slug
  let { data: subcategory, error: subError } = await supabase
    .from("subcategories")
    .select("*")
    .eq("slug", subcategoryId)
    .eq("category_id", categoryId)
    .eq("is_active", true)
    .single()

  // Если не найдено, пробуем с префиксом
  if (subError && categoryId === "polystyrene") {
    const { data, error } = await supabase
      .from("subcategories")
      .select("*")
      .eq("slug", `ps-${subcategoryId}`)
      .eq("category_id", categoryId)
      .eq("is_active", true)
      .single()
    
    if (!error && data) {
      subcategory = data
      subError = null
    }
  }

  if (subError || !subcategory) {
    notFound()
  }

  // Получаем категорию для изображения
  let categoryImage: string | null = null
  const { data: categoryData } = await supabase
    .from("categories")
    .select("image")
    .eq("id", categoryId)
    .single()
  if (categoryData?.image) {
    categoryImage = categoryData.image
  }

  // Получаем товары этой подкатегории
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("*")
    .eq("subcategory_id", subcategory.id)
    .eq("is_active", true)
    .order("sort", { ascending: true })

  const fallbackCategory = productsData.categories.find((cat) => cat.id === categoryId)
  const fallbackProductsAll = fallbackCategory?.products ?? []

  const fallbackProducts = fallbackProductsAll.filter((product: any) => {
    const productSub = product.subcategory ?? ""
    return (
      productSub === subcategory.slug ||
      productSub === subcategoryId ||
          `ps-${productSub}` === subcategory.slug ||
      product.id === subcategory.id
    )
  })

  const fallbackById = new Map(fallbackProductsAll.map((product: any) => [product.id, product]))
  const fallbackBySub = new Map(
    fallbackProductsAll.flatMap((product: any) => {
      const keys: string[] = []
      if (product.subcategory) {
        keys.push(product.subcategory)
        keys.push(`ps-${product.subcategory}`)
      }
      return keys.map((key) => [key, product])
    })
  )

  const baseProducts = (products && products.length > 0) ? products : fallbackProducts

  const displayProducts = baseProducts.map((product: any) => {
    const fallback =
      fallbackById.get(product.id) ||
      fallbackBySub.get(product.subcategory_id ?? "") ||
      fallbackBySub.get(subcategory.slug) ||
      fallbackProducts[0]
    let specifications = product.specifications
    if (typeof specifications === "string") {
      try {
        specifications = JSON.parse(specifications)
      } catch {
        specifications = {}
      }
    }

    const mergedSpecs = {
      ...(fallback?.specifications ?? {}),
      ...(specifications ?? {}),
    }

    const image = product.image || categoryImage || fallback?.image || fallbackCategory?.image || undefined
    const description = product.description ?? fallback?.description ?? fallbackCategory?.description

    return {
      ...product,
      image,
      description,
      specifications: mergedSpecs,
    }
  })

  // Получаем данные экструзионных изделий для machine-parts/parts-extrusion
  let extrusionDisplayProducts: any[] = []
  if (categoryId === "machine-parts" && subcategoryId === "parts-extrusion") {
    const supabaseServer = createClient()
    const { data: extrusionData } = await supabaseServer
      .from("extrusion_products")
      .select("*")
      .eq("is_active", true)
      .order("source_no", { ascending: true, nullsFirst: false })

    if (extrusionData && extrusionData.length > 0) {
      extrusionDisplayProducts = extrusionData.map((item: any) => {
        // Человеко‑читаемое краткое описание на русском
        const parts: string[] = []
        if (item.size_raw) parts.push(`Габаритные размеры: ${item.size_raw}`)
        if (item.length_raw) parts.push(`Длина изделия: ${item.length_raw}`)
        if (item.code) parts.push(`Шифр: ${item.code}`)
        const description = parts.join(" · ")

        return {
          id: `extrusion-${item.id}`,
          name: item.name,
          description: description || null,
          image: item.image || "/placeholder-logo.png",
          // Спецификации только из полей документа/таблицы
          specifications: {
            type: item.type,
            subtype: item.subtype,
            size_raw: item.size_raw,
            code: item.code,
            length_raw: item.length_raw,
            length_kind: item.length_kind,
          },
        }
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <CategoryHero
        title={subcategory.name}
        description={subcategory.id === "abs-custom" ? undefined : subcategory.description}
        backHref={`/products/${categoryId}`}
        backLabel="Назад к категории"
        hasVideo={!!getCategoryVideo(categoryId, subcategory.slug)}
        videoSrc={getCategoryVideo(categoryId, subcategory.slug)}
        imageSrc={categoryImage || undefined}
      />

      {/* Информационная секция для экструзионного АБС */}
      {categoryId === "abs" && subcategory.slug === "abs-extrusion" && (
        <section className="py-20 bg-muted/20">
          <div className="container mx-auto px-4 lg:px-8">
            <AbsExtrusionInfo />
          </div>
        </section>
      )}

      {/* Информационная секция для литьевого АБС */}
      {categoryId === "abs" && subcategory.slug === "abs-injection" && (
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <AbsInjectionInfo />
          </div>
        </section>
      )}

      {/* Информационная секция для изготовления изделий из АБС на заказ */}
      {categoryId === "abs" && subcategory.slug === "abs-custom" && (
        <section className="py-20 bg-muted/20">
          <div className="container mx-auto px-4 lg:px-8">
            <AbsCustomInfo />
          </div>
        </section>
      )}

      {/* Секция товаров
          - для abs-custom не показываем
          - для machine-parts/parts-extrusion используем данные из extrusion_products,
            но в том же дизайне карточек, что и у ABS / полистирола
      */}
      {!(categoryId === "abs" && subcategory.slug === "abs-custom") && (
        <section className="py-20 relative">
          <div className="container mx-auto px-4 lg:px-8">
            <FilteredProductsSection
              products={
                categoryId === "machine-parts" && subcategoryId === "parts-extrusion"
                  ? extrusionDisplayProducts
                  : displayProducts
              }
              categoryId={categoryId}
              subcategoryId={subcategoryId}
            />
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}
