const technologies = [
  {
    step: "01",
    title: "Полимеризация",
    description: "Современные реакторы для производства полимеров с точным контролем параметров процесса",
    image: "/chemical-reactor-industrial-equipment.jpg",
  },
  {
    step: "02",
    title: "Экструзия",
    description: "Высокопроизводительные экструзионные линии для формования пластиковых изделий",
    image: "/plastic-extrusion-machine-manufacturing.jpg",
  },
  {
    step: "03",
    title: "Литьё под давлением",
    description: "Автоматизированные термопластавтоматы для производства сложных деталей",
    image: "/injection-molding-machine-industrial.jpg",
  },
  {
    step: "04",
    title: "Контроль качества",
    description: "Лабораторное оборудование для тестирования физико-химических свойств продукции",
    image: "/quality-control-laboratory-testing.jpg",
  },
]

export function Technologies() {
  return (
    <section id="technologies" className="py-24 lg:py-32 bg-secondary">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">Технологии производства</h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Современное оборудование и передовые технологии обеспечивают высокое качество нашей продукции
          </p>
        </div>

        <div className="space-y-24">
          {technologies.map((tech, index) => (
            <div
              key={index}
              className={`flex flex-col ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} gap-12 items-center`}
            >
              <div className="flex-1">
                <div className="relative h-96 rounded-2xl overflow-hidden shadow-lg">
                  <img src={tech.image || "/placeholder.svg"} alt={tech.title} className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="flex-1">
                <div className="text-6xl lg:text-7xl font-bold text-primary/20 mb-4">{tech.step}</div>
                <h3 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">{tech.title}</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">{tech.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
