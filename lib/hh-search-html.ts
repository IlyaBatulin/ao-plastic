import { HH_EMPLOYER_ID } from "@/lib/hh-api"

const HH_SEARCH_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"

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
  employer: { name: string }
  published_at: string
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

function decodeJsonString(value: string): string {
  try {
    return JSON.parse(`"${value}"`) as string
  } catch {
    return value.replace(/\\"/g, '"').replace(/\\\\/g, "\\")
  }
}

function parseCompensation(block: string): HHSearchVacancy["salary"] {
  if (block.includes('"noCompensation"')) return null

  const from = block.match(/"from":(\d+)/)?.[1]
  const to = block.match(/"to":(\d+)/)?.[1]
  const currency = block.match(/"currency":"([^"]+)"/)?.[1]
  const gross = block.match(/"gross":(true|false)/)?.[1]

  if (!from && !to) return null

  return {
    from: from ? Number(from) : undefined,
    to: to ? Number(to) : undefined,
    currency: currency ?? "RUR",
    gross: gross ? gross === "true" : undefined,
  }
}

function parseVacancyBlocks(html: string): HHSearchVacancy[] {
  const chunks = html.split('"vacancyId":').slice(1)
  const items: HHSearchVacancy[] = []

  for (const chunk of chunks) {
    const id = chunk.match(/^(\d+)/)?.[1]
    const nameRaw = chunk.match(/^(\d+),"name":"((?:\\.|[^"\\])*)"/)?.[2]
    if (!id || !nameRaw) continue

    const areaName = chunk.match(/"area":\{[^}]*"name":"((?:\\.|[^"\\])*)"/)?.[1]
    const employerName = chunk.match(/"company":\{[^}]*"name":"((?:\\.|[^"\\])*)"/)?.[1]
    const publishedAt = chunk.match(/"publicationTime":\{[^}]*"\$":"([^"]+)"/)?.[1]

    items.push({
      id,
      name: decodeJsonString(nameRaw),
      area: { name: areaName ? decodeJsonString(areaName) : "" },
      salary: parseCompensation(chunk),
      alternate_url: `https://hh.ru/vacancy/${id}`,
      employer: { name: employerName ? decodeJsonString(employerName) : "Пластик" },
      published_at: publishedAt ?? new Date().toISOString(),
    })
  }

  return items
}

export async function fetchHhVacanciesFromSearchHtml(options: {
  page: number
  perPage: number
  text?: string
}): Promise<HHSearchHtmlResult | null> {
  const params = new URLSearchParams({
    employer_id: HH_EMPLOYER_ID,
    per_page: String(options.perPage),
    page: String(options.page),
  })

  if (options.text) params.set("text", options.text)

  try {
    const response = await fetch(`https://hh.ru/search/vacancy?${params.toString()}`, {
      headers: {
        "User-Agent": HH_SEARCH_USER_AGENT,
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "ru-RU,ru;q=0.9",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    })

    if (!response.ok) return null

    const html = await response.text()
    const totalResults = Number(html.match(/"totalResults":(\d+)/)?.[1] ?? 0)
    let items = parseVacancyBlocks(html)

    if (options.text) {
      const query = options.text.trim().toLowerCase()
      items = items.filter((item) => item.name.toLowerCase().includes(query))
    }

    const found = totalResults || items.length
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
