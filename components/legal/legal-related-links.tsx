"use client"

import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { LEGAL_DOCUMENTS } from "@/lib/legal-documents"

type LegalRelatedLinksProps = {
  current: "terms" | "privacy" | "consent"
}

export function LegalRelatedLinks({ current }: LegalRelatedLinksProps) {
  const { lang } = useLanguage()
  const en = lang === "en"

  const links = [
    current !== "privacy" && {
      href: LEGAL_DOCUMENTS.privacyPolicyPage,
      label: en ? "privacy policy" : "политика конфиденциальности",
    },
    current !== "terms" && {
      href: LEGAL_DOCUMENTS.termsPage,
      label: en ? "public offer agreement" : "пользовательское соглашение",
    },
    current !== "consent" && {
      href: LEGAL_DOCUMENTS.personalDataConsentPage,
      label: en
        ? "consent to personal data processing"
        : "согласие на обработку персональных данных",
    },
  ].filter(Boolean) as Array<{ href: string; label: string }>

  return (
    <p className="mt-8 text-sm text-muted-foreground">
      {en ? "Related documents: " : current === "consent" ? "См. также: " : "Связанные документы: "}
      {links.map((link, index) => (
        <span key={link.href}>
          {index > 0 && ", "}
          <Link href={link.href} className="text-primary hover:underline">
            {link.label}
          </Link>
        </span>
      ))}
      .
    </p>
  )
}
