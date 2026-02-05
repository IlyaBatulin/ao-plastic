import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import { ProductPageClient } from "./product-client"
import productsData from "@/data/products.json"

export const revalidate = 300

// Генерируем статические страницы для всех товаров
export async function generateStaticParams() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (supabaseUrl && supabaseKey) {
      const response = await fetch(
        `${supabaseUrl}/rest/v1/products?is_active=eq.true&select=id,category_id,subcategory_id`,
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
          next: { revalidate: 300 },
        }
      )

      if (response.ok) {
        const products = await response.json()
        
        // Также получаем информацию о подкатегориях для slug
        const subcatsResponse = await fetch(
          `${supabaseUrl}/rest/v1/subcategories?select=id,slug,category_id`,
          {
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
            },
            next: { revalidate: 300 },
          }
        )
        
        if (subcatsResponse.ok) {
          const subcategories = await subcatsResponse.json()
          const subcatMap = new Map(subcategories.map((sub: any) => [sub.id, sub.slug]))
          
          if (products && products.length > 0) {
            return products.map((product: any) => ({
              categoryId: product.category_id,
              subcategoryId: subcatMap.get(product.subcategory_id) || product.subcategory_id,
              productId: product.id,
            }))
          }
        }
      }
    }
  } catch (error) {
    console.error("Error fetching products for generateStaticParams:", error)
  }

  // Fallback на JSON
  const params: Array<{ categoryId: string; subcategoryId: string; productId: string }> = []
  productsData.categories.forEach((cat) => {
    cat.products?.forEach((product: any) => {
      const productSub = product.subcategory || cat.subcategories?.[0]?.slug || ''
      params.push({
        categoryId: cat.id,
        subcategoryId: productSub,
        productId: product.id,
      })
    })
  })
  
  return params
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ categoryId: string; subcategoryId: string; productId: string }>
}) {
  const resolvedParams = await params
  const { categoryId, subcategoryId, productId } = resolvedParams
  const supabase = createClient()

  // Получаем продукт из Supabase
  let product: any = null
  let category: any = null
  let subcategory: any = null

  try {
    // Если это экструзионные изделия ДМС, пробуем получить из extrusion_products
    const isExtrusionCategory =
      categoryId === "machine-parts" && subcategoryId === "parts-extrusion"

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
            image: "/placeholder-logo.png",
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

    const { data: subcategoryData } = await supabase
      .from("subcategories")
      .select("*")
      .eq("slug", subcategoryId)
      .eq("category_id", categoryId)
      .single()

    if (subcategoryData) {
      subcategory = subcategoryData
    }
  } catch (error) {
    console.error("Error fetching product from Supabase:", error)
  }

  // Fallback на JSON
  if (!product) {
    const fallbackCategory = productsData.categories.find((cat) => cat.id === categoryId)
    const fallbackSubcategory = fallbackCategory?.subcategories?.find((sub: any) => sub.slug === subcategoryId || sub.id === subcategoryId)
    const fallbackProduct = fallbackCategory?.products?.find((p: any) => p.id === productId)

    if (fallbackProduct) {
      product = fallbackProduct
      category = fallbackCategory
      subcategory = fallbackSubcategory
    }
  }

  if (!product) {
    notFound()
  }

  return (
    <ProductPageClient
      product={product}
      category={category}
      subcategory={subcategory}
      categoryId={categoryId}
      subcategoryId={subcategoryId}
    />
  )
}

