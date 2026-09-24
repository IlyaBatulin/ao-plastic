import type { Metadata } from "next"
import { cookies } from "next/headers"
import { Footer } from "@/components/footer"
import { notFound, permanentRedirect } from "next/navigation"
import { FilteredProductsSection } from "@/app/products/_components/filtered-products-section"
import { SubcategoryPageShell } from "@/app/products/_components/subcategory-page-shell"
import { AbsCustomInfo } from "@/app/products/_components/abs-custom-info"
import { getCategoryVideo } from "@/lib/video-config"
import { getSubcategorySeo } from "@/lib/seo/catalog-meta"
import { truncateMeta } from "@/lib/seo/text"
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld"
import { isMachinePartsExtrusion } from "@/lib/catalog-slugs"
import { getSubcategoryPageData } from "@/lib/catalog-subcategory"
import {
  getCatalogCategoryLabel,
  getCatalogSubcategoryDescription,
  getCatalogSubcategoryLabel,
} from "@/lib/catalog-translations"
import { LANG_COOKIE, parseLanguage } from "@/lib/language"

export const revalidate = 300

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoryId: string; subcategoryId: string }>
}): Promise<Metadata> {
  const { categoryId, subcategoryId } = await params
  const cookieStore = await cookies()
  const lang = parseLanguage(cookieStore.get(LANG_COOKIE)?.value)
  const seo = await getSubcategorySeo(categoryId, subcategoryId)
  if (!seo) {
    notFound()
  }
  if (subcategoryId !== seo.canonicalSlug) {
    permanentRedirect(`/products/${categoryId}/${seo.canonicalSlug}`)
  }

  const subName = getCatalogSubcategoryLabel(
    subcategoryId,
    subcategoryId,
    seo.subName,
    lang
  )
  const categoryName = getCatalogCategoryLabel(categoryId, seo.categoryName, lang)
  const translatedDescription = getCatalogSubcategoryDescription(
    subcategoryId,
    subcategoryId,
    seo.subDescription,
    lang
  )
  const desc = translatedDescription
    ? truncateMeta(translatedDescription)
    : lang === "en"
      ? `Browse ${subName} in ${categoryName}. Manufactured by JSC Plastic in Uzlovaya, Russia.`
      : `Каталог «${subName}» в разделе «${categoryName}». Производство АО «Пластик», Узловая.`
  const companyName = lang === "en" ? "JSC Plastic" : "АО «Пластик»"

  return {
    title: `${subName} — ${categoryName}`,
    description: desc,
    alternates: { canonical: `/products/${categoryId}/${seo.canonicalSlug}` },
    openGraph: {
      title: `${subName} | ${companyName}`,
      description: desc,
      url: `/products/${categoryId}/${seo.canonicalSlug}`,
      images: [{ url: "/images/og-image.jpg", width: 1200, height: 630 }],
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

  const householdStudioHeroImage = categoryId === "hoztovary"
    ? ({
        kuhnya: "/images/xoztov/p2040-studio.webp",
        sanuzel: "/images/xoztov/p1611-studio.webp",
      } as Record<string, string>)[publicSubcategorySlug]
    : undefined

  if (subcategoryId !== publicSubcategorySlug) {
    permanentRedirect(`/products/${categoryId}/${publicSubcategorySlug}`)
  }

  return (
    <div className="min-h-screen">
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
        imageSrc={householdStudioHeroImage || (typeof subcategory.image === "string" ? subcategory.image : categoryImage) || undefined}
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
                products={displayProducts.map((p) => ({ ...p, id: String(p.id), name: String(p.name), specifications: p.specifications }))}
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
