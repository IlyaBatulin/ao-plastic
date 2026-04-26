import type { ReactNode } from "react"
import { AboutLenisSync } from "./about-lenis-sync"

export default function AboutLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AboutLenisSync />
      {children}
    </>
  )
}
