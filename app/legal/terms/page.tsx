import { Footer } from "@/components/footer"

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Пользовательское соглашение</h1>
          
          <div className="prose prose-lg max-w-none space-y-6 text-foreground">
            <p className="text-muted-foreground">Последнее обновление: {new Date().toLocaleDateString('ru-RU')}</p>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Общие условия</h2>
              <p>
                Настоящее Пользовательское соглашение (далее — «Соглашение») определяет условия использования 
                сайта АО «Пластик» (далее — «Сайт»).
              </p>
              <p>
                Используя Сайт, вы принимаете условия настоящего Соглашения.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Использование Сайта</h2>
              <p>При использовании Сайта вы обязуетесь:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Не нарушать права интеллектуальной собственности</li>
                <li>Не использовать Сайт в незаконных целях</li>
                <li>Не распространять вредоносное программное обеспечение</li>
                <li>Предоставлять достоверную информацию при отправке заявок</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Интеллектуальная собственность</h2>
              <p>
                Все материалы Сайта (тексты, изображения, логотипы) являются собственностью АО «Пластик» 
                и защищены законодательством об авторском праве.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Ограничение ответственности</h2>
              <p>
                АО «Пластик» не несет ответственности за ущерб, возникший в результате использования 
                или невозможности использования Сайта.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Изменения в Соглашении</h2>
              <p>
                АО «Пластик» оставляет за собой право изменять условия настоящего Соглашения. 
                Изменения вступают в силу с момента публикации на Сайте.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Контакты</h2>
              <p>
                По вопросам использования Сайта обращайтесь:
              </p>
              <p>
                <strong>АО «Пластик»</strong><br />
                Email: info@oaplastic.ru<br />
                Телефон: +7 (495) 201-03-33
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

