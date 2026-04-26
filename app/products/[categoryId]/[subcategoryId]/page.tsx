import type { Metadata } from "next"
import { Footer } from "@/components/footer"
import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import { FilteredProductsSection } from "@/app/products/_components/filtered-products-section"
import { SubcategoryPageShell } from "@/app/products/_components/subcategory-page-shell"
import { AbsCustomInfo } from "@/app/products/_components/abs-custom-info"
import { getCategoryVideo } from "@/lib/video-config"
import productsData from "@/data/products.json"
import { getSubcategorySeo } from "@/lib/seo/catalog-meta"
import { truncateMeta } from "@/lib/seo/text"
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld"
import { resolveProductImageUrl } from "@/lib/product-image"

export const revalidate = 300

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoryId: string; subcategoryId: string }>
}): Promise<Metadata> {
  const { categoryId, subcategoryId } = await params
  const seo = await getSubcategorySeo(categoryId, subcategoryId)
  if (!seo) {
    return { title: "Каталог" }
  }
  const desc = seo.subDescription
    ? truncateMeta(String(seo.subDescription))
    : `Каталог «${seo.subName}» в разделе «${seo.categoryName}». Производство АО «Пластик», Узловая.`
  return {
    title: `${seo.subName} — ${seo.categoryName}`,
    description: desc,
    alternates: { canonical: `/products/${categoryId}/${subcategoryId}` },
    openGraph: {
      title: `${seo.subName} | АО «Пластик»`,
      description: desc,
      url: `/products/${categoryId}/${subcategoryId}`,
    },
  }
}

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

  const { data: catRowNav } = await supabase.from("categories").select("name").eq("id", categoryId).single()
  const categoryDisplayName =
    catRowNav?.name ?? productsData.categories.find((c) => c.id === categoryId)?.name ?? categoryId

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

    const imageRaw = product.image || categoryImage || fallback?.image || fallbackCategory?.image || undefined
    const image = resolveProductImageUrl(
      String(product.id),
      imageRaw,
      categoryImage || fallbackCategory?.image
    )
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
          // Как на странице товара — русские подписи (в т.ч. при EN-интерфейсе)
          specifications: {
            "Тип изделия": item.type,
            ...(item.subtype ? { Подтип: item.subtype } : {}),
            ...(item.size_raw ? { "Габаритные размеры": item.size_raw } : {}),
            ...(item.code ? { "Шифр изделия": item.code } : {}),
            ...(item.length_raw ? { "Длина изделия": item.length_raw } : {}),
            ...(item.length_kind === "coil"
              ? { Поставка: "в бухтах" }
              : item.length_kind === "fixed"
                ? { Поставка: "фиксированная длина" }
                : {}),
          },
        }
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", path: "/" },
          { name: "Каталог", path: "/products" },
          { name: categoryDisplayName, path: `/products/${categoryId}` },
          { name: subcategory.name, path: `/products/${categoryId}/${subcategoryId}` },
        ]}
      />
      <SubcategoryPageShell
        subcategorySlug={subcategory.slug}
        fallbackTitle={subcategory.name}
        fallbackDescription={subcategory.description}
        skipDescription={subcategory.id === "abs-custom"}
        backHref={`/products/${categoryId}`}
        hasVideo={!!getCategoryVideo(categoryId, subcategory.slug)}
        videoSrc={getCategoryVideo(categoryId, subcategory.slug)}
        imageSrc={categoryImage || undefined}
      >
      {/* Информационная секция для изготовления изделий из АБС на заказ */}
      {categoryId === "abs" && subcategory.slug === "abs-custom" && (
        <section className="w-full py-20 bg-muted/20">
          <div className="mx-auto w-full max-w-[1920px] px-4 sm:px-6 md:px-10 lg:px-14 xl:px-20 2xl:px-24">
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
      </SubcategoryPageShell>
    </div>
  )
}
