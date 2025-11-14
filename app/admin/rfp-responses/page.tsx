import { redirect } from "next/navigation"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import { RfpResponsesAdmin } from "./rfp-responses-admin-client"

export default async function RfpResponsesAdminPage() {
  const isAuthenticated = await isAdminAuthenticated()

  if (!isAuthenticated) {
    redirect("/admin")
  }

  return <RfpResponsesAdmin />
}

