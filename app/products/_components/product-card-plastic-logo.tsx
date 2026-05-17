import Image from "next/image"
import { isProductImagePlaceholder } from "@/lib/product-image"

type ProductCardPlasticLogoProps = {
  /** Текущий src превью карточки (после resolveProductImageUrl). Логотип только если нет реального фото. */
  imageSrc: string
}

/** Маленький логотип АО «Пластик» в углу, только если у товара нет фото (placeholder). */
export function ProductCardPlasticLogo({ imageSrc }: ProductCardPlasticLogoProps) {
  if (!isProductImagePlaceholder(imageSrc)) return null

  return (
    <div
      className="pointer-events-none absolute right-2.5 top-2.5 z-20 sm:right-3.5 sm:top-3.5"
      aria-hidden
    >
      <Image
        src="/images/logo123.png"
        alt="АО «Пластик»"
        width={100}
        height={36}
        className="h-7 w-auto object-contain drop-shadow-[0_1px_6px_rgba(0,0,0,0.35)] sm:h-8"
      />
    </div>
  )
}
