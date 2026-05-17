"use client"

import { Footer } from "@/components/footer"
import { getCategoryVideo } from "@/lib/video-config"

export default function MissionPage() {
  const missionVideoSrc = getCategoryVideo("polystyrene") ?? "/videos/polystyrene-category.mp4"

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden pt-32 pb-24 min-h-[500px]">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            controls={false}
            disablePictureInPicture
            disableRemotePlayback
            className="absolute inset-0 h-full w-full object-cover"
            style={{ pointerEvents: "none" }}
          >
            <source src={missionVideoSrc} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/75 to-background/95" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
        </div>

        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="text-center border-2 border-border rounded-xl bg-card/95 backdrop-blur-sm shadow-xl p-8 md:p-12 lg:p-16">
              <h1 className="text-h1 mb-8 text-balance font-semibold text-primary">
                Миссия компании
              </h1>
              <div className="text-xl md:text-2xl text-foreground/90 leading-relaxed text-pretty space-y-5 text-left md:text-center md:space-y-6 antialiased font-normal">
                <p>
                  Мы достигаем максимальной эффективности бизнеса на основе удовлетворения потребностей и ожиданий Потребителей,
                  долгосрочного обоснованного планирования, организации результативной работы каждого сотрудника, повышения уровня
                  комфорта и жизни общества.
                </p>
                <p>
                  Мы производим продукцию высокого уровня переработки нефти и газохимии для широкого круга промышленных Потребителей
                  в России и СНГ, развивая международные поставки в сотрудничестве со странами дальнего зарубежья:
                </p>
                <ul className="list-disc pl-6 md:pl-10 space-y-1.5 text-left inline-block">
                  <li>стирол, полистирол;</li>
                  <li>АБС пластики и листовые пластики;</li>
                  <li>комплектующие для автомобилестроения, машиностроения, строительной и других отраслей промышленности;</li>
                  <li>защитные каски, товары народного потребления и другие изделия промышленного назначения.</li>
                </ul>
                <p>
                  Наши цели и намерения направлены на повышение конкурентоспособности продукции и услуг предприятия за счёт:
                </p>
                <ul className="list-disc pl-6 md:pl-10 space-y-1.5 text-left inline-block">
                  <li>дальнейшего развития компетенций в области стирольных пластиков и переработки пластмасс;</li>
                  <li>
                    повышения результативности мероприятий по обеспечению качества продукции, в том числе по государственному
                    оборонному заказу;
                  </li>
                  <li>использования выгодного географического положения производственных площадок АО «Пластик».</li>
                </ul>
                <p>
                  Мы предлагаем гибкую ценовую политику и оптимальный ассортимент продуктового предложения за счёт изучения и учёта
                  в работе рыночных факторов внешней и внутренней среды бизнеса, реализации инвестиционных усилий, направленных на
                  внедрение современных технологий, устранение неэффективности производств, инноваций в технологиях и системах
                  управления, формирование благоприятного инвестиционного климата и реализацию новых проектов.
                </p>
                <p>
                  <span className="font-mission-motto text-primary">«От достигнутого — к совершенству»</span> — девиз, отражающий наше твёрдое намерение не останавливаться на достигнутом и
                  направленность на получение результатов в тех делах, в которых мы всегда должны быть, по крайней мере, не хуже
                  мировых практик.
                </p>
                <p>
                  Важнейшей ценностью АО «Пластик» являются работники предприятия. Мы предполагаем непрерывное развитие компетенций,
                  повышение уровня материального удовлетворения, формирование благоприятного микроклимата в коллективе, повышение
                  мотивации, материальное благосостояние работников предприятия и членов их семей, их уверенное материальное
                  положение и получение духовных ценностей, культуру производства и быта, заботу об охране труда.
                </p>
                <p>
                  Приоритет предприятия состоит в обеспечении гарантированной безопасности перед экологическим вредом для людей и
                  окружающей среды, повышении уровня безопасности и охраны труда.
                </p>
                <p>
                  Для реализации Миссии и целей АО «Пластик» предприятие будет продолжать повышать результативность и эффективность
                  системы менеджмента качества.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
