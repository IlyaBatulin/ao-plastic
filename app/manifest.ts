import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "АО «Пластик» — полимеры и пластиковые изделия",
    short_name: "АО «Пластик»",
    description:
      "Производство АБС-пластиков, полистирола, стирола и изделий из пластмасс. Каталог и контакты завода в Узловой.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1e3a8a",
    lang: "ru",
    icons: [
      {
        src: "/images/logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  }
}
