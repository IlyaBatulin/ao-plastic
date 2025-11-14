declare global {
  interface Window {
    gsap: typeof import("gsap").gsap
    ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger
  }
}

declare const gsap: typeof import("gsap").gsap
declare const ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger

export {}
