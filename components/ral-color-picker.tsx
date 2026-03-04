"use client"

import { useState, useMemo } from "react"
import { Search, X } from "lucide-react"

export type RalColor = {
  code: string   // "RAL 1000"
  name: string   // "Зелёно-бежевый"
  hex: string    // "#BEBD7F"
}

export const RAL_COLORS: RalColor[] = [
  // 1xxx — Жёлтые
  { code: "RAL 1000", name: "Зелёно-бежевый", hex: "#BEBD7F" },
  { code: "RAL 1001", name: "Бежевый", hex: "#C2B078" },
  { code: "RAL 1002", name: "Жёлто-песочный", hex: "#C6A664" },
  { code: "RAL 1003", name: "Жёлтый сигнальный", hex: "#E5BE01" },
  { code: "RAL 1004", name: "Жёлтый золотистый", hex: "#CDA434" },
  { code: "RAL 1005", name: "Жёлтый медовый", hex: "#A98307" },
  { code: "RAL 1006", name: "Жёлтый маисовый", hex: "#E4A010" },
  { code: "RAL 1007", name: "Жёлтый нарциссовый", hex: "#DC9D00" },
  { code: "RAL 1011", name: "Коричнево-бежевый", hex: "#8A6642" },
  { code: "RAL 1012", name: "Жёлтый лимонный", hex: "#C7B446" },
  { code: "RAL 1013", name: "Белый жемчужный", hex: "#EAE6CA" },
  { code: "RAL 1014", name: "Слоновая кость", hex: "#E1CC4F" },
  { code: "RAL 1015", name: "Светлая слоновая кость", hex: "#E6D690" },
  { code: "RAL 1016", name: "Серно-жёлтый", hex: "#EDFF21" },
  { code: "RAL 1017", name: "Шафраново-жёлтый", hex: "#F5D033" },
  { code: "RAL 1018", name: "Цинково-жёлтый", hex: "#F8F32B" },
  { code: "RAL 1019", name: "Серо-бежевый", hex: "#9E9764" },
  { code: "RAL 1020", name: "Оливково-жёлтый", hex: "#999950" },
  { code: "RAL 1021", name: "Жёлтый рапсовый", hex: "#F3DA0B" },
  { code: "RAL 1023", name: "Жёлтый транспортный", hex: "#FAD201" },
  { code: "RAL 1024", name: "Охра жёлтая", hex: "#AEA04B" },
  { code: "RAL 1026", name: "Люминесцентно-жёлтый", hex: "#FFFF00" },
  { code: "RAL 1027", name: "Карри", hex: "#9D9101" },
  { code: "RAL 1028", name: "Жёлтый дынный", hex: "#F4A900" },
  { code: "RAL 1032", name: "Жёлтый ракитника", hex: "#D6AE01" },
  { code: "RAL 1033", name: "Жёлтый георгина", hex: "#F3A505" },
  { code: "RAL 1034", name: "Пастельно-жёлтый", hex: "#EFA94A" },
  { code: "RAL 1035", name: "Жемчужно-бежевый", hex: "#6A5D4D" },
  { code: "RAL 1036", name: "Жемчужно-золотой", hex: "#705335" },
  { code: "RAL 1037", name: "Жёлтый солнечный", hex: "#F39F18" },
  // 2xxx — Оранжевые
  { code: "RAL 2000", name: "Жёлто-оранжевый", hex: "#ED760E" },
  { code: "RAL 2001", name: "Красно-оранжевый", hex: "#C93C20" },
  { code: "RAL 2002", name: "Киноварь", hex: "#CB2821" },
  { code: "RAL 2003", name: "Пастельно-оранжевый", hex: "#FF7514" },
  { code: "RAL 2004", name: "Чисто оранжевый", hex: "#F44611" },
  { code: "RAL 2005", name: "Люминесцентно-оранжевый", hex: "#FF2301" },
  { code: "RAL 2007", name: "Люминесцентный ярко-оранжевый", hex: "#FFA420" },
  { code: "RAL 2008", name: "Ярко-красно-оранжевый", hex: "#F75E25" },
  { code: "RAL 2009", name: "Оранжевый транспортный", hex: "#F54021" },
  { code: "RAL 2010", name: "Оранжевый сигнальный", hex: "#D84B20" },
  { code: "RAL 2011", name: "Глубокий оранжевый", hex: "#EC7C26" },
  { code: "RAL 2012", name: "Лососево-оранжевый", hex: "#E55137" },
  { code: "RAL 2013", name: "Жемчужно-оранжевый", hex: "#C35831" },
  { code: "RAL 2017", name: "RAL Оранжевый", hex: "#F6681C" },
  // 3xxx — Красные
  { code: "RAL 3000", name: "Огненно-красный", hex: "#AF2B1E" },
  { code: "RAL 3001", name: "Сигнально-красный", hex: "#A52019" },
  { code: "RAL 3002", name: "Карминно-красный", hex: "#A2231D" },
  { code: "RAL 3003", name: "Рубиново-красный", hex: "#9B111E" },
  { code: "RAL 3004", name: "Пурпурно-красный", hex: "#75151E" },
  { code: "RAL 3005", name: "Винно-красный", hex: "#5E2129" },
  { code: "RAL 3007", name: "Чёрно-красный", hex: "#412227" },
  { code: "RAL 3009", name: "Оксидно-красный", hex: "#642424" },
  { code: "RAL 3011", name: "Коричнево-красный", hex: "#781F19" },
  { code: "RAL 3012", name: "Бежево-красный", hex: "#C1876B" },
  { code: "RAL 3013", name: "Томатно-красный", hex: "#A12312" },
  { code: "RAL 3014", name: "Античный розовый", hex: "#D36E70" },
  { code: "RAL 3015", name: "Светло-розовый", hex: "#EA899A" },
  { code: "RAL 3016", name: "Коралловый", hex: "#B32821" },
  { code: "RAL 3017", name: "Розовый", hex: "#E63244" },
  { code: "RAL 3018", name: "Клубнично-красный", hex: "#D53032" },
  { code: "RAL 3020", name: "Транспортный красный", hex: "#CC0605" },
  { code: "RAL 3022", name: "Лососево-розовый", hex: "#D95030" },
  { code: "RAL 3024", name: "Люминесцентный красный", hex: "#F80000" },
  { code: "RAL 3026", name: "Люминесцентный ярко-красный", hex: "#FE0000" },
  { code: "RAL 3027", name: "Малиново-красный", hex: "#C51D34" },
  { code: "RAL 3028", name: "Чисто красный", hex: "#CB3234" },
  { code: "RAL 3031", name: "Ориентально-красный", hex: "#B32428" },
  { code: "RAL 3032", name: "Перламутрово-рубиновый", hex: "#721422" },
  { code: "RAL 3033", name: "Перламутрово-розовый", hex: "#B44C43" },
  // 4xxx — Фиолетовые
  { code: "RAL 4001", name: "Красно-сиреневый", hex: "#6D3F5B" },
  { code: "RAL 4002", name: "Красно-фиолетовый", hex: "#922B3E" },
  { code: "RAL 4003", name: "Вересково-фиолетовый", hex: "#DE4C8A" },
  { code: "RAL 4004", name: "Бордово-фиолетовый", hex: "#641C34" },
  { code: "RAL 4005", name: "Голубовато-сиреневый", hex: "#6C4675" },
  { code: "RAL 4006", name: "Транспортный пурпурный", hex: "#A03472" },
  { code: "RAL 4007", name: "Пурпурно-фиолетовый", hex: "#4A192C" },
  { code: "RAL 4008", name: "Сигнально-фиолетовый", hex: "#924E7D" },
  { code: "RAL 4009", name: "Пастельно-фиолетовый", hex: "#A18594" },
  { code: "RAL 4010", name: "Теле-пурпурный", hex: "#CF3476" },
  { code: "RAL 4011", name: "Жемчужно-фиолетовый", hex: "#8673A1" },
  { code: "RAL 4012", name: "Жемчужно-ежевичный", hex: "#6C6874" },
  // 5xxx — Синие
  { code: "RAL 5000", name: "Фиолетово-синий", hex: "#354D73" },
  { code: "RAL 5001", name: "Зелёно-синий", hex: "#1F3438" },
  { code: "RAL 5002", name: "Ультрамарин", hex: "#20214F" },
  { code: "RAL 5003", name: "Сапфирово-синий", hex: "#1D1E33" },
  { code: "RAL 5004", name: "Чёрно-синий", hex: "#18171C" },
  { code: "RAL 5005", name: "Сигнально-синий", hex: "#1E2460" },
  { code: "RAL 5007", name: "Ярко-синий", hex: "#3E5F8A" },
  { code: "RAL 5008", name: "Серо-синий", hex: "#26252D" },
  { code: "RAL 5009", name: "Лазурно-синий", hex: "#025669" },
  { code: "RAL 5010", name: "Генцианово-синий", hex: "#0E294B" },
  { code: "RAL 5011", name: "Стальной синий", hex: "#231A24" },
  { code: "RAL 5012", name: "Светло-синий", hex: "#3B83BD" },
  { code: "RAL 5013", name: "Кобальтово-синий", hex: "#1E213D" },
  { code: "RAL 5014", name: "Голубино-синий", hex: "#606E8C" },
  { code: "RAL 5015", name: "Небесно-синий", hex: "#2271B3" },
  { code: "RAL 5017", name: "Транспортный синий", hex: "#063971" },
  { code: "RAL 5018", name: "Бирюзово-синий", hex: "#3F888F" },
  { code: "RAL 5019", name: "Синий Капри", hex: "#1B5583" },
  { code: "RAL 5020", name: "Океанский синий", hex: "#1D334A" },
  { code: "RAL 5021", name: "Водяной синий", hex: "#256D7B" },
  { code: "RAL 5022", name: "Ночной синий", hex: "#252850" },
  { code: "RAL 5023", name: "Отдалённо-синий", hex: "#49678D" },
  { code: "RAL 5024", name: "Пастельно-синий", hex: "#5D9B9B" },
  { code: "RAL 5025", name: "Жемчужно-генцианово-синий", hex: "#2A6478" },
  { code: "RAL 5026", name: "Жемчужно-ночной синий", hex: "#102C54" },
  // 6xxx — Зелёные
  { code: "RAL 6000", name: "Патиново-зелёный", hex: "#316650" },
  { code: "RAL 6001", name: "Изумрудно-зелёный", hex: "#287233" },
  { code: "RAL 6002", name: "Лиственно-зелёный", hex: "#2D572C" },
  { code: "RAL 6003", name: "Оливково-зелёный", hex: "#424632" },
  { code: "RAL 6004", name: "Сине-зелёный", hex: "#1F3A3D" },
  { code: "RAL 6005", name: "Мохово-зелёный", hex: "#2F4538" },
  { code: "RAL 6006", name: "Серо-оливковый", hex: "#3E3B32" },
  { code: "RAL 6007", name: "Бутылочно-зелёный", hex: "#343B29" },
  { code: "RAL 6008", name: "Коричнево-зелёный", hex: "#39352A" },
  { code: "RAL 6009", name: "Пихтово-зелёный", hex: "#31372B" },
  { code: "RAL 6010", name: "Травяной зелёный", hex: "#35682D" },
  { code: "RAL 6011", name: "Резедово-зелёный", hex: "#587246" },
  { code: "RAL 6012", name: "Чёрно-зелёный", hex: "#343E40" },
  { code: "RAL 6013", name: "Камышово-зелёный", hex: "#6C7156" },
  { code: "RAL 6014", name: "Жёлто-оливковый", hex: "#47402E" },
  { code: "RAL 6015", name: "Чёрно-оливковый", hex: "#3B3C36" },
  { code: "RAL 6016", name: "Бирюзово-зелёный", hex: "#1E5945" },
  { code: "RAL 6017", name: "Майский зелёный", hex: "#4C9141" },
  { code: "RAL 6018", name: "Жёлто-зелёный", hex: "#57A639" },
  { code: "RAL 6019", name: "Пастельно-зелёный", hex: "#BDECB6" },
  { code: "RAL 6020", name: "Хромовый зелёный", hex: "#2E3A23" },
  { code: "RAL 6021", name: "Бледно-зелёный", hex: "#89AC76" },
  { code: "RAL 6022", name: "Коричнево-оливковый", hex: "#25221B" },
  { code: "RAL 6024", name: "Транспортный зелёный", hex: "#308446" },
  { code: "RAL 6025", name: "Папоротниково-зелёный", hex: "#3D642D" },
  { code: "RAL 6026", name: "Опаловый зелёный", hex: "#015D52" },
  { code: "RAL 6027", name: "Светло-зелёный", hex: "#84C3BE" },
  { code: "RAL 6028", name: "Сосново-зелёный", hex: "#2C5545" },
  { code: "RAL 6029", name: "Мятно-зелёный", hex: "#20603D" },
  { code: "RAL 6032", name: "Сигнально-зелёный", hex: "#317F43" },
  { code: "RAL 6033", name: "Мятно-бирюзовый", hex: "#497E76" },
  { code: "RAL 6034", name: "Пастельно-бирюзовый", hex: "#7FB5B5" },
  { code: "RAL 6035", name: "Перламутрово-зелёный", hex: "#1C542D" },
  { code: "RAL 6036", name: "Перламутрово-опаловый зелёный", hex: "#193737" },
  { code: "RAL 6037", name: "Чисто зелёный", hex: "#008F39" },
  { code: "RAL 6038", name: "Люминесцентный зелёный", hex: "#00BB2D" },
  { code: "RAL 6039", name: "Зелёное волокно", hex: "#B7D9B1" },
  // 7xxx — Серые
  { code: "RAL 7000", name: "Серый беличий", hex: "#78858B" },
  { code: "RAL 7001", name: "Серебристо-серый", hex: "#8A9597" },
  { code: "RAL 7002", name: "Оливково-серый", hex: "#817F68" },
  { code: "RAL 7003", name: "Мохово-серый", hex: "#7D7F7D" },
  { code: "RAL 7004", name: "Сигнально-серый", hex: "#9EA0A1" },
  { code: "RAL 7005", name: "Мышино-серый", hex: "#6C7059" },
  { code: "RAL 7006", name: "Бежево-серый", hex: "#756F61" },
  { code: "RAL 7008", name: "Хаки серый", hex: "#746643" },
  { code: "RAL 7009", name: "Зелёно-серый", hex: "#5B6259" },
  { code: "RAL 7010", name: "Брезентово-серый", hex: "#575D57" },
  { code: "RAL 7011", name: "Железно-серый", hex: "#555D61" },
  { code: "RAL 7012", name: "Базальтово-серый", hex: "#596163" },
  { code: "RAL 7013", name: "Коричнево-серый", hex: "#555548" },
  { code: "RAL 7015", name: "Сланцево-серый", hex: "#51565C" },
  { code: "RAL 7016", name: "Антрацитово-серый", hex: "#373F43" },
  { code: "RAL 7021", name: "Чёрно-серый", hex: "#2E3234" },
  { code: "RAL 7022", name: "Умбро-серый", hex: "#43464B" },
  { code: "RAL 7023", name: "Бетонно-серый", hex: "#818479" },
  { code: "RAL 7024", name: "Графитово-серый", hex: "#474A51" },
  { code: "RAL 7026", name: "Гранитово-серый", hex: "#374447" },
  { code: "RAL 7030", name: "Каменно-серый", hex: "#939388" },
  { code: "RAL 7031", name: "Голубовато-серый", hex: "#5D6970" },
  { code: "RAL 7032", name: "Галечно-серый", hex: "#B9B9A8" },
  { code: "RAL 7033", name: "Цементно-серый", hex: "#818979" },
  { code: "RAL 7034", name: "Жёлто-серый", hex: "#939176" },
  { code: "RAL 7035", name: "Светло-серый", hex: "#CBD0CC" },
  { code: "RAL 7036", name: "Платиново-серый", hex: "#9C9C9C" },
  { code: "RAL 7037", name: "Пыльно-серый", hex: "#7C7F7E" },
  { code: "RAL 7038", name: "Агатово-серый", hex: "#B4B8B0" },
  { code: "RAL 7039", name: "Кварцево-серый", hex: "#6B695F" },
  { code: "RAL 7040", name: "Оконно-серый", hex: "#9DA3A6" },
  { code: "RAL 7042", name: "Транспортный серый A", hex: "#8E9291" },
  { code: "RAL 7043", name: "Транспортный серый B", hex: "#4E5452" },
  { code: "RAL 7044", name: "Шёлково-серый", hex: "#CAC4B0" },
  { code: "RAL 7045", name: "Телесерый 1", hex: "#909090" },
  { code: "RAL 7046", name: "Телесерый 2", hex: "#82898F" },
  { code: "RAL 7047", name: "Телесерый 4", hex: "#D0D0D0" },
  { code: "RAL 7048", name: "Перламутровый мышино-серый", hex: "#898176" },
  // 8xxx — Коричневые
  { code: "RAL 8000", name: "Зелёно-коричневый", hex: "#826C34" },
  { code: "RAL 8001", name: "Охристо-коричневый", hex: "#955F20" },
  { code: "RAL 8002", name: "Сигнально-коричневый", hex: "#6C3B2A" },
  { code: "RAL 8003", name: "Глиняно-коричневый", hex: "#734222" },
  { code: "RAL 8004", name: "Медно-коричневый", hex: "#8E402A" },
  { code: "RAL 8007", name: "Олений коричневый", hex: "#59351F" },
  { code: "RAL 8008", name: "Оливково-коричневый", hex: "#6F4F28" },
  { code: "RAL 8011", name: "Ореховый коричневый", hex: "#53422E" },
  { code: "RAL 8012", name: "Красно-коричневый", hex: "#582D1C" },
  { code: "RAL 8014", name: "Сепия коричневая", hex: "#49392D" },
  { code: "RAL 8015", name: "Каштановый коричневый", hex: "#633A34" },
  { code: "RAL 8016", name: "Красно-коричневый (mahogany)", hex: "#4C2F27" },
  { code: "RAL 8017", name: "Шоколадно-коричневый", hex: "#45322E" },
  { code: "RAL 8019", name: "Серо-коричневый", hex: "#403A3A" },
  { code: "RAL 8022", name: "Чёрно-коричневый", hex: "#212121" },
  { code: "RAL 8023", name: "Оранжево-коричневый", hex: "#A65E2E" },
  { code: "RAL 8024", name: "Бежево-коричневый", hex: "#79553D" },
  { code: "RAL 8025", name: "Бледно-коричневый", hex: "#755C48" },
  { code: "RAL 8028", name: "Терракотово-коричневый", hex: "#4E3B31" },
  { code: "RAL 8029", name: "Жемчужно-медный", hex: "#763C28" },
  // 9xxx — Белые/чёрные
  { code: "RAL 9001", name: "Кремово-белый", hex: "#FDF4E3" },
  { code: "RAL 9002", name: "Серо-белый", hex: "#E7EBDA" },
  { code: "RAL 9003", name: "Сигнально-белый", hex: "#F4F4F4" },
  { code: "RAL 9004", name: "Сигнально-чёрный", hex: "#282828" },
  { code: "RAL 9005", name: "Чёрный насыщенный", hex: "#0A0A0A" },
  { code: "RAL 9006", name: "Белый алюминий", hex: "#A5A5A5" },
  { code: "RAL 9007", name: "Серый алюминий", hex: "#8F8F8F" },
  { code: "RAL 9010", name: "Чисто белый", hex: "#FFFFFF" },
  { code: "RAL 9011", name: "Графитово-чёрный", hex: "#1C1C1C" },
  { code: "RAL 9012", name: "Белый для чистых помещений", hex: "#F6F4F0" },
  { code: "RAL 9016", name: "Транспортный белый", hex: "#F6F6F6" },
  { code: "RAL 9017", name: "Транспортный чёрный", hex: "#1E1E1E" },
  { code: "RAL 9018", name: "Папирусно-белый", hex: "#D7D7D7" },
  { code: "RAL 9022", name: "Жемчужный светло-серый", hex: "#9E9E9E" },
  { code: "RAL 9023", name: "Жемчужный тёмно-серый", hex: "#828282" },
]

