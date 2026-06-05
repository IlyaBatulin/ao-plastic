import type { Metadata } from "next"
import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import { ProductPageClient } from "./product-client"
import productsData from "@/data/products.json"
import { getProductSeo } from "@/lib/seo/catalog-meta"
import { truncateMeta } from "@/lib/seo/text"
import { ProductJsonLd } from "@/components/seo/product-json-ld"
import { resolveProductImageUrl } from "@/lib/product-image"
import { findJsonSubcategory, resolveSubcategory } from "@/lib/catalog-slugs"
import { findJsonProduct, resolveProduct } from "@/lib/catalog-product"
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

  if (isNextBuild()) {
    const fallbackProduct = findJsonProduct(categoryId, productId)
    if (fallbackProduct) {
      product = fallbackProduct
      category = fallbackCategory
      subcategory = fallbackSubcategory
    }
  } else {
    const supabase = createClient()

    try {
      const resolved = await resolveProduct(supabase, categoryId, subcategoryId, productId)
      if (resolved.product) {
        product = resolved.product
      }

      const { data: categoryData } = await supabase
        .from("categories")
        .select("*")
        .eq("id", categoryId)
        .single()

      if (categoryData) {
        category = categoryData
      } else if (resolved.category) {
        category = resolved.category
      } else {
        category = fallbackCategory
      }

      const subcategoryData = await resolveSubcategory(supabase, categoryId, subcategoryId)
      if (subcategoryData) {
        subcategory = subcategoryData
      } else if (resolved.subcategory) {
        subcategory = resolved.subcategory
      } else {
        subcategory = fallbackSubcategory
      }
    } catch (error) {
      console.error("Error fetching product from Supabase:", error)
      const fallbackProduct = findJsonProduct(categoryId, productId)
      if (fallbackProduct) {
        product = fallbackProduct
        category = fallbackCategory
        subcategory = fallbackSubcategory
      }
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

