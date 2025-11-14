"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { usePathname } from "next/navigation"
import { AnimatePresence } from "framer-motion"
import { useTranslation } from "@/lib/i18n"
import { MegaMenu } from "./mega-menu"
import menuData from "@/data/menu.json"

export function MainMenu() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pathname = usePathname()
  const { lang } = useTranslation()
  
  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setActiveDropdown(label)
  }
  
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null)
    }, 200)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <nav className="hidden lg:flex flex-1 min-w-0 items-center justify-center gap-0.5 xl:gap-1">
      {menuData.map((item) => {
        const label = lang === "en" && item.labelEn ? item.labelEn : item.label
        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))

        return (
          <div
            key={item.label}
            className="relative"
            onMouseEnter={() => (item.submenu || item.type === "catalog") && handleMouseEnter(item.label)}
            onMouseLeave={handleMouseLeave}
          >
            {item.type === "catalog" ? (
              <>
                <button
                  className={`whitespace-nowrap text-[13px] xl:text-sm font-medium px-2 xl:px-3 py-2 rounded-lg transition-all duration-200 hover:bg-primary/10 hover:text-primary flex items-center gap-1 ${
                    isActive ? "text-primary bg-primary/5" : "text-foreground"
                  }`}
                >
                  {label}
                  <ChevronDown
                    className={`w-3 h-3 transition-transform duration-200 ${activeDropdown === item.label ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {activeDropdown === item.label && (
                    <div 
                      onMouseEnter={() => handleMouseEnter(item.label)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <MegaMenu />
                    </div>
                  )}
                </AnimatePresence>
              </>
            ) : item.submenu ? (
              <>
                <button
                  className={`whitespace-nowrap text-[13px] xl:text-sm font-medium px-2 xl:px-3 py-2 rounded-lg transition-all duration-200 hover:bg-primary/10 hover:text-primary flex items-center gap-1 ${
                    isActive ? "text-primary bg-primary/5" : "text-foreground"
                  }`}
                >
                  {label}
                  <ChevronDown
                    className={`w-3 h-3 transition-transform duration-200 ${activeDropdown === item.label ? "rotate-180" : ""}`}
                  />
                </button>
                {activeDropdown === item.label && (
                  <div 
                    className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-100 rounded-xl shadow-xl py-2 animate-in fade-in slide-in-from-top-4 duration-200"
                    onMouseEnter={() => handleMouseEnter(item.label)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {item.submenu.map((subItem) => {
                      const subLabel = lang === "en" && subItem.labelEn ? subItem.labelEn : subItem.label
                      return (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className="block px-4 py-2.5 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-150 border-l-2 border-transparent hover:border-primary"
                        >
                          {subLabel}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </>
            ) : (
              <Link
                href={item.href}
                className={`whitespace-nowrap text-[13px] xl:text-sm font-medium px-2 xl:px-3 py-2 rounded-lg transition-all duration-200 hover:bg-primary/10 hover:text-primary ${
                  isActive ? "text-primary bg-primary/5" : "text-foreground"
                }`}
              >
                {label}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}