type Props = {
  selected: RalColor | null
  onChange: (color: RalColor | null) => void
}

export function RalColorPicker({ selected, onChange }: Props) {
  const [search, setSearch] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return RAL_COLORS
    return RAL_COLORS.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q)
    )
  }, [search])

  // Нужен контрастный цвет текста поверх свотча
  const isLight = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return (r * 299 + g * 587 + b * 114) / 1000 > 128
  }

  return (
    <div className="space-y-3">
      {/* Текущий выбор */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className="flex items-center gap-3 px-3 py-2 rounded-xl border border-border hover:border-primary/50 transition-colors bg-background w-full text-left"
        >
          {selected ? (
            <>
              <span
                className="w-8 h-8 rounded-lg border border-border flex-shrink-0 shadow-sm"
                style={{ backgroundColor: selected.hex }}
              />
              <span className="flex-1">
                <span className="font-semibold text-sm block">{selected.code}</span>
                <span className="text-xs text-muted-foreground">{selected.name}</span>
              </span>
            </>
          ) : (
            <>
              <span className="w-8 h-8 rounded-lg border-2 border-dashed border-border flex-shrink-0" />
              <span className="text-sm text-muted-foreground">Выбрать цвет RAL...</span>
            </>
          )}
          <span className="text-xs text-muted-foreground ml-auto">{isOpen ? "▲" : "▼"}</span>
        </button>

        {selected && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
            title="Сбросить"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Раскрывающаяся палитра */}
      {isOpen && (
        <div className="rounded-2xl border border-border bg-card shadow-lg overflow-hidden">
          {/* Поиск */}
          <div className="p-3 border-b border-border">
            <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
              <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <input
                type="text"
                placeholder="Поиск по коду или названию…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm"
                autoFocus
              />
              {search && (
                <button type="button" onClick={() => setSearch("")}>
                  <X className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>
          </div>

          {/* Сетка цветов */}
          <div className="p-3 max-h-72 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-6">Ничего не найдено</p>
            ) : (
              <div className="grid grid-cols-8 sm:grid-cols-10 gap-1.5">
                {filtered.map((color) => {
                  const active = selected?.code === color.code
                  return (
                    <button
                      key={color.code}
                      type="button"
                      title={`${color.code} — ${color.name}`}
                      onClick={() => {
                        onChange(color)
                        setIsOpen(false)
                        setSearch("")
                      }}
                      className={`
                        relative w-full aspect-square rounded-lg border-2 transition-all hover:scale-110
                        ${active ? "border-primary ring-2 ring-primary/40 scale-110" : "border-transparent hover:border-border"}
                      `}
                      style={{ backgroundColor: color.hex }}
                    >
                      {active && (
                        <span
                          className="absolute inset-0 flex items-center justify-center text-xs font-bold"
                          style={{ color: isLight(color.hex) ? "#000" : "#fff" }}
                        >
                          ✓
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Подпись кол-ва */}
          <div className="px-3 pb-2 text-right">
            <span className="text-xs text-muted-foreground">{filtered.length} цветов RAL Classic</span>
          </div>
        </div>
      )}
    </div>
  )
}
