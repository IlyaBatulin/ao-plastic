import { AbsShimmerCard } from "@/app/products/_components/abs-shimmer-card"

const intro =
  "Широкий выбор марок литьевого АБС-пластика. Основной метод переработки — литьё под давлением на термопластавтоматах."

const advantages = [
  { title: "Высокий ПТР", desc: "Отдельные марки — стойкость к горению, антистатика" },
  { title: "Термостойкость", desc: "Детали автопрома, компаундирование с поликарбонатом" },
  { title: "Жёсткость и текучесть", desc: "Мелкие детали приборостроения и техники" },
]

const applications = [
  "Решётки радиатора",
  "Колпаки колёс",
  "Корпуса бытовой и оргтехники",
  "Металлизированные детали",
  "Выключатели, переключатели",
  "Корпуса электроинструмента",
  "Канцелярия и настольные принадлежности",
  "Игрушки и конструкторы",
  "Дверные ручки",
  "Сантехника",
  "Фитинги",
  "Медицинские изделия",
]

export function AbsInjectionInfo() {
  return (
    <AbsShimmerCard>
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">
        Литьевой АБС-пластик
      </h2>
      <p className="mt-4 text-muted-foreground leading-relaxed">{intro}</p>

      <h3 className="mt-10 text-base font-semibold text-foreground">Свойства марок</h3>
      <dl className="mt-4 space-y-5 border-t border-border pt-5">
        {advantages.map((item) => (
          <div key={item.title}>
            <dt className="font-medium text-foreground">{item.title}</dt>
            <dd className="mt-1 text-sm text-muted-foreground leading-relaxed">{item.desc}</dd>
          </div>
        ))}
      </dl>

      <h3 className="mt-10 text-base font-semibold text-foreground">Применение</h3>
      <ul className="mt-4 grid grid-cols-1 gap-x-10 gap-y-2 text-sm text-muted-foreground sm:grid-cols-2">
        {applications.map((app) => (
          <li key={app}>{app}</li>
        ))}
      </ul>

      <p className="mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground leading-relaxed">
        Чтобы купить АБС-пластик в гранулах по выгодной стоимости, обращайтесь в нашу компанию — гранулированный
        пластик с соответствием всем стандартам качества.
      </p>
    </AbsShimmerCard>
  )
}
