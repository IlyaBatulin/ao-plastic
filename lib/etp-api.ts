export const ETP_GPB_CUSTOMER_ID = "10280"
export const ETP_GPB_CUSTOMER_NAME = 'АО "ПЛАСТИК"'
export const ETP_GPB_REGION = "Тульская область"
export const ETP_SITE_ORIGIN = "https://etpgpb.ru"

export const ETP_FILTER_URL =
  `${ETP_SITE_ORIGIN}/procedures/?page=1&per=20` +
  `&procedure[customers][${ETP_GPB_CUSTOMER_ID}]=${encodeURIComponent(ETP_GPB_CUSTOMER_NAME)}` +
  `&procedure[regions][0]=${encodeURIComponent(ETP_GPB_REGION)}` +
  "&procedure[stage][0]=accepting&procedure[stage][1]=commission&sort=by_relevance"

export type EtpTenderItem = {
  title: string
  link: string
  pubDate: string
  number?: string
}

export type EtpTendersResponse = {
  items: EtpTenderItem[]
  customerName: string
  filterUrl: string
  warning?: string
}

export async function fetchEtpTenders(): Promise<EtpTendersResponse> {
  const { fetchEtpProceduresFromHtml } = await import("@/lib/etp-procedures-html")
  const html = await fetchEtpProceduresFromHtml()

  if (html && html.items.length > 0) {
    return {
      items: html.items,
      customerName: ETP_GPB_CUSTOMER_NAME,
      filterUrl: ETP_FILTER_URL,
    }
  }

  return {
    items: [],
    customerName: ETP_GPB_CUSTOMER_NAME,
    filterUrl: ETP_FILTER_URL,
    warning:
      "Не удалось загрузить список закупок с ЭТП ГПБ. Актуальные процедуры — на площадке.",
  }
}
