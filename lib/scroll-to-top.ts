import { getLenisInstance } from "@/lib/lenis-instance"

export function scrollPageToTop() {
  if (typeof window === "undefined") return

  const lenis = getLenisInstance()
  if (lenis) {
    lenis.scrollTo(0, { immediate: true })
  }

  window.scrollTo(0, 0)
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
}
