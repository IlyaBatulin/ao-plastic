const CATEGORY_IMAGE_OVERRIDES: Record<string, string> = {
  abs: "/images/absiplast-main.png",
  kors: "/images/kors-bentol-main.png",
  styrene: "/images/styrolmain.png",
  polystyrene: "/images/polist-main.png",
  hoztovary: "/images/hoztov-main.png",
  "machine-parts": "/images/machine-main.png",
  "pvc-modifier": "/images/pvc-modifier-profiles.png",
}

const BROKEN_CATEGORY_IMAGE_PATHS: Record<string, string> = {
  "/images/products/pvc-modifier.jpg": "/images/pvc-modifier-profiles.png",
}

export function getCategoryImageUrl(
  categoryId: string,
  image?: string | null,
  categoryName?: string
): string {
  const preset = CATEGORY_IMAGE_OVERRIDES[categoryId]
  if (preset) return preset

  const imageValue = typeof image === "string" ? image.trim().replace(/\\/g, "/") : ""
  if (imageValue) {
    const broken = BROKEN_CATEGORY_IMAGE_PATHS[imageValue.toLowerCase()]
    if (broken) return broken
    return imageValue
  }

  return `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(categoryName || categoryId)}`
}
