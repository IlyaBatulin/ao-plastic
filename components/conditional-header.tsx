"use client"

import { usePathname } from "next/navigation"
import { Header } from "@/components/header/header"

export function ConditionalHeader() {
  const pathname = usePathname()
  
  // В кабинете используется собственная компактная навигация.
  if (pathname === "/login" || pathname === "/account") {
    return null
  }

  return <Header />
}

