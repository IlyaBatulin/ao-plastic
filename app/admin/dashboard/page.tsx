import { redirect } from "next/navigation"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import { getAdminPath } from "@/lib/admin-config"
import { AdminDashboard } from "./admin-dashboard-client"

export default async function AdminDashboardPage() {
  const isAuthenticated = await isAdminAuthenticated()

  if (!isAuthenticated) {
    redirect(getAdminPath())
  }

  return <AdminDashboard />
}

