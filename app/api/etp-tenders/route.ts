import { NextResponse } from "next/server"
import {
  ETP_FILTER_URL,
  ETP_GPB_CUSTOMER_NAME,
  fetchEtpTenders,
} from "@/lib/etp-api"

export async function GET() {
  try {
    const data = await fetchEtpTenders()
    return NextResponse.json(data)
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
