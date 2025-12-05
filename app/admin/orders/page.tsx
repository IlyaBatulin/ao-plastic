import { redirect } from "next/navigation"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import { OrdersAdmin } from "./orders-admin-client"

export default async function OrdersAdminPage() {
  const isAuthenticated = await isAdminAuthenticated()

  if (!isAuthenticated) {
    redirect("/admin")
  }

  return <OrdersAdmin />
}

