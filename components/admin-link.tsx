"use client"

import Link from "next/link"
import { useAdminPath } from "@/hooks/use-admin-path"

interface AdminLinkProps extends React.ComponentProps<typeof Link> {
  href: string
}

/**
 * Ссылка внутри админ-панели. Путь берётся из URL, не из кода.
 */
export function AdminLink({ href, ...props }: AdminLinkProps) {
  const adminPath = useAdminPath()
  const fullHref = href.startsWith("/admin") ? href.replace("/admin", adminPath) : `${adminPath}${href}`
  return <Link href={fullHref} {...props} />
}
