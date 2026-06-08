import {
  ETP_GPB_CUSTOMER_ID,
  ETP_GPB_CUSTOMER_NAME,
  ETP_GPB_REGION,
  ETP_SITE_ORIGIN,
  type EtpTenderItem,
} from "@/lib/etp-api"

const ETP_API_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"

type EtpProcedureAttributes = {
  title?: string
  registry_number?: string
  company_name?: string
  rebranding_truncated_path?: string
  truncated_path?: string
  end_registration?: string
}

type EtpProcedureRecord = {
  attributes?: EtpProcedureAttributes
}

type EtpProceduresApiResponse = {
  data?: EtpProcedureRecord[]
  meta?: {
    total_count?: number
  }
}

/** Как на etpgpb.ru: ключи без encode, значения — с encode. */
export function buildEtpProceduresApiQuery(): string {
  const parts = [
    "page=1",
    "per=20",
    "sort=by_relevance",
    `procedure[customers][${ETP_GPB_CUSTOMER_ID}]=${encodeURIComponent(ETP_GPB_CUSTOMER_NAME)}`,
    `procedure[regions][0]=${encodeURIComponent(ETP_GPB_REGION)}`,
    "procedure[stage][0]=accepting",
    "procedure[stage][1]=commission",
  ]

  return `?${parts.join("&")}`
}

function formatEndRegistration(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ""

  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Moscow",
  }).format(date)
}

function isPlastikCustomer(name: string | undefined): boolean {
  if (!name) return false
  return /пластик/i.test(name.replace(/«|»/g, '"'))
}

function mapProcedureToTender(item: EtpProcedureRecord): EtpTenderItem | null {
  const attrs = item.attributes
  if (!attrs?.title) return null
  if (!isPlastikCustomer(attrs.company_name)) return null

  const path = attrs.rebranding_truncated_path || attrs.truncated_path || ""
  const link = path.startsWith("http")
    ? path
    : `${ETP_SITE_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`

  return {
    title: attrs.title,
    link,
    pubDate: attrs.end_registration
      ? formatEndRegistration(attrs.end_registration)
      : "",
    number: attrs.registry_number ? `№ ${attrs.registry_number}` : undefined,
  }
}

export function parseEtpProceduresApiResponse(
  payload: EtpProceduresApiResponse
): EtpTenderItem[] {
  return (payload.data ?? [])
    .map(mapProcedureToTender)
    .filter((item): item is EtpTenderItem => item !== null)
}

export async function fetchEtpProceduresFromHtml(): Promise<{
  items: EtpTenderItem[]
} | null> {
  try {
    const query = buildEtpProceduresApiQuery()
    const response = await fetch(`${ETP_SITE_ORIGIN}/api/v2/procedures${query}`, {
      headers: {
        "User-Agent": ETP_API_USER_AGENT,
        Accept: "application/json",
        "Accept-Language": "ru-RU,ru;q=0.9",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(20000),
    })

    if (!response.ok) return null

    const payload = (await response.json()) as EtpProceduresApiResponse
    const items = parseEtpProceduresApiResponse(payload)

    return items.length > 0 ? { items } : null
  } catch {
    return null
  }
}
