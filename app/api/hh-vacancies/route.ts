import { NextResponse } from "next/server"

// Замените на ID вашей компании на HeadHunter
const EMPLOYER_ID = "541232" // Пример ID

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get("page") || "0"
    const per_page = searchParams.get("per_page") || "20"
    
    // Параметры фильтрации
    const text = searchParams.get("text") || ""
    const salary = searchParams.get("salary") || ""
    const only_with_salary = searchParams.get("only_with_salary") || ""
    const experience = searchParams.get("experience") || ""
    const employment = searchParams.get("employment") || ""
    const schedule = searchParams.get("schedule") || ""

    // Формируем URL с параметрами
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

    // Запрос к API HeadHunter
    const response = await fetch(
      `https://api.hh.ru/vacancies?${params.toString()}`,
      {
        headers: {
          "User-Agent": "AOPlastic/1.0 (ao-plastic-website)",
        },
        next: { revalidate: 3600 }, // Кэшируем на 1 час
      }
    )

    if (!response.ok) {
      throw new Error(`HH API error: ${response.status}`)
    }

    const data = await response.json()

    // Получаем детальную информацию для каждой вакансии
    const detailedVacancies = await Promise.all(
      data.items.map(async (vacancy: any) => {
        try {
          const detailResponse = await fetch(
            `https://api.hh.ru/vacancies/${vacancy.id}`,
            {
              headers: {
                "User-Agent": "AOPlastic/1.0 (ao-plastic-website)",
              },
              next: { revalidate: 3600 },
            }
          )

          if (detailResponse.ok) {
            return await detailResponse.json()
          }
          return vacancy
        } catch (error) {
          console.error(`Error fetching vacancy ${vacancy.id}:`, error)
          return vacancy
        }
      })
    )

    return NextResponse.json({
      items: detailedVacancies,
      found: data.found,
      pages: data.pages,
      page: data.page,
      per_page: data.per_page,
    })
  } catch (error) {
    console.error("Error fetching HH vacancies:", error)
    return NextResponse.json(
      { error: "Не удалось загрузить вакансии" },
      { status: 500 }
    )
  }
}
