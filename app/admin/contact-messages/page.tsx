import { redirect } from "next/navigation"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import { ContactMessagesAdmin } from "./contact-messages-admin-client"

export default async function ContactMessagesAdminPage() {
  const isAuthenticated = await isAdminAuthenticated()

  if (!isAuthenticated) {
    redirect("/admin")
  }

  return <ContactMessagesAdmin />
}

