import { HH_EMPLOYER_ID } from "@/lib/hh-api"

const HH_SEARCH_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"

const EMPLOYMENT_LABELS: Record<string, string> = {
  FULL: "Полная занятость",
  PART: "Частичная занятость",
  PROJECT: "Проектная работа",
  VOLUNTEER: "Волонтёрство",
  PROBATION: "Стажировка",
}

const EXPERIENCE_LABELS: Record<string, string> = {
  noExperience: "Без опыта",
  between1And3: "От 1 года до 3 лет",
  between3And6: "От 3 до 6 лет",
  moreThan6: "Более 6 лет",
}

const SCHEDULE_LABELS: Record<string, string> = {
  fullDay: "Полный день",
  shift: "Сменный график",
  flexible: "Гибкий график",
  remote: "Удалённая работа",
  flyInFlyOut: "Вахтовый метод",
}

type RawHhVacancy = {
  vacancyId?: number
  name?: string
  company?: { name?: string; logos?: { logo?: Array<{ "@type"?: string; "@url"?: string }> } }
  compensation?: {
    from?: number
    to?: number
    currencyCode?: string
    gross?: boolean
  }
  publicationTime?: { $?: string }
  area?: { name?: string }
  address?: {
    city?: string
    street?: string
    building?: string
    metro?: { name?: string; line?: { name?: string } }
  }
  links?: { desktop?: string; mobile?: string }
  employment?: { "@type"?: string }
  workExperience?: string
  "@workSchedule"?: string
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&#34;|&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
}

export type HHSearchVacancy = {
  id: string
  name: string
  area: { name: string }
  salary: {
    from?: number
    to?: number
    currency?: string
    gross?: boolean
  } | null
  alternate_url: string
  employer: {
    name: string
    logo_urls?: { "90"?: string }
  }
  published_at: string
  employment?: { id: string; name: string }
  schedule?: { id: string; name: string }
  experience?: { id: string; name: string }
  address?: {
    city?: string
    street?: string
    building?: string
    metro?: { station_name: string; line_name: string }
  }
  snippet?: {
    requirement?: string
    responsibility?: string
  }
}

export type HHSearchHtmlResult = {
  items: HHSearchVacancy[]
  found: number
  pages: number
  page: number
  per_page: number
}

export type HHSearchHtmlOptions = {
  page: number
  perPage: number
  text?: string
  salary?: string
  onlyWithSalary?: boolean
  experience?: string
  employment?: string
  schedule?: string
  revalidate?: number
}

function parseVacanciesJsonArray(html: string): RawHhVacancy[] {
  const marker = '"vacancies":['
  const idx = html.indexOf(marker)
  if (idx < 0) return []

  let depth = 0
  let start = -1
  for (let i = idx + '"vacancies":'.length; i < html.length; i++) {
    const ch = html[i]
    if (ch === "[") {
      if (start < 0) start = i
      depth++
    } else if (ch === "]") {
      depth--
      if (depth === 0) {
        try {
          return JSON.parse(html.slice(start, i + 1)) as RawHhVacancy[]
        } catch {
          return []
        }
      }
    }
  }

  return []
}

/** Резерв для новой SSR-разметки HH, если внутренний JSON снова изменился. */
function parseVacancyCards(html: string): HHSearchVacancy[] {
  const items: HHSearchVacancy[] = []
  const seen = new Set<string>()
  const anchorPattern = /<a\b[^>]*data-qa="serp-item__title"[^>]*>/gi

  for (const anchor of html.matchAll(anchorPattern)) {
    const hrefMatch = anchor[0].match(/href="([^"]*\/vacancy\/(\d+)[^"]*)"/i)
    if (!hrefMatch || anchor.index == null) continue
    const titleWindow = html.slice(anchor.index, anchor.index + 2_000)
    const titleMatch = titleWindow.match(
      /data-qa="serp-item__title-text"[^>]*>([\s\S]*?)<\/span>/i
    )
    if (!titleMatch) continue

    const id = hrefMatch[2]
    if (seen.has(id)) continue
    seen.add(id)

    const name = decodeHtmlEntities(titleMatch[1].replace(/<[^>]+>/g, ""))
      .replace(/\s+/g, " ")
      .trim()
    if (!name) continue

    items.push({
      id,
      name,
      area: { name: "" },
      salary: null,
      alternate_url: decodeHtmlEntities(hrefMatch[1]),
      employer: { name: "АО «Пластик»" },
      published_at: new Date().toISOString(),
    })
  }

  return items
}

