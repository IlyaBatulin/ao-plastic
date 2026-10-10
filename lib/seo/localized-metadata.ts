import type { Metadata } from "next"
import { getServerLanguage } from "@/lib/server-language"

const pages: Record<string, [string, string]> = {
  "/": ["JSC Plastic — ABS, polystyrene and plastic products", "Polymer materials and plastic products manufactured in Uzlovaya, Russia, since 1959. Explore our products, production facilities and supply options."],
  "/about": ["About us", "Learn about JSC Plastic, our polymer production facilities, history and quality management."],
  "/about/mission": ["Our mission and history", "The history of JSC Plastic in Uzlovaya, our mission and the development of our production facilities."],
  "/about/ethics": ["Corporate Code of Ethics", "JSC Plastic's Corporate Code of Ethics and anti-corruption policy."],
  "/about/safety": ["Health, Safety & Environment", "Occupational health, industrial safety and environmental protection at JSC Plastic. Policies and supporting documents."],
  "/about/quality": ["Quality management", "Quality management, laboratory testing and product quality control at JSC Plastic."],
  "/about/vacancies": ["Careers", "Explore current vacancies and career opportunities at JSC Plastic in Uzlovaya."],
  "/about/college": ["Vocational education", "JSC Plastic's partnership with Uzlovaya Polytechnic College and the Professionalitet vocational education programme."],
  "/about/news": ["News", "Company news, production updates and events at JSC Plastic."],
  "/about/disclosure": ["Information disclosure", "JSC Plastic's disclosures and documents relating to regulated activities."],
  "/about/publications": ["Media publications", "Articles, interviews and media coverage about JSC Plastic and the polymer industry."],
  "/certificates": ["Certificates and standards", "Quality certificates and standards relating to JSC Plastic's products and management systems."],
  "/contacts": ["Contact us", "Contact JSC Plastic for product sales, procurement, industrial premises and other enquiries."],
  "/dealers": ["Dealers and distributors", "Find JSC Plastic's dealers and distribution partners."],
  "/finndisp": ["FINNDISP", "Acrylic and styrene-acrylic dispersions for coatings, nonwovens and adhesives. FINNDISP production and product applications."],
  "/pasf": ["Emergency response and rescue service", "PASF Plastic: emergency rescue, gas rescue and fire safety services for industrial facilities."],
  "/technopark": ["Industrial park", "JSC Plastic industrial park in Uzlovaya: industrial and warehouse premises, utilities and infrastructure."],
  "/legal/privacy-policy": ["Privacy Policy", "JSC Plastic's policy on personal data processing and privacy."],
  "/legal/terms": ["Website Terms of Use", "Terms governing access to and use of the JSC Plastic website."],
  "/legal/personal-data-consent": ["Consent to personal data processing", "Information about consent to the processing of personal data submitted through the JSC Plastic website."],
  "/legal/company-details": ["Company details", "JSC Plastic company identification and contact details."],
  "/products": ["Product catalogue", "Explore styrene, ABS plastics, polystyrene, dispersions, engineered plastic parts and consumer products from JSC Plastic."],
  "/suppliers": ["Procurement and suppliers", "Procurement information and supplier enquiries for JSC Plastic."],
  "/technologies": ["Production technologies", "Polymerisation, extrusion and quality control at JSC Plastic."],
}

export async function localizePageMetadata(original: Metadata, path: string): Promise<Metadata> {
  if (await getServerLanguage() !== "en") return original
  const copy = pages[path]
  if (!copy) return original
  const [title, description] = copy
  return {
    ...original, title: path === "/" ? { default: title, template: "%s | JSC Plastic" } : title,
    description, keywords: ["JSC Plastic", "ABS", "polystyrene", "styrene", "polymer dispersions", "Uzlovaya"],
    openGraph: { ...original.openGraph, title, description, siteName: "JSC Plastic", locale: "en_GB", images: [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: "JSC Plastic plant in Uzlovaya" }] },
    twitter: { ...original.twitter, title, description },
  }
}
