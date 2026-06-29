import { redirect } from "next/navigation"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import { getAdminPath } from "@/lib/admin-config"
import { ManagersAdmin } from "./managers-admin-client"

export default async function ManagersAdminPage() {
  const isAuthenticated = await isAdminAuthenticated()

  if (!isAuthenticated) {
    redirect(getAdminPath())
  }

  return <ManagersAdmin />
}
