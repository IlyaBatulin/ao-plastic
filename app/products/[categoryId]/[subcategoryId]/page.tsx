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
import {
  getPublicSubcategorySlug,
  getSubcategorySlugCandidates,
  isMachinePartsExtrusion,
  resolveSubcategory,
} from "@/lib/catalog-slugs"
import { normalizeHouseholdProducts } from "@/lib/household-product-content"

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

  const subcategory = await resolveSubcategory(supabase, categoryId, subcategoryId)

  if (!subcategory) {
    notFound()
  }

  const publicSubcategorySlug = getPublicSubcategorySlug(categoryId, {
    id: String(subcategory.id),
    slug: String(subcategory.slug),
  })

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

  const slugCandidates = new Set(
    getSubcategorySlugCandidates(categoryId, subcategoryId)
  )
  const fallbackProducts = fallbackProductsAll.filter((product: any) => {
    const productSub = product.subcategory ?? ""
    return (
      slugCandidates.has(String(subcategory.slug)) ||
      slugCandidates.has(subcategoryId) ||
      slugCandidates.has(productSub) ||
      slugCandidates.has(String(subcategory.id)) ||
      slugCandidates.has(`ps-${productSub}`)
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
  const normalizedBaseProducts = normalizeHouseholdProducts(
    baseProducts,
    categoryId,
    publicSubcategorySlug
  )

  const displayProducts = normalizedBaseProducts.map((product: any) => {
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

    const hasProductSpecs = specifications && Object.keys(specifications).length > 0
    const mergedSpecs = hasProductSpecs ? specifications : (fallback?.specifications ?? {})

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
  if (isMachinePartsExtrusion(categoryId, subcategoryId)) {
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
        subcategorySlug={publicSubcategorySlug}
        fallbackTitle={subcategory.name}
        fallbackDescription={subcategory.description}
        skipDescription={subcategory.id === "abs-custom"}
        backHref={`/products/${categoryId}`}
        hasVideo={!!getCategoryVideo(categoryId, publicSubcategorySlug)}
        videoSrc={getCategoryVideo(categoryId, publicSubcategorySlug)}
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
                isMachinePartsExtrusion(categoryId, subcategoryId)
                  ? extrusionDisplayProducts
                  : displayProducts
              }
              categoryId={categoryId}
              subcategoryId={publicSubcategorySlug}
            />
          </div>
        </section>
      )}

      <Footer />
      </SubcategoryPageShell>
    </div>
  )
}
