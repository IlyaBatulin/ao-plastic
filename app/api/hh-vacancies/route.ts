import { NextResponse } from "next/server"

const EMPLOYER_ID = "541232"
const HH_USER_AGENT = "AOPlasticSite/1.0 (info@oaplastic.ru)"
const HH_EMPLOYER_URL = `https://hh.ru/employer/${EMPLOYER_ID}`

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get("page") || "0"
    const per_page = searchParams.get("per_page") || "20"

    const text = searchParams.get("text") || ""
    const salary = searchParams.get("salary") || ""
    const only_with_salary = searchParams.get("only_with_salary") || ""
    const experience = searchParams.get("experience") || ""
    const employment = searchParams.get("employment") || ""
    const schedule = searchParams.get("schedule") || ""

    const params = new URLSearchParams({
      employer_id: EMPLOYER_ID,
      per_page,
      page,
    })

    if (text) params.append("text", text)
    if (salary) params.append("salary", salary)
    if (only_with_salary) params.append("only_with_salary", only_with_salary)
    if (experience) params.append("experience", experience)
    if (employment) params.append("employment", employment)
    if (schedule) params.append("schedule", schedule)

    const response = await fetch(`https://api.hh.ru/vacancies?${params.toString()}`, {
      headers: {
        "User-Agent": HH_USER_AGENT,
        Accept: "application/json",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    })

    if (!response.ok) {
      return NextResponse.json({
        items: [],
        found: 0,
        pages: 0,
        page: Number(page),
        per_page: Number(per_page),
        fallbackUrl: HH_EMPLOYER_URL,
        warning:
          response.status === 403
            ? "HeadHunter ограничил доступ с сервера. Откройте вакансии на hh.ru."
            : "Не удалось загрузить вакансии с HeadHunter.",
      })
    }

    const data = await response.json()

    return NextResponse.json({
      items: data.items ?? [],
      found: data.found ?? 0,
      pages: data.pages ?? 0,
      page: data.page ?? Number(page),
      per_page: data.per_page ?? Number(per_page),
      fallbackUrl: HH_EMPLOYER_URL,
    })
  } catch (error) {
    console.error("Error fetching HH vacancies:", error)
    return NextResponse.json({
      items: [],
      found: 0,
      pages: 0,
      page: 0,
      per_page: 20,
      fallbackUrl: HH_EMPLOYER_URL,
      warning: "Не удалось загрузить вакансии. Попробуйте позже или откройте hh.ru.",
    })
  }
}
