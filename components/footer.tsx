"use client"

import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/contexts/language-context"

export function Footer() {
  const { t } = useLanguage()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="mb-5">
              <div className="relative h-16 w-16 shrink-0 lg:h-20 lg:w-20">
                <Image
                  src="/images/logo123.png"
                  alt={t("footer.logoAlt")}
                  fill
                  className="object-contain brightness-0 invert"
                  sizes="(max-width: 1024px) 64px, 80px"
                />
              </div>
            </div>
            <p className="text-background/70 leading-relaxed max-w-md">{t("footer.description")}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t("footer.navigation")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-background/70 hover:text-background transition-colors">
                  {t("footer.aboutLink")}
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-background/70 hover:text-background transition-colors">
                  {t("footer.productsLink")}
                </Link>
              </li>
              <li>
                <Link href="/contacts" className="text-background/70 hover:text-background transition-colors">
                  {t("footer.contactsLink")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t("footer.contactsHeading")}</h3>
            <ul className="space-y-2 text-background/70">
              <li>+7 (495) 201-03-33</li>
              <li>info@oaplastic.ru</li>
              <li className="text-sm">
                {t("footer.addressLine1")}
                <br />
                {t("footer.addressLine2")}
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/70 text-sm">
            © {currentYear} {t("footer.logoAlt")}. {t("footer.copyright")}
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-background/70">
            <Link href="/legal/privacy-policy" className="hover:text-background transition-colors">
              {t("footer.privacyPolicy")}
            </Link>
            <Link href="/legal/terms" className="hover:text-background transition-colors">
              {t("footer.terms")}
            </Link>
            <Link href="/legal/company-details" className="hover:text-background transition-colors">
              {t("footer.companyDetails")}
            </Link>
            <Link href="/about/ethics" className="hover:text-background transition-colors">
              {t("footer.ethicsCode")}
            </Link>
            <a
              href="https://oaoplastic.ru/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-background transition-colors"
            >
              {t("footer.legacySite")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