function mapRawVacancy(raw: RawHhVacancy): HHSearchVacancy | null {
  const id = raw.vacancyId
  const name = raw.name?.trim()
  if (!id || !name) return null

  const logo90 = raw.company?.logos?.logo?.find((l) => l["@type"] === "small" || l["@type"] === "searchResultsPage")

  const employmentType = raw.employment?.["@type"]
  const scheduleId = raw["@workSchedule"]
  const experienceId = raw.workExperience

  return {
    id: String(id),
    name,
    area: { name: raw.area?.name ?? "" },
    salary: raw.compensation
      ? {
          from: raw.compensation.from,
          to: raw.compensation.to,
          currency: raw.compensation.currencyCode ?? "RUR",
          gross: raw.compensation.gross,
        }
      : null,
    alternate_url: raw.links?.desktop ?? `https://hh.ru/vacancy/${id}`,
    employer: {
      name: raw.company?.name ?? "Пластик",
      logo_urls: logo90?.["@url"] ? { "90": `https://img.hhcdn.ru${logo90["@url"]}` } : undefined,
    },
    published_at: raw.publicationTime?.$ ?? new Date().toISOString(),
    employment: employmentType
      ? {
          id: employmentType.toLowerCase(),
          name: EMPLOYMENT_LABELS[employmentType] ?? employmentType,
        }
      : undefined,
    schedule: scheduleId
      ? {
          id: scheduleId,
          name: SCHEDULE_LABELS[scheduleId] ?? scheduleId,
        }
      : undefined,
    experience: experienceId
      ? {
          id: experienceId,
          name: EXPERIENCE_LABELS[experienceId] ?? experienceId,
        }
      : undefined,
    address: raw.address
      ? {
          city: raw.address.city,
          street: raw.address.street,
          building: raw.address.building,
          metro: raw.address.metro?.name
            ? {
                station_name: raw.address.metro.name,
                line_name: raw.address.metro.line?.name ?? "",
              }
            : undefined,
        }
      : undefined,
  }
}

function applyFilters(items: HHSearchVacancy[], options: HHSearchHtmlOptions): HHSearchVacancy[] {
  let result = items

  if (options.text?.trim()) {
    const q = options.text.trim().toLowerCase()
    result = result.filter((item) => item.name.toLowerCase().includes(q))
  }

  if (options.onlyWithSalary) {
    result = result.filter((item) => item.salary?.from != null || item.salary?.to != null)
  }

  const minSalary = options.salary ? Number(options.salary) : NaN
  if (!Number.isNaN(minSalary) && minSalary > 0) {
    result = result.filter((item) => {
      const from = item.salary?.from ?? 0
      const to = item.salary?.to ?? from
      return to >= minSalary || from >= minSalary
    })
  }

  if (options.experience) {
    result = result.filter((item) => item.experience?.id === options.experience)
  }

  if (options.employment) {
    result = result.filter((item) => item.employment?.id === options.employment)
  }

  if (options.schedule) {
    result = result.filter((item) => item.schedule?.id === options.schedule)
  }

  return result
}

export async function fetchHhVacanciesFromSearchHtml(
  options: HHSearchHtmlOptions
): Promise<HHSearchHtmlResult | null> {
  const params = new URLSearchParams({
    employer_id: HH_EMPLOYER_ID,
    items_on_page: String(Math.min(Math.max(options.perPage, 1), 50)),
    page: String(Math.max(options.page, 0)),
  })

  try {
    const response = await fetch(`https://hh.ru/search/vacancy?${params.toString()}`, {
      headers: {
        "User-Agent": HH_SEARCH_USER_AGENT,
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "ru-RU,ru;q=0.9",
        Referer: `https://hh.ru/employer/${HH_EMPLOYER_ID}?tab=VACANCIES`,
      },
      next: { revalidate: options.revalidate ?? 1800 },
      signal: AbortSignal.timeout(20000),
    })

    if (!response.ok) return null

    const html = await response.text()
    const decodedHtml = decodeHtmlEntities(html)
    const totalResults = Number(
      decodedHtml.match(/"totalResults"\s*:\s*(\d+)/)?.[1] ?? 0
    )
    const rawItems = parseVacanciesJsonArray(decodedHtml)
    let items =
      rawItems.length > 0
        ? rawItems
            .map(mapRawVacancy)
            .filter((item): item is HHSearchVacancy => item != null)
        : parseVacancyCards(html)

    items = applyFilters(items, options)

    const found = options.text || options.onlyWithSalary || options.salary || options.experience || options.employment || options.schedule
      ? items.length
      : totalResults || items.length

    const pages = found > 0 ? Math.ceil(found / options.perPage) : 0

    if (items.length === 0 && found === 0) return null

    return {
      items,
      found,
      pages,
      page: options.page,
      per_page: options.perPage,
    }
  } catch {
    return null
  }
}
