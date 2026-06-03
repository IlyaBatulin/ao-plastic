import type { Metadata } from "next"
import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import { ProductPageClient } from "./product-client"
import productsData from "@/data/products.json"
import { getProductSeo } from "@/lib/seo/catalog-meta"
import { truncateMeta } from "@/lib/seo/text"
import { ProductJsonLd } from "@/components/seo/product-json-ld"
import { resolveProductImageUrl } from "@/lib/product-image"
import {
  findJsonSubcategory,
  isMachinePartsExtrusion,
  resolveSubcategory,
} from "@/lib/catalog-slugs"
import { normalizeHouseholdProduct } from "@/lib/household-product-content"
import { isNextBuild } from "@/lib/next-build"
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld"

export const revalidate = 300
export const dynamicParams = true

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoryId: string; subcategoryId: string; productId: string }>
}): Promise<Metadata> {
  const { categoryId, subcategoryId, productId } = await params
  const seo = await getProductSeo(categoryId, subcategoryId, productId)
  if (!seo) {
    return { title: "Товар" }
  }
  const path = `/products/${categoryId}/${subcategoryId}/${productId}`
  return {
    title: `${seo.productName} — ${seo.categoryName}`,
    description: seo.description,
    alternates: { canonical: path },
    openGraph: {
      title: seo.productName,
      description: seo.description,
      url: path,
      ...(seo.image ? { images: [{ url: seo.image, alt: seo.productName }] } : {}),
    },
  }
}

// Не пререндерим карточки товаров при билде — Supabase с VPS часто даёт ETIMEDOUT.
// Страницы создаются on-demand при первом заходе (dynamicParams + revalidate).
export async function generateStaticParams() {
  return []
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ categoryId: string; subcategoryId: string; productId: string }>
}) {
  const resolvedParams = await params
  const { categoryId, subcategoryId, productId } = resolvedParams

  let product: any = null
  let category: any = null
  let subcategory: any = null

  const fallbackCategory = productsData.categories.find((cat) => cat.id === categoryId)
  const fallbackSubcategory = findJsonSubcategory(categoryId, subcategoryId)
  const fallbackProduct = fallbackCategory?.products?.find((p: any) => p.id === productId)

  if (isNextBuild()) {
    if (fallbackProduct) {
      product = fallbackProduct
      category = fallbackCategory
      subcategory = fallbackSubcategory
    }
  } else {
    const supabase = createClient()

    try {
    // Если это экструзионные изделия ДМС, пробуем получить из extrusion_products
    const isExtrusionCategory = isMachinePartsExtrusion(categoryId, subcategoryId)

    if (isExtrusionCategory && productId.startsWith("extrusion-")) {
      const numericId = Number(productId.replace("extrusion-", ""))
      if (!Number.isNaN(numericId)) {
        const { data: extrusionProduct } = await supabase
          .from("extrusion_products")
          .select("*")
          .eq("id", numericId)
          .eq("is_active", true)
          .single()

        if (extrusionProduct) {
          const parts: string[] = []
          if (extrusionProduct.size_raw) {
            parts.push(`Габаритные размеры: ${extrusionProduct.size_raw}`)
          }
          if (extrusionProduct.length_raw) {
            parts.push(`Длина изделия: ${extrusionProduct.length_raw}`)
          }
          if (extrusionProduct.code) {
            parts.push(`Шифр: ${extrusionProduct.code}`)
          }

          const description = parts.join(" · ")

          product = {
            id: productId,
            name: extrusionProduct.name,
            description: description || null,
            image: extrusionProduct.image || "/placeholder-logo.png",
            specifications: {
              "Тип изделия": extrusionProduct.type,
              ...(extrusionProduct.subtype
                ? { "Подтип": extrusionProduct.subtype }
                : {}),
              ...(extrusionProduct.size_raw
                ? { "Габаритные размеры": extrusionProduct.size_raw }
                : {}),
              ...(extrusionProduct.code
                ? { "Шифр изделия": extrusionProduct.code }
                : {}),
              ...(extrusionProduct.length_raw
                ? { "Длина изделия": extrusionProduct.length_raw }
                : {}),
              ...(extrusionProduct.length_kind === "coil"
                ? { "Поставка": "в бухтах" }
                : extrusionProduct.length_kind === "fixed"
                ? { "Поставка": "фиксированная длина" }
                : {}),
            },
          }
        }
      }
    } else {
      // Обычный путь: продукт из таблицы products
      const { data: productData } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .eq("is_active", true)
        .single()

      if (productData) {
        product = productData
      }
    }

    // Получаем категорию и подкатегорию
    const { data: categoryData } = await supabase
      .from("categories")
      .select("*")
      .eq("id", categoryId)
      .single()

    if (categoryData) {
      category = categoryData
    }

    const subcategoryData = await resolveSubcategory(supabase, categoryId, subcategoryId)
    if (subcategoryData) {
      subcategory = subcategoryData
    }
  } catch (error) {
    console.error("Error fetching product from Supabase:", error)
  }
  }

  // Fallback на JSON
  if (!product) {
    if (fallbackProduct) {
      product = fallbackProduct
      category = fallbackCategory
      subcategory = fallbackSubcategory
    }
  }

  if (product) {
    product = normalizeHouseholdProduct(product, categoryId, subcategoryId)
  }

  if (!product) {
    notFound()
  }

  const productImageForLd = resolveProductImageUrl(
    String(productId),
    product.image,
    typeof category?.image === "string" ? category.image : null
  )

  const canonicalPath = `/products/${categoryId}/${subcategoryId}/${productId}`
  const rawProductDesc =
    typeof product.description === "string"
      ? product.description
      : product.description != null
        ? String(product.description)
        : ""
  const productLdDescription = truncateMeta(
    rawProductDesc ||
      `${product.name}. ${category?.name || categoryId}, ${subcategory?.name || subcategoryId}. АО «Пластик».`
  )

  return (
    <>
      <ProductJsonLd
        name={product.name}
        description={productLdDescription}
        image={productImageForLd}
        sku={String(product.id)}
        category={typeof category?.name === "string" ? category.name : categoryId}
        urlPath={canonicalPath}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", path: "/" },
          { name: "Каталог", path: "/products" },
          {
            name: typeof category?.name === "string" ? category.name : categoryId,
            path: `/products/${categoryId}`,
          },
          {
            name: typeof subcategory?.name === "string" ? subcategory.name : subcategoryId,
            path: `/products/${categoryId}/${subcategoryId}`,
          },
          { name: product.name, path: canonicalPath },
        ]}
      />
      <ProductPageClient
        product={product}
        category={category}
        subcategory={subcategory}
        categoryId={categoryId}
        subcategoryId={subcategoryId}
      />
    </>
  )
}

