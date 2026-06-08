import { TEK_SNAB_CONTACTS } from "@/lib/tek-snab-contacts"

/** Актуальные реквизиты АО «Пластик» для сайта и юридических документов. */
export const COMPANY_REQUISITES = {
  fullName: 'Акционерное общество «Пластик»',
  shortName: 'АО «Пластик»',
  ogrn: "1027100507059",
  inn: "7117000076",
  kpp: "711701001",
  okpo: "05762341",
  legalAddress:
    "301600, Тульская обл., Узловский р-н, г. Узловая, ул. Тульская, д. 1",
  actualAddress: "301600, Тульская обл., г. Узловая, ул. Тульская, д. 1",
  moscowPostalCode: "115035",
  moscowAddress:
    "115035, г. Москва, 3-й Кадышевский переулок, д. 7-9, стр. 1",
  tekSnabAddress: TEK_SNAB_CONTACTS.addressRu,
  phone: "+7 (495) 201-03-33",
  email: "info@oaplastic.ru",
  salesEmail: "info@td-plastic.ru",
  website: "https://www.aoplastic.com",
} as const

export type RequisitesField = {
  label: string
  value: string
  href?: string
}

export const COMPANY_REQUISITES_FIELDS: RequisitesField[] = [
  { label: "Полное наименование", value: COMPANY_REQUISITES.fullName },
  { label: "Сокращённое наименование", value: COMPANY_REQUISITES.shortName },
  { label: "ОГРН", value: COMPANY_REQUISITES.ogrn },
  { label: "ИНН", value: COMPANY_REQUISITES.inn },
  { label: "КПП", value: COMPANY_REQUISITES.kpp },
  { label: "ОКПО", value: COMPANY_REQUISITES.okpo },
  { label: "Юридический адрес", value: COMPANY_REQUISITES.legalAddress },
  { label: "Фактический адрес (завод)", value: COMPANY_REQUISITES.actualAddress },
  { label: "Офис в Москве", value: COMPANY_REQUISITES.moscowAddress },
  {
    label: "Телефон",
    value: COMPANY_REQUISITES.phone,
    href: `tel:${COMPANY_REQUISITES.phone.replace(/\D/g, "")}`,
  },
  {
    label: "E-mail",
    value: COMPANY_REQUISITES.email,
    href: `mailto:${COMPANY_REQUISITES.email}`,
  },
  {
    label: "E-mail (заказы продукции)",
    value: COMPANY_REQUISITES.salesEmail,
    href: `mailto:${COMPANY_REQUISITES.salesEmail}`,
  },
  { label: "Сайт", value: COMPANY_REQUISITES.website, href: COMPANY_REQUISITES.website },
]

export function formatCompanyRequisitesParagraph(): string {
  const r = COMPANY_REQUISITES
  return `${r.shortName}. ОГРН ${r.ogrn}, ИНН ${r.inn}, КПП ${r.kpp}, ОКПО ${r.okpo}. Юридический адрес: ${r.legalAddress}. Тел.: ${r.phone}, e-mail: ${r.email}, сайт: ${r.website}.`
}

/** Текст для копирования карточки реквизитов в буфер обмена. */
export function formatCompanyRequisitesForClipboard(): string {
  const lines = COMPANY_REQUISITES_FIELDS.map((field) => `${field.label}: ${field.value}`)
  return [`Реквизиты ${COMPANY_REQUISITES.shortName}`, "", ...lines].join("\n")
}
