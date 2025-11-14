"use client"

import { usePathname } from "next/navigation"
import { Header } from "@/components/header/header"

export function ConditionalHeader() {
  const pathname = usePathname()
  
  // Не показываем Header на странице входа
  if (pathname === "/login") {
    return null
  }

  return <Header />
}

