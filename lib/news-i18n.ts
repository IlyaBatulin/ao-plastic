import type { Language } from "@/lib/language"

// Reviewed translations of the site's own news copy. Unknown future copy is
// preserved, not replaced with a translation of an older article by numeric ID.
const copy: Record<string, string> = {
  "Состоялся первый выпуск учащихся по программе «Профессионалитет» от АО «Пластик»": "First students graduate from JSC Plastic's Professionalitet programme",
  "Молодые технологи и лаборанты завершили своё обучение в Узловском политехническом колледже, где при поддержке АО «Пластик» прошли трехлетнюю подготовку по программе «Профессионалитет».": "Young process technicians and laboratory technicians have graduated from Uzlovaya Polytechnic College after a three-year Professionalitet vocational training programme supported by JSC Plastic.",
  "Предприятие организовало на своей территории учебную площадку, построив новый корпус с современными лабораториями для подготовки работников химической промышленности. Лучшие специалисты завода обучали молодежь по направлению «Химическая технология органических веществ». По программе «Профессионалитет» АО «Пластик» подготовил 35 химиков, 10 выпускников окончили колледж с красным дипломом.": "The company established a training centre on its site, building a new facility with modern laboratories for training chemical industry personnel. Leading plant specialists taught students in the Chemical Technology of Organic Substances programme. JSC Plastic trained 35 chemistry specialists through Professionalitet, with 10 graduates receiving honours diplomas.",
  "На торжественном вечере в тульском ДК Машиностроителей выпускников поздравили заместитель губернатора Тульской области Ярослав Раков, руководители Узловского района Николай Терехов и Марина Карташова.": "At a ceremony in Tula's Mashinostroiteley cultural centre, graduates were congratulated by Tula Region Deputy Governor Yaroslav Rakov and Uzlovaya district leaders Nikolay Terekhov and Marina Kartashova.",
  "Тепло поприветствовал молодых производственников генеральный директор АО «Пластик» Николай Кизимов.": "JSC Plastic CEO Nikolay Kizimov also warmly welcomed the young manufacturing specialists.",
  "Всего колледж в этом году подготовил 85 выпускников, из них 53 — в рамках федеральной программы «Профессионалитет».": "The college trained 85 graduates that year, including 53 through the federal Professionalitet programme.",
  "Видео от Узловский политехнический колледж": "Video from Uzlovaya Polytechnic College",
}

export function translateNewsText(text: string, lang: Language): string {
  if (lang !== "en") return text
  let result = text
  for (const [ru, en] of Object.entries(copy)) result = result.split(ru).join(en)
  return result
}

export function localizeNews<T extends { title: string; excerpt?: string | null; content?: string | null }>(item: T, lang: Language): T {
  if (lang !== "en") return item
  return {
    ...item,
    title: translateNewsText(item.title, lang),
    excerpt: item.excerpt ? translateNewsText(item.excerpt, lang) : item.excerpt,
    // Only text nodes are translated; embedded media, links and attributes stay intact.
    content: item.content?.split(/(<[^>]+>)/g).map(part => part.startsWith("<") ? part : translateNewsText(part, lang)).join("") ?? item.content,
  }
}
