/** Контакты отдела продаж по направлениям (страница «Контакты» и др.) */
export type SalesDirectionKey =
  | "abs"
  | "polystyrene"
  | "machineParts"
  | "cors"
  | "liquidation"
  | "consumerGoods"

export type SalesDirectionContact = {
  key: SalesDirectionKey
  phone: string
  email: string
}

export const SALES_DIRECTION_CONTACTS: SalesDirectionContact[] = [
  {
    key: "abs",
    phone: "+7 (495) 201-03-33 доб.220, +7 (487) 312-48-31",
    email: "info@td-plastic.ru",
  },
  {
    key: "polystyrene",
    phone: "+7 (495) 201-03-33 доб.201, +7 (487) 312-49-48",
    email: "info@td-plastic.ru",
  },
  {
    key: "machineParts",
    phone: "+7 (487) 412-43-06; +7 (495) 201-03-33 доб.206",
    email: "info@td-plastic.ru",
  },
  {
    key: "cors",
    phone: "+7 (487) 312-48-32",
    email: "info@td-plastic.ru",
  },
  {
    key: "liquidation",
    phone: "+7 (487) 312-48-32",
    email: "info@td-plastic.ru",
  },
  {
    key: "consumerGoods",
    phone: "+7 (495) 201-03-33 доб.119",
    email: "info@td-plastic.ru",
  },
]
