import { TEK_SNAB_CONTACTS } from "@/lib/tek-snab-contacts"

export const FACTORY_ADDRESS =
  "301600, Тульская область, г. Узловая, ул. Тульская, 1"

export const MOSCOW_OFFICE_ADDRESS = TEK_SNAB_CONTACTS.mapSearchAddress

function buildYandexMapEmbedUrl(address: string) {
  return `https://yandex.ru/map-widget/v1/?text=${encodeURIComponent(address)}&z=16&l=map`
}

export const FACTORY_YANDEX_MAP_EMBED_URL = buildYandexMapEmbedUrl(FACTORY_ADDRESS)

export const MOSCOW_OFFICE_YANDEX_MAP_EMBED_URL = buildYandexMapEmbedUrl(MOSCOW_OFFICE_ADDRESS)
