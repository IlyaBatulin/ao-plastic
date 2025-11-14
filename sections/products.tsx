"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

const products = [
  {
    id: 1,
    slug: "abs-plastic",
    name: "АБС-пластик",
    description: "Высококачественный АБС-пластик для различных отраслей промышленности",
    image: "/abs-plastic-pellets-industrial.jpg",
  },
  {
    id: 2,
    slug: "polystyrene",
    name: "Полистирол",
    description: "Суспензионный полистирол различных марок для широкого применения",
    image: "/polystyrene-granules-white.jpg",
  },
  {
    id: 3,
    slug: "styrene",
    name: "Стирол",
    description: "Мономер стирола высокой степени очистки для химической промышленности",
    image: "/chemical-industrial-containers.jpg",
  },
  {
    id: 4,
    slug: "plastic-products",
    name: "Изделия из пластика",
    description: "Широкий ассортимент готовых изделий для промышленности и быта",
    image: "/plastic-industrial-products.jpg",
  },
  {
    id: 5,
    slug: "machine-parts",
    name: "Детали машиностроения",
    description: "Комплектующие изделия для автомобилей и машиностроительной отрасли",
    image: "/automotive-plastic-parts.jpg",
  },
  {
    id: 6,
    slug: "safety-equipment",
    name: "Средства защиты",
    description: "Каски, маски и другие средства индивидуальной защиты",
    image: "/safety-helmets-and-protective-equipment.jpg",
  },
]

export function Products() {
  return (
    <section id="products" className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">Продукция</h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Широкий ассортимент полимерного сырья и готовых изделий, соответствующих современным стандартам качества
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative h-64 overflow-hidden bg-muted">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">{product.description}</p>
                <div className="flex items-center text-primary font-semibold group-hover:gap-2 transition-all">
                  Подробнее
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" asChild className="transition-transform hover:scale-105">
            <Link href="/products">
              Смотреть весь каталог
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
