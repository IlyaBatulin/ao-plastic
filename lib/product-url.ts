/** Shared URL helpers; no server/database dependencies in the client bundle. */
export function getProductPathSegment(product: { id: string; slug?: string | null }) {
  return product.slug?.trim() || String(product.id)
}

export function getProductUrlPath(categoryId: string, subcategory: string, product: { id: string; slug?: string | null }) {
  return `/products/${categoryId}/${subcategory}/${encodeURIComponent(getProductPathSegment(product))}`
}
