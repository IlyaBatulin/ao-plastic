import { NextResponse } from "next/server"
import { fetchHhVacanciesWithFallback, HH_EMPLOYER_URL } from "@/lib/hh-api"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get("page") || "0"
    const per_page = searchParams.get("per_page") || "20"

    const params = new URLSearchParams({ per_page, page })

    const text = searchParams.get("text")
    const salary = searchParams.get("salary")
    const only_with_salary = searchParams.get("only_with_salary")
    const experience = searchParams.get("experience")
    const employment = searchParams.get("employment")
    const schedule = searchParams.get("schedule")

    if (text) params.append("text", text)
    if (salary) params.append("salary", salary)
    if (only_with_salary) params.append("only_with_salary", only_with_salary)
    if (experience) params.append("experience", experience)
    if (employment) params.append("employment", employment)
    if (schedule) params.append("schedule", schedule)

    const { data, status } = await fetchHhVacanciesWithFallback(params)

    if (!data) {
      return NextResponse.json({
        items: [],
        found: 0,
        pages: 0,
        page: Number(page),
        per_page: Number(per_page),
        fallbackUrl: HH_EMPLOYER_URL,
        warning:
          status === 403
            ? "Актуальные вакансии АО «Пластик» опубликованы на HeadHunter."
            : "Не удалось загрузить вакансии с HeadHunter.",
      })
    }

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
