import { Footer } from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowRight } from "lucide-react"
import newsData from "@/data/news.json"

export default function NewsPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="pt-32 pb-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4">Новости компании</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Актуальная информация о развитии компании и событиях в отрасли
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsData.news.map((item) => (
              <Card key={item.id} className="group hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(item.date).toLocaleDateString("ru-RU")}
                  </div>
                  <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">{item.title}</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.excerpt}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" asChild className="group/btn">
                    <Link href={`/news/${item.id}`}>
                      Читать далее
                      <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
