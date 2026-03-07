import { NextResponse } from "next/server"

/**
 * RSS ЭТП ГПБ — те же фильтры, что и на странице:
 * https://new.etpgpb.ru/procedures/?procedure[customers][10280]=АО "ПЛАСТИК"&procedure[stage][0]=accepting&procedure[stage][1]=commission&procedure[regions][0]=Тульская область
 */
const ETP_RSS_BASE = "https://etpgpb.ru/procedures.rss"
const ETP_GPB_CUSTOMER_NAME = 'АО "ПЛАСТИК"'

/** Параметры RSS, совпадающие с фильтрами страницы new.etpgpb.ru/procedures */
function buildRssParams(): URLSearchParams {
  const params = new URLSearchParams()
  params.set("procedure[customers][10280]", ETP_GPB_CUSTOMER_NAME)
  params.set("procedure[stage][0]", "accepting")   // приём заявок
  params.set("procedure[stage][1]", "commission")  // работа комиссии
  params.set("procedure[regions][0]", "Тульская область")
  return params
}

export interface EtpTenderItem {
  title: string
  link: string
  pubDate: string
}

function parseRssItems(xml: string): EtpTenderItem[] {
  const items: EtpTenderItem[] = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi
  let match
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1]
    const title = block.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? ""
    const link = block.match(/<link>([\s\S]*?)<\/link>/i)?.[1]?.trim() ?? ""
    const pubDate = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/i)?.[1]?.trim() ?? ""
    if (title && link) {
      // Ссылки с ЭТП ведём на новую площадку
      const normalizedLink = link.replace(/^https?:\/\/etpgpb\.ru\//, "https://new.etpgpb.ru/")
      items.push({ title, link: normalizedLink, pubDate })
    }
  }
  return items
}

export async function GET() {
  try {
    const params = buildRssParams()
    const url = `${ETP_RSS_BASE}?${params.toString()}`

    const response = await fetch(url, {
      headers: {
        "User-Agent": "AOPlastic/1.0 (ao-plastic-website)",
        Accept: "application/rss+xml, application/xml, text/xml",
      },
      next: { revalidate: 900 }, // 15 минут
    })

    if (!response.ok) {
      throw new Error(`ETP RSS error: ${response.status}`)
    }

    const xml = await response.text()
    const items = parseRssItems(xml)

    return NextResponse.json({ items, customerName: ETP_GPB_CUSTOMER_NAME })
  } catch (error) {
    console.error("Error fetching ETP tenders:", error)
    return NextResponse.json(
      { error: "Не удалось загрузить тендеры с ЭТП ГПБ", items: [] },
      { status: 500 }
    )
  }
}
