export type CustomerTier = "silver" | "gold" | "partner"

export type DemoCustomer = {
  id: string
  company: string
  contact: string
  tier: CustomerTier
  initials: string
  nextDelivery: string
  activeOrders: number
}

export const CUSTOMER_TIER_META: Record<CustomerTier, {
  label: string
  short: string
  description: string
  accent: string
  soft: string
  analytics: string[]
}> = {
  silver: {
    label: "Серебряный",
    short: "Silver",
    description: "Заказы, документы и контроль отгрузок",
    accent: "#64748b",
    soft: "#f1f5f9",
    analytics: ["Краткий обзор закупок", "Статусы и сроки поставок"],
  },
  gold: {
    label: "Золотой",
    short: "Gold",
    description: "Расширенная аналитика и планирование на 30 дней",
    accent: "#b7791f",
    soft: "#fff8e7",
    analytics: ["Динамика цен", "Индекс спроса", "Планирование на 30 дней"],
  },
  partner: {
    label: "Партнёр",
    short: "Partner",
    description: "Полный рынок, прогнозы и приоритетный сервис",
    accent: "#2047a0",
    soft: "#edf3ff",
    analytics: ["Региональный бенчмарк", "Прогноз на 90 дней", "Приоритетные окна отгрузки", "Персональные рекомендации"],
  },
}

export const DEMO_CUSTOMERS: DemoCustomer[] = [
  {
    id: "silver",
    company: "ООО «СтройПолимер»",
    contact: "Анна Крылова",
    tier: "silver",
    initials: "СК",
    nextDelivery: "26 августа",
    activeOrders: 1,
  },
  {
    id: "gold",
    company: "АО «ТехноПак»",
    contact: "Илья Воронов",
    tier: "gold",
    initials: "ТП",
    nextDelivery: "22 августа",
    activeOrders: 3,
  },
  {
    id: "partner",
    company: "ГК «ПромКомпонент»",
    contact: "Елена Морозова",
    tier: "partner",
    initials: "ПК",
    nextDelivery: "20 августа",
    activeOrders: 5,
  },
]
