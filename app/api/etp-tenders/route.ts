import { NextResponse } from "next/server"

const ETP_GPB_CUSTOMER_NAME = 'АО "ПЛАСТИК"'
const ETP_FILTER_URL =
  "https://new.etpgpb.ru/procedures/?procedure[customers][10280]=" +
  encodeURIComponent(ETP_GPB_CUSTOMER_NAME) +
  "&procedure[stage][0]=accepting&procedure[stage][1]=commission&procedure[regions][0]=" +
  encodeURIComponent("Тульская область")

const RSS_CANDIDATES = [
  `https://etpgpb.ru/procedures.rss?procedure[customers][10280]=${encodeURIComponent(ETP_GPB_CUSTOMER_NAME)}&procedure[stage][0]=accepting&procedure[stage][1]=commission&procedure[regions][0]=${encodeURIComponent("Тульская область")}`,
  "https://etpgpb.ru/procedures.rss",
]

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
      const normalizedLink = link.replace(/^https?:\/\/etpgpb\.ru\//, "https://new.etpgpb.ru/")
      items.push({ title, link: normalizedLink, pubDate })
    }
  }
  return items
}

async function fetchRss(url: string): Promise<string | null> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "AOPlasticSite/1.0 (info@oaplastic.ru)",
      Accept: "application/rss+xml, application/xml, text/xml, */*",
    },
    redirect: "follow",
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  })

  if (!response.ok) return null

  const text = await response.text()
  if (!text.includes("<rss") && !text.includes("<item>")) {
    return null
  }

  return text
}

export async function GET() {
  try {
    for (const url of RSS_CANDIDATES) {
      try {
        const xml = await fetchRss(url)
        if (!xml) continue
        const items = parseRssItems(xml)
        if (items.length > 0) {
          return NextResponse.json({
            items,
            customerName: ETP_GPB_CUSTOMER_NAME,
            filterUrl: ETP_FILTER_URL,
          })
        }
      } catch {
        continue
      }
    }

    return NextResponse.json({
      items: [],
      customerName: ETP_GPB_CUSTOMER_NAME,
      filterUrl: ETP_FILTER_URL,
      warning:
        "RSS ЭТП ГПБ сейчас недоступен с сервера. Актуальные закупки — на площадке.",
    })
  } catch (error) {
    console.error("Error fetching ETP tenders:", error)
    return NextResponse.json({
      items: [],
      customerName: ETP_GPB_CUSTOMER_NAME,
      filterUrl: ETP_FILTER_URL,
      warning: "Не удалось загрузить тендеры. Откройте площадку ЭТП ГПБ.",
    })
  }
}
