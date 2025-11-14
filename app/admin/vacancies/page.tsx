import { redirect } from "next/navigation"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import { VacanciesAdmin } from "./vacancies-admin-client"

export default async function VacanciesAdminPage() {
  const isAuthenticated = await isAdminAuthenticated()

  if (!isAuthenticated) {
    redirect("/admin")
  }

  return <VacanciesAdmin />
}

