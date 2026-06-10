import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProductPageClient } from "./product-client"
import { getProductSeo } from "@/lib/seo/catalog-meta"
import { truncateMeta } from "@/lib/seo/text"
import { ProductJsonLd } from "@/components/seo/product-json-ld"
import { resolveProductImageUrl } from "@/lib/product-image"
import { getProductPageData } from "@/lib/catalog-product"
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld"

// Layout читает cookies() (язык) — ISR (revalidate) даёт DYNAMIC_SERVER_USAGE в production.
export const dynamic = "force-dynamic"
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
// Страницы создаются on-demand при первом заходе (dynamicParams + force-dynamic).
export async function generateStaticParams() {
  return []
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ categoryId: string; subcategoryId: string; productId: string }>
}) {
  const { categoryId, subcategoryId, productId } = await params
  const pageData = await getProductPageData(categoryId, subcategoryId, productId)

  if (!pageData) {
    notFound()
  }

  const { product, category, subcategory } = pageData

  const productImageForLd = resolveProductImageUrl(
    String(productId),
    product.image as string | undefined,
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
        name={String(product.name)}
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
          { name: String(product.name), path: canonicalPath },
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
