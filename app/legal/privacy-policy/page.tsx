import type { Metadata } from "next"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  description:
    "Политика обработки персональных данных на сайте АО «Пластик»: цели, сроки хранения и права пользователей.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/legal/privacy-policy" },
}

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Политика конфиденциальности</h1>
          
          <div className="prose prose-lg max-w-none space-y-6 break-words text-foreground [overflow-wrap:anywhere]">
            <p className="text-muted-foreground">Последнее обновление: {new Date().toLocaleDateString('ru-RU')}</p>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Общие положения</h2>
              <p>
                Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональных данных 
                пользователей сайта АО «Пластик» (далее — «Сайт»).
              </p>
              <p>
                Используя Сайт, вы соглашаетесь с условиями настоящей Политики конфиденциальности.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Собираемые данные</h2>
              <p>При использовании Сайта мы можем собирать следующую информацию:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Имя и контактные данные (телефон, email) при отправке заявок</li>
                <li>Технические данные (IP-адрес, тип браузера, операционная система)</li>
                <li>Данные о посещении страниц Сайта</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Цели обработки данных</h2>
              <p>Персональные данные обрабатываются в следующих целях:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Обработка заявок и обращений пользователей</li>
                <li>Связь с пользователями по вопросам продукции и услуг</li>
                <li>Улучшение работы Сайта</li>
                <li>Соблюдение требований законодательства</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Защита данных</h2>
              <p>
                Мы применяем технические и организационные меры для защиты персональных данных от 
                несанкционированного доступа, изменения, раскрытия или уничтожения.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Права пользователей</h2>
              <p>Вы имеете право:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Получать информацию о ваших персональных данных</li>
                <li>Требовать исправления неточных данных</li>
                <li>Требовать удаления ваших данных</li>
                <li>Отозвать согласие на обработку данных</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Контакты</h2>
              <p>
                По вопросам обработки персональных данных обращайтесь:
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

