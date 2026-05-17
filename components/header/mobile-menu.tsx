"use client"
import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/contexts/language-context"
import { Sheet, SheetContent, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import corporateMenuData from "@/data/menu-corporate.json"
import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"
import { useTranslation } from "@/lib/i18n"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { cn } from "@/lib/utils"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

interface Category {
  id: string
  name: string
  slug: string
}

// Кастомный AccordionTrigger с + и -
function CustomAccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          'flex flex-1 items-center justify-between gap-4 rounded-md py-3 text-left text-base font-semibold transition-all outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none',
          className,
        )}
        {...props}
      >
        {children}
        <span className="text-2xl font-bold text-foreground transition-all duration-200 data-[state=open]:hidden">
          +
        </span>
        <span className="text-2xl font-bold text-foreground transition-all duration-200 hidden data-[state=open]:block">
          −
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

// Кастомный AccordionTrigger для вложенных секций
function NestedAccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          'flex flex-1 items-center justify-between gap-4 rounded-md py-2 text-left text-sm font-medium transition-all outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none',
          className,
        )}
        {...props}
      >
        {children}
        <span className="text-xl font-bold text-muted-foreground transition-all duration-200 data-[state=open]:hidden">
          +
        </span>
        <span className="text-xl font-bold text-muted-foreground transition-all duration-200 hidden data-[state=open]:block">
          −
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { lang, setLang, t } = useLanguage()
  const { lang: i18nLang } = useTranslation()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const supabase = createClient()
        
        // Проверяем наличие конфигурации Supabase
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          // Используем fallback данные
          setCategories([])
          setLoading(false)
          return
        }

        const { data: categoriesData, error } = await supabase
          .from("categories")
          .select("id, name, slug")
          .eq("is_active", true)
          .order("sort", { ascending: true })

        if (error) {
          console.error("Error loading categories:", error)
          setCategories([])
        } else if (categoriesData) {
          setCategories(categoriesData)
        }
      } catch (error) {
        console.error("Error loading categories:", error)
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    if (isOpen) {
      loadCategories()
    }
  }, [isOpen])

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="right" 
        className="!w-[90%] !max-w-[90%] p-0 flex flex-col !border-0 !z-[120] overflow-hidden h-full bg-[#faf9f7]"
      >
        <SheetTitle className="sr-only">Меню</SheetTitle>
        
        {/* Header с логотипом и кнопкой закрытия */}
        <div className="flex items-center justify-between px-4 lg:px-6 py-4 border-b border-gray-200/50 bg-[#faf9f7] sticky top-0 z-[121]">
          <Link href="/" onClick={onClose} className="flex items-center gap-3">
            <div className="relative w-12 h-12 flex-shrink-0 bg-transparent">
              <Image 
                src="/images/logo123.png" 
                alt="АО Пластик" 
                fill 
                className="object-contain" 
                priority 
              />
            </div>
            <span className="font-bold text-lg text-foreground">АО Пластик</span>
          </Link>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100/50 transition-colors"
            aria-label="Закрыть меню"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Content */}
        <nav className="flex-1 overflow-y-auto pb-4">
          <div className="px-4 lg:px-6 pt-4 space-y-1">
            {corporateMenuData.map((item) => {
              const label = (i18nLang === "en" && item.labelEn ? item.labelEn : item.label) || item.label

              // Каталог продукции
              if (item.type === "catalog") {
                return (
                  <Accordion key={item.label} type="single" collapsible className="w-full">
                    <AccordionItem value="products" className="border-none">
                      <CustomAccordionTrigger className="px-0">
                        {label}
                      </CustomAccordionTrigger>
                      <AccordionContent className="px-0 pb-2">
                        <div className="space-y-1 pl-4">
                          {loading ? (
                            <div className="text-sm text-muted-foreground py-2">Загрузка...</div>
                          ) : categories.length > 0 ? (
                            categories.map((category) => (
                              <Link
                                key={category.id}
                                href={`/products/${category.slug}`}
                                onClick={onClose}
                                className="block text-sm text-muted-foreground hover:text-primary py-2 px-4 transition-colors rounded-lg hover:bg-gray-100/50"
                              >
                                {category.name}
                              </Link>
                            ))
                          ) : (
                            <div className="text-sm text-muted-foreground py-2 px-4">
                              Категории загружаются...
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )
              }

              // Mega-menu с секциями - вложенный аккордеон
              if (item.type === "mega" && item.sections) {
                return (
                  <Accordion key={item.label} type="single" collapsible className="w-full">
                    <AccordionItem value={item.label} className="border-none">
                      <CustomAccordionTrigger className="px-0">
                        {label}
                      </CustomAccordionTrigger>
                      <AccordionContent className="px-0 pb-2">
                        <div className="space-y-1 pl-4">
                          {/* Вложенный аккордеон для секций */}
                          <Accordion type="single" collapsible className="w-full">
                            {item.sections.map((section, sectionIndex) => {
                              const sectionTitle = (i18nLang === "en" && section.titleEn ? section.titleEn : section.title) || section.title
                              const sectionValue = `${item.label}-section-${sectionIndex}`
                              
                              return (
                                <AccordionItem key={sectionValue} value={sectionValue} className="border-none">
                                  <NestedAccordionTrigger className="px-0 py-2">
                                    <span className="text-sm font-medium text-foreground">{sectionTitle}</span>
                                  </NestedAccordionTrigger>
                                  <AccordionContent className="px-0 pb-2">
                                    <div className="space-y-1 pl-4">
                                      {section.items.map((subItem, subItemIndex) => {
                                        const subLabel = (i18nLang === "en" && subItem.labelEn ? subItem.labelEn : subItem.label) || subItem.label
                                        const uniqueKey = `${item.label}-${sectionIndex}-${subItemIndex}-${subItem.href}`
                                        return (
                                          <Link
                                            key={uniqueKey}
                                            href={subItem.href}
                                            onClick={onClose}
                                            className="block text-sm text-muted-foreground hover:text-primary py-2 px-4 transition-colors rounded-lg hover:bg-gray-100/50"
                                          >
                                            {subLabel}
                                          </Link>
                                        )
                                      })}
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              )
                            })}
                          </Accordion>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )
              }

              // Простые ссылки
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className="block text-base font-semibold py-3 transition-colors hover:text-primary rounded-lg px-0 text-foreground"
                >
                  {label}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Footer */}
        <SheetFooter className="border-t border-gray-200/50 bg-[#faf9f7] px-4 lg:px-6 py-4 sticky bottom-0 z-[121]">
          <div className="w-full space-y-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setLang(lang === "ru" ? "en" : "ru")} 
              className="w-full"
            >
              {lang === "ru" ? "English" : "Русский"}
            </Button>
            <Button asChild className="w-full bg-slate-700 hover:bg-slate-800 text-white transition-colors duration-200 shadow-sm">
              <Link href="/contacts" onClick={onClose}>
                {t("contactUs") || "Связаться с нами"}
              </Link>
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
