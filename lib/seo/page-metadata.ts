import type { Metadata } from "next"

/**
 * openGraph-блок для внутренней страницы (без него страница наследует og главной).
 *
 * Важно: Next.js заменяет openGraph родителя целиком (не сливает поля),
 * поэтому og:image из корневого layout НЕ наследуется и указывается здесь явно
 * (то же изображение, что и в app/layout.tsx).
 */
export function pageOpenGraph({
  title,
  description,
  path,
}: {
  title: string
  description: string
  path: string
}): NonNullable<Metadata["openGraph"]> {
  return {
    title,
    description,
    url: path,
    siteName: "АО «Пластик»",
    locale: "ru_RU",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Завод АО «Пластик» в Узловой",
      },
    ],
  }
}
