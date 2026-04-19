import { AbsShimmerCard } from "@/app/products/_components/abs-shimmer-card"

const introText =
  "В каталоге компании АО «Пластик» представлены несколько марок экструзионного АБС-пластика. Процесс экструзии АБС-пластика следующий: материал плавится в экструдере затем «продавливается» через фильеру с последующим охлаждением и калибровкой. Преимущества экструзионного АБС-пластика – высокие ударные характеристики, механическая прочность и жесткость."

const detailsText =
  "Из марок пластика, представленных в этом разделе, чаще всего изготавливается листы с большей или меньшей толщины с глянцевой или матовой поверхностью, в некоторых случаях – с тиснением. Листы впоследствии обрабатываются вакуум- и пневмоформованием в изделия."

const applications = [
  "детали интерьера и экстерьера автомобиля, включая крупногабаритные корпусные детали;",
  "конструкции, используемые в индустрии рекламы;",
  "корпусные элементы некоторых видов бытовой техники;",
  "мебельная кромка АБС;",
  "чемоданы;",
  "ряд других изделий из АБС-пластика экструзионного типа.",
]

export function AbsExtrusionInfo() {
  return (
    <AbsShimmerCard>
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">
        Экструзионный АБС-пластик
      </h2>
      <p className="mt-4 text-muted-foreground leading-relaxed">{introText}</p>

      <h3 className="mt-10 text-base font-semibold text-foreground">Область применения</h3>
      <p className="mt-4 text-muted-foreground leading-relaxed">{detailsText}</p>

      <ul className="mt-6 space-y-2.5 text-sm text-muted-foreground leading-relaxed">
        {applications.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </AbsShimmerCard>
  )
}
