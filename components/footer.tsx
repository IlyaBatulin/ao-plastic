import Link from "next/link"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">П</span>
              </div>
              <span className="font-semibold text-lg">АО «Пластик»</span>
            </div>
            <p className="text-background/70 leading-relaxed max-w-md">
              Лидер химической индустрии по производству АБС-пластиков и полистиролов. Качество, надёжность, инновации с
              1959 года.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Навигация</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#about" className="text-background/70 hover:text-background transition-colors">
                  О компании
                </Link>
              </li>
              <li>
                <Link href="#products" className="text-background/70 hover:text-background transition-colors">
                  Продукция
                </Link>
              </li>
              <li>
                <Link href="#technologies" className="text-background/70 hover:text-background transition-colors">
                  Технологии
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-background/70 hover:text-background transition-colors">
                  Контакты
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Контакты</h3>
            <ul className="space-y-2 text-background/70">
              <li>+7 (495) 201-03-33</li>
              <li>info@oaplastic.ru</li>
              <li className="text-sm">
                301600, г. Узловая, Тульская обл.
                <br />
                ул. Тульская, д. 1
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/70 text-sm">© {currentYear} АО «Пластик». Все права защищены.</p>
          <div className="flex gap-6 text-sm text-background/70">
            <Link href="/legal/privacy-policy" className="hover:text-background transition-colors">
              Политика конфиденциальности
            </Link>
            <Link href="/legal/terms" className="hover:text-background transition-colors">
              Пользовательское соглашение
            </Link>
            <Link href="/legal/company-details" className="hover:text-background transition-colors">
              Реквизиты
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
