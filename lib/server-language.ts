import "server-only"
import { cookies } from "next/headers"
import { LANG_COOKIE, parseLanguage } from "@/lib/language"

export async function getServerLanguage() {
  return parseLanguage((await cookies()).get(LANG_COOKIE)?.value)
}
