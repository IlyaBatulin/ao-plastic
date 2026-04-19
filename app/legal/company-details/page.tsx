import type { Metadata } from "next"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Реквизиты компании",
  description:
    "Юридические реквизиты АО «Пластик»: ИНН, КПП, ОГРН, юридический и почтовый адрес, контакты для договоров.",
  alternates: { canonical: "/legal/company-details" },
}

export default function CompanyDetailsPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Реквизиты компании</h1>
          
          <div className="prose prose-lg max-w-none space-y-6 text-foreground">
            <section className="bg-card rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-semibold mb-6">АО «Пластик»</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Юридический адрес:</h3>
                  <p>301600, Тульская область, г. Узловая, ул. Тульская, д. 1</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Фактический адрес:</h3>
                  <p>301600, Тульская область, г. Узловая, ул. Тульская, д. 1</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Контактная информация:</h3>
                  <p>Телефон: +7 (495) 201-03-33</p>
                  <p>Email: info@oaplastic.ru</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Реквизиты:</h3>
                  <p>ОГРН: [указать ОГРН]</p>
                  <p>ИНН: [указать ИНН]</p>
                  <p>КПП: [указать КПП]</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Банковские реквизиты:</h3>
                  <p>Банк: [название банка]</p>
                  <p>БИК: [БИК]</p>
                  <p>Расчетный счет: [р/с]</p>
                  <p>Корреспондентский счет: [к/с]</p>
                </div>
              </div>
            </section>

            <p className="text-sm text-muted-foreground">
              * Укажите актуальные реквизиты компании
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

