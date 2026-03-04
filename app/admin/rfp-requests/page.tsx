import { redirect } from "next/navigation"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import { getAdminPath } from "@/lib/admin-config"
import { RfpRequestsAdmin } from "./rfp-requests-admin-client"

export default async function RfpRequestsAdminPage() {
  const isAuthenticated = await isAdminAuthenticated()

  if (!isAuthenticated) {
    redirect(getAdminPath())
  }

  return <RfpRequestsAdmin />
}

