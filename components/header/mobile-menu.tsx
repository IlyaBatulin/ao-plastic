"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { Sheet, SheetContent, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import menuData from "@/data/menu.json"
import productsData from "@/data/products.json"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname()
  const { lang, setLang, t } = useLanguage()

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="left" 
        className="!w-full !max-w-full sm:!max-w-full p-0 flex flex-col !border-0 inset-0"
      >
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <nav className="flex flex-col gap-4 mt-8 flex-1 overflow-y-auto pb-4 px-6">
          {menuData.map((item) => {
            const label = lang === "en" && item.labelEn ? item.labelEn : item.label
            const isActive = pathname === item.href

            if (item.type === "catalog") {
              return (
                <Accordion key={item.label} type="single" collapsible>
                  <AccordionItem value="products" className="border-none">
                    <AccordionTrigger className="text-sm font-medium hover:text-primary py-2 hover:no-underline">
                      {label}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pl-4 space-y-2">
                        {productsData.categories
                          .filter((category) => category.id !== 'dispersion')
                          .map((category) => {
                          const categoryName = t(`homePage.catalog.categories.${category.id}`) || category.name
                          return (
                            <Link
                              key={category.id}
                              href={`/products/${category.id}`}
                              onClick={onClose}
                              className="block text-sm text-muted-foreground hover:text-primary py-1.5 transition-colors"
                            >
                              {categoryName}
                            </Link>
                          )
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )
            }

            if (item.submenu) {
              return (
                <Accordion key={item.label} type="single" collapsible>
                  <AccordionItem value={item.label} className="border-none">
                    <AccordionTrigger className="text-sm font-medium hover:text-primary py-2 hover:no-underline">
                      {label}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pl-4 space-y-2">
                        {item.submenu.map((subItem) => {
                          const subLabel = lang === "en" && subItem.labelEn ? subItem.labelEn : subItem.label
                          return (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              onClick={onClose}
                              className="block text-sm text-muted-foreground hover:text-primary py-1.5 transition-colors"
                            >
                              {subLabel}
                            </Link>
                          )
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className={`text-sm font-medium py-2 transition-colors hover:text-primary ${
                  isActive ? "text-primary" : "text-foreground"
                }`}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        <SheetFooter className="border-t bg-background px-6 pb-6">
          <div className="w-full space-y-3">
            <Button variant="outline" size="sm" onClick={() => setLang(lang === "ru" ? "en" : "ru")} className="w-full">
              {lang === "ru" ? "English" : "Русский"}
            </Button>
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
              <Link href="/contacts" onClick={onClose}>
                {t("contactUs")}
              </Link>
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
