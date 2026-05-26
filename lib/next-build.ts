/** true во время `next build` — без сетевых запросов к Supabase на этапе SSG. */
export function isNextBuild(): boolean {
  return (
    process.env.npm_lifecycle_event === "build" ||
    process.env.NEXT_PHASE === "phase-production-build"
  )
}
