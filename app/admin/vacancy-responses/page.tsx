import { redirect } from "next/navigation"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import { VacancyResponsesAdmin } from "./vacancy-responses-admin-client"

export default async function VacancyResponsesAdminPage() {
  const isAuthenticated = await isAdminAuthenticated()

  if (!isAuthenticated) {
    redirect("/admin")
  }

  return <VacancyResponsesAdmin />
}

