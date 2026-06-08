import type { Metadata } from "next"
import { Footer } from "@/components/footer"
import { notFound } from "next/navigation"
import { FilteredProductsSection } from "@/app/products/_components/filtered-products-section"
import { SubcategoryPageShell } from "@/app/products/_components/subcategory-page-shell"
import { AbsCustomInfo } from "@/app/products/_components/abs-custom-info"
import { getCategoryVideo } from "@/lib/video-config"
import { getSubcategorySeo } from "@/lib/seo/catalog-meta"
import { truncateMeta } from "@/lib/seo/text"
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld"
import { isMachinePartsExtrusion } from "@/lib/catalog-slugs"
import { getSubcategoryPageData } from "@/lib/catalog-subcategory"

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

export default async function SubcategoryPage({
  params,
}: {
  params: Promise<{ categoryId: string; subcategoryId: string }>
}) {
  const { categoryId, subcategoryId } = await params
  const pageData = await getSubcategoryPageData(categoryId, subcategoryId)

  if (!pageData) {
    notFound()
  }

  const {
    subcategory,
    publicSubcategorySlug,
    categoryDisplayName,
    categoryImage,
    displayProducts,
  } = pageData

  return (
    <div className="min-h-screen bg-background">
      <BreadcrumbJsonLd
        items={[
          { name: "Главная", path: "/" },
          { name: "Каталог", path: "/products" },
          { name: categoryDisplayName, path: `/products/${categoryId}` },
          { name: String(subcategory.name), path: `/products/${categoryId}/${subcategoryId}` },
        ]}
      />
      <SubcategoryPageShell
        subcategorySlug={publicSubcategorySlug}
        subcategoryId={String(subcategory.id)}
        fallbackTitle={String(subcategory.name)}
        fallbackDescription={
          typeof subcategory.description === "string" ? subcategory.description : undefined
        }
        skipDescription={subcategory.id === "abs-custom"}
        backHref={`/products/${categoryId}`}
        hasVideo={!!getCategoryVideo(categoryId, publicSubcategorySlug)}
        videoSrc={getCategoryVideo(categoryId, publicSubcategorySlug)}
        imageSrc={categoryImage || undefined}
      >
        {categoryId === "abs" && subcategory.slug === "abs-custom" && (
          <section className="w-full py-20 bg-muted/20">
            <div className="mx-auto w-full max-w-[1920px] px-4 sm:px-6 md:px-10 lg:px-14 xl:px-20 2xl:px-24">
              <AbsCustomInfo />
            </div>
          </section>
        )}

        {!(categoryId === "abs" && subcategory.slug === "abs-custom") && (
          <section className="py-20 relative">
            <div className="container mx-auto px-4 lg:px-8">
              <FilteredProductsSection
                products={displayProducts}
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
