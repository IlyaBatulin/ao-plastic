import { redirect } from "next/navigation"
import { getAdminRole } from "@/lib/admin-auth"
import { getAdminPath } from "@/lib/admin-config"
import { AdminDashboard } from "./admin-dashboard-client"

export default async function AdminDashboardPage() {
  const role = await getAdminRole()

  if (!role) {
    redirect(getAdminPath())
  }

  return <AdminDashboard role={role} />
}
