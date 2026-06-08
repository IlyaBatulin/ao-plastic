import { fetchHhVacanciesFromSearchHtml } from "@/lib/hh-search-html"

export const HH_EMPLOYER_ID = "541232"
export const HH_EMPLOYER_URL = `https://hh.ru/employer/${HH_EMPLOYER_ID}?tab=VACANCIES`
/** Формат HH API: AppName/Version (contact@email) */
export const HH_USER_AGENT = "AO-Plastic/1.0 (info@oaplastic.ru)"

export type HHVacanciesListResponse = {
  items: unknown[]
  found: number
  pages: number
  page: number
  per_page: number
}

const HH_API_HEADERS = {
  "HH-User-Agent": HH_USER_AGENT,
  Accept: "application/json",
  "Accept-Language": "ru-RU,ru;q=0.9",
} as const

/** Запрос к api.hh.ru с сервера (обязателен заголовок HH-User-Agent). */
export async function fetchHhVacancies(
  params: URLSearchParams,
  options?: { revalidate?: number }
): Promise<{ data: HHVacanciesListResponse | null; status: number }> {
  const query = new URLSearchParams(params)
  if (!query.has("employer_id")) {
    query.set("employer_id", HH_EMPLOYER_ID)
  }

  const revalidate = options?.revalidate ?? 3600

  try {
    const response = await fetch(`https://api.hh.ru/vacancies?${query.toString()}`, {
      headers: HH_API_HEADERS,
      next: { revalidate },
      signal: AbortSignal.timeout(15000),
    })

    if (!response.ok) {
      return { data: null, status: response.status }
    }

    const data = (await response.json()) as HHVacanciesListResponse
    return { data, status: response.status }
  } catch {
    return { data: null, status: 0 }
  }
}

/** API hh.ru → fallback: HTML-поиск (работает, когда API отдаёт 403). */
export async function fetchHhVacanciesWithFallback(
  params: URLSearchParams
): Promise<{ data: HHVacanciesListResponse | null; status: number }> {
  const api = await fetchHhVacancies(params)

  if (api.data && (api.data.items?.length ?? 0) > 0) {
    return api
  }

  const page = Number(params.get("page") || "0")
  const perPage = Number(params.get("per_page") || "20")

  const html = await fetchHhVacanciesFromSearchHtml({
    page,
    perPage,
    text: params.get("text") || undefined,
    salary: params.get("salary") || undefined,
    onlyWithSalary: params.get("only_with_salary") === "true",
    experience: params.get("experience") || undefined,
    employment: params.get("employment") || undefined,
    schedule: params.get("schedule") || undefined,
  })

  if (html && html.items.length > 0) {
    return {
      data: {
        items: html.items,
        found: html.found,
        pages: html.pages,
        page: html.page,
        per_page: html.per_page,
      },
      status: 200,
    }
  }

  return api
}
