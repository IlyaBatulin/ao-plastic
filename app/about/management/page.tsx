"use client"

import { Footer } from "@/components/footer"
import { ChromaGrid, type ChromaItem } from "@/components/chroma-grid"
import { useEffect, useRef } from "react"

const teamMembers = [
  { name: "Кузнецов Александр Викторович", position: "Генеральный директор", bio: "Опыт работы в химической промышленности более 30 лет. Под его руководством АО 'Пластик' стало лидером отрасли по производству АБС-пластиков и полистиролов в России.", email: "director@oaplastic.ru", phone: "+7 (48731) 6-12-34" },
  { name: "Смирнов Дмитрий Петрович", position: "Технический директор", bio: "Доктор технических наук, специалист по полимерным материалам. Руководит модернизацией производства и внедрением инновационных технологий.", email: "tech@oaplastic.ru", phone: "+7 (48731) 6-12-35" },
  { name: "Волкова Елена Сергеевна", position: "Финансовый директор", bio: "MBA, более 20 лет опыта в финансовом управлении крупных промышленных предприятий. Обеспечивает финансовую стабильность и развитие компании.", email: "finance@oaplastic.ru", phone: "+7 (48731) 6-12-36" },
  { name: "Морозов Игорь Николаевич", position: "Директор по производству", bio: "Инженер-технолог с 25-летним стажем. Отвечает за эффективность производственных процессов и контроль качества продукции.", email: "production@oaplastic.ru", phone: "+7 (48731) 6-12-37" },
  { name: "Соколова Ольга Андреевна", position: "Директор по качеству", bio: "Специалист по системам менеджмента качества. Обеспечивает соответствие продукции международным стандартам ISO и ГОСТ.", email: "quality@oaplastic.ru", phone: "+7 (48731) 6-12-38" },
  { name: "Петров Сергей Владимирович", position: "Коммерческий директор", bio: "Эксперт в области продаж полимерных материалов. Развивает партнерские отношения с клиентами в России, СНГ и странах Европы через Торговый дом 'Пластик'.", email: "sales@oaplastic.ru", phone: "+7 (48731) 6-12-39" },
]

export default function ManagementPage() {
  const cardsRef = useRef<HTMLDivElement>(null)
  const managementItems: ChromaItem[] = teamMembers.map((member, index) => ({
    image: `/placeholder.svg?height=400&width=400&text=${member.name.charAt(0)}`,
    title: member.name,
    subtitle: member.position,
    handle: member.bio.substring(0, 50) + "...",
    borderColor: "#0046FF",
    gradient: `linear-gradient(${135 + index * 30}deg, #0046FF, #000)`,
  }))

  useEffect(() => {
    if (typeof window === "undefined" || !window.gsap || !window.ScrollTrigger) return

    if (!cardsRef.current) return

    const cards = cardsRef.current.querySelectorAll(".management-card")

    cards.forEach((card, index) => {
      window.gsap.fromTo(
        card,
        {
          y: 80,
          opacity: 0,
          scale: 0.95,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          delay: index * 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top bottom-=100",
            toggleActions: "play none none none",
          },
        },
      )
    })
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <section className="pt-32 pb-24 bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-balance bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                Руководство
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
                Наша команда профессионалов с многолетним опытом в индустрии пластиковых материалов
              </p>
            </div>

            <div style={{ minHeight: "800px", position: "relative" }}>
              <ChromaGrid items={managementItems} radius={300} damping={0.45} fadeOut={0.6} ease="power3.out" />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
