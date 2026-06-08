"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Package } from "lucide-react"
import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

type CatalogCategoryCardProps = {
  categoryId: string
  categoryName: string
  categoryDescription?: string
  imageSrc: string
  sectionsLabel: string
  readMoreLabel: string
  moreLabel: string
  subcategories?: Array<{ id: string; name: string }>
}

export function CatalogCategoryCard({
  categoryId,
  categoryName,
  categoryDescription,
  imageSrc,
  sectionsLabel,
  readMoreLabel,
  moreLabel,
  subcategories,
}: CatalogCategoryCardProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const href = `/products/${categoryId}`

  const prefetch = () => {
    router.prefetch(href)
  }

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    startTransition(() => {
      router.push(href)
    })
  }

  return (
    <Link
      href={href}
      prefetch
      onClick={handleClick}
      onMouseEnter={prefetch}
      onFocus={prefetch}
      onTouchStart={prefetch}
      aria-busy={isPending}
      className={cn(
        "group relative flex h-full min-h-0 flex-col bg-card rounded-3xl overflow-hidden border-2 border-border hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-2",
        isPending && "pointer-events-none scale-[0.99] border-primary/40 opacity-95"
      )}
    >

      <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10 pointer-events-none" />
        <Image
          src={imageSrc}
          alt={categoryName}
          fill
          priority={categoryId === "hoztovary" || categoryId === "machine-parts"}
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col p-6 sm:p-7 lg:p-8">
        <div className="min-h-0 flex-1">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 transition-transform duration-300 group-hover:scale-110 sm:h-12 sm:w-12">
              <Package className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="mb-2 text-xl font-bold leading-snug text-balance hyphens-auto break-words transition-colors group-hover:text-primary sm:text-2xl">
                {categoryName}
              </h3>
              {categoryDescription ? (
                <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
                  {categoryDescription}
                </p>
              ) : null}
            </div>
          </div>

          {subcategories && subcategories.length > 0 && (
            <div className="mt-6 border-t border-border pt-6">
              <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                {sectionsLabel}
              </p>
              <ul className="space-y-2">
                {subcategories.slice(0, 3).map((sub) => (
                  <li key={sub.id} className="text-sm text-muted-foreground flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="line-clamp-1">{sub.name}</span>
                  </li>
                ))}
                {subcategories.length > 3 && (
                  <li className="text-sm text-primary font-medium">
                    +{subcategories.length - 3} {moreLabel}
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-auto flex items-center gap-2 pt-6 text-primary font-semibold group-hover:gap-4 transition-all">
          {readMoreLabel}
          <ArrowRight className="w-5 h-5" />
        </div>
      </div>
    </Link>
  )
}
