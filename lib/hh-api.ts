export const HH_EMPLOYER_ID = "541232"
export const HH_EMPLOYER_URL = `https://hh.ru/employer/${HH_EMPLOYER_ID}`
export const HH_USER_AGENT = "AOPlasticSite/1.0 (info@oaplastic.ru)"

export type HHVacanciesListResponse = {
  items: unknown[]
  found: number
  pages: number
  page: number
  per_page: number
}

export async function fetchHhVacanciesFromBrowser(
  params: URLSearchParams
): Promise<HHVacanciesListResponse | null> {
  const query = new URLSearchParams(params)
  if (!query.has("employer_id")) {
    query.set("employer_id", HH_EMPLOYER_ID)
  }

  try {
    const response = await fetch(`https://api.hh.ru/vacancies?${query.toString()}`, {
      headers: {
        "HH-User-Agent": HH_USER_AGENT,
      },
    })
    if (!response.ok) return null
    return (await response.json()) as HHVacanciesListResponse
  } catch {
    return null
  }
}
