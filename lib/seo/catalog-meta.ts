import { createClient } from "@/utils/supabase/server"
import productsData from "@/data/products.json"
import { truncateMeta } from "@/lib/seo/text"
import { resolveProductImageUrl } from "@/lib/product-image"

export type SubcategorySeo = {
  subName: string
  subDescription: string | null | undefined
  categoryName: string
}

/** Данные подкатегории для title/description (как на странице каталога). */
export async function getSubcategorySeo(
  categoryId: string,
  subcategorySlug: string
): Promise<SubcategorySeo | null> {
  const supabase = createClient()

  let { data: sub, error: subError } = await supabase
    .from("subcategories")
    .select("name, description, slug, id")
    .eq("slug", subcategorySlug)
    .eq("category_id", categoryId)
    .eq("is_active", true)
    .single()

  if (subError && categoryId === "polystyrene") {
    const { data, error } = await supabase
      .from("subcategories")
      .select("name, description, slug, id")
      .eq("slug", `ps-${subcategorySlug}`)
      .eq("category_id", categoryId)
      .eq("is_active", true)
      .single()
    if (!error && data) {
      sub = data
      subError = null
    }
  }

  const fromJsonCat = productsData.categories.find((c) => c.id === categoryId)
  const fromJsonSub = fromJsonCat?.subcategories?.find(
    (s: { slug?: string; id?: string }) => s.slug === subcategorySlug || s.id === subcategorySlug
  )

  if (subError || !sub) {
    if (!fromJsonSub) return null
    return {
      subName: fromJsonSub.name,
      subDescription: fromJsonSub.description,
      categoryName: fromJsonCat?.name || categoryId,
    }
  }

  const { data: catRow } = await supabase.from("categories").select("name").eq("id", categoryId).single()

  return {
    subName: sub.name,
    subDescription: sub.description,
    categoryName: catRow?.name || fromJsonCat?.name || categoryId,
  }
}

export type ProductSeo = {
  productName: string
  description: string
  image: string | null | undefined
  categoryName: string
  subName: string
}

/** Карточка товара для meta / JSON-LD (Supabase + fallback JSON). */
export async function getProductSeo(
  categoryId: string,
  subcategorySlug: string,
  productId: string
): Promise<ProductSeo | null> {
  const supabase = createClient()
  let product: any = null
  let categoryName = categoryId
  let subName = subcategorySlug

  const isExtrusion =
    categoryId === "machine-parts" &&
    subcategorySlug === "parts-extrusion" &&
    productId.startsWith("extrusion-")

  if (isExtrusion) {
    const numericId = Number(productId.replace("extrusion-", ""))
    if (!Number.isNaN(numericId)) {
      const { data: extrusionProduct } = await supabase
        .from("extrusion_products")
        .select("name, image, size_raw, length_raw, code")
        .eq("id", numericId)
        .eq("is_active", true)
        .single()

      if (extrusionProduct) {
        const parts: string[] = []
        if (extrusionProduct.size_raw) parts.push(`Габариты: ${extrusionProduct.size_raw}`)
        if (extrusionProduct.length_raw) parts.push(`Длина: ${extrusionProduct.length_raw}`)
        if (extrusionProduct.code) parts.push(`Шифр: ${extrusionProduct.code}`)
        product = {
          name: extrusionProduct.name,
          description: parts.join(" · "),
          image: extrusionProduct.image,
        }
      }
    }
  } else {
    const { data: productData } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .eq("is_active", true)
      .single()
    if (productData) product = productData
  }

  const { data: categoryData } = await supabase.from("categories").select("name").eq("id", categoryId).single()
  if (categoryData?.name) categoryName = categoryData.name

  const { data: subcategoryData } = await supabase
    .from("subcategories")
    .select("name")
    .eq("slug", subcategorySlug)
    .eq("category_id", categoryId)
    .maybeSingle()
  if (subcategoryData?.name) subName = subcategoryData.name

  if (!product) {
    const fallbackCategory = productsData.categories.find((c) => c.id === categoryId)
    const fallbackProduct = fallbackCategory?.products?.find((p: { id: string }) => p.id === productId)
    if (!fallbackProduct) return null
    product = fallbackProduct
    categoryName = fallbackCategory?.name || categoryName
    const fallbackSub = fallbackCategory?.subcategories?.find(
      (s: { slug?: string }) => s.slug === subcategorySlug
    )
    if (fallbackSub?.name) subName = fallbackSub.name
  }

  const rawDesc =
    typeof product.description === "string"
      ? product.description
      : product.description != null
        ? String(product.description)
        : ""

  const description = truncateMeta(
    rawDesc || `${product.name}. ${categoryName}, ${subName}. Производство АО «Пластик», Узловая.`
  )

  return {
    productName: product.name,
    description,
    image: resolveProductImageUrl(productId, product.image),
    categoryName,
    subName,
  }
}
