"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock3,
  FileCheck2,
  FileText,
  Headphones,
  LineChart,
  LogOut,
  Package,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Truck,
  UserCog,
  UsersRound,
  X,
} from "lucide-react"
import productsData from "@/data/products.json"
import { createClient } from "@/utils/supabase/client"
import {
  CUSTOMER_TIER_META,
  DEMO_CUSTOMERS,
  type CustomerTier,
  type DemoCustomer,
} from "@/lib/customer-access"
import "./account-portal.css"

type OrderItem = { id: number; quantity: number; price?: number | null; products?: { name?: string } | null; category_id?: string }
type Order = { id: number; created_at: string; comment?: string; items: OrderItem[] }
type Reservation = { id: number; product_name: string; quantity: number; unit: string; requested_delivery_date: string; status: string }
type AccountData = {
  demoMode?: boolean
  profile: Record<string, any>
  manager: { name: string; email?: string; phone?: string } | null
  orders: Order[]
  reservations: Reservation[]
  reservationsAvailable: boolean
}
type CatalogItem = {
  id: string
  name: string
  categoryId: string
  categoryName: string
  image?: string
}

const money = (value: number) => new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
}).format(value)

function flattenCatalog(): CatalogItem[] {
  const result: CatalogItem[] = []
  for (const category of productsData.categories as any[]) {
    const add = (product: any) => result.push({
      id: String(product.id),
      name: String(product.name),
      categoryId: String(category.id),
      categoryName: String(category.name),
      image: product.image,
    })
    for (const product of category.products || []) add(product)
    for (const subcategory of category.subcategories || []) {
      for (const product of subcategory.products || []) add(product)
    }
  }
  return result
}

const catalog = flattenCatalog()
const suggestedProducts = [
  catalog.find((item) => item.categoryId === "abs"),
  catalog.find((item) => item.categoryId === "polystyrene"),
  catalog.find((item) => item.categoryId === "styrene"),
].filter(Boolean) as CatalogItem[]

export default function AccountPage() {
  const router = useRouter()
  const [data, setData] = useState<AccountData | null>(null)
  const [loading, setLoading] = useState(true)
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const [view, setView] = useState<string>("silver")
  const [customers, setCustomers] = useState<DemoCustomer[]>(DEMO_CUSTOMERS)

  useEffect(() => {
    const saved = window.localStorage.getItem("aoplastic-demo-tiers")
    if (saved) {
      try { setCustomers(JSON.parse(saved)) } catch { /* demo state can be reset safely */ }
    }
  }, [])

  useEffect(() => {
    async function load() {
      const response = await fetch("/api/customer/account", { cache: "no-store" })
      if (response.status === 401) {
        router.replace("/account/login")
        return
      }
      if (response.ok) setData(await response.json())
      setLoading(false)
    }
    void load()
  }, [router])

  async function logout() {
    await fetch("/api/customer/preview-auth", { method: "DELETE" })
    await createClient().auth.signOut()
    router.push("/")
    router.refresh()
  }

  function updateCustomerTier(id: string, tier: CustomerTier) {
    setCustomers((current) => {
      const updated = current.map((customer) => customer.id === id ? { ...customer, tier } : customer)
      window.localStorage.setItem("aoplastic-demo-tiers", JSON.stringify(updated))
      return updated
    })
  }

  if (loading) {
    return <main className="flex min-h-[70svh] items-center justify-center bg-[#f7f8fa]"><RefreshCw className="h-6 w-6 animate-spin text-[#22499b]" /></main>
  }
  if (!data) return null

  const realTier = (["silver", "gold", "partner"] as const).includes(data.profile.access_tier) ? data.profile.access_tier as CustomerTier : "silver"
  const realCustomer: DemoCustomer = {
    id: "current",
    company: data.profile.company_name || "Моя компания",
    contact: data.profile.contact_name || "Покупатель",
    initials: String(data.profile.company_name || data.profile.contact_name || "МК").split(/\s+/).slice(0, 2).map((part: string) => part[0]).join("").toUpperCase(),
    tier: realTier,
    nextDelivery: data.reservations[0]?.requested_delivery_date ? new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" }).format(new Date(`${data.reservations[0].requested_delivery_date}T12:00:00`)) : "По плану",
    activeOrders: data.orders.length,
  }
  const activeCustomer = data.demoMode ? customers.find((customer) => customer.id === view) || customers[0] : realCustomer
  const isManager = Boolean(data.demoMode && view === "manager")

  return (
    <main className={`portal-dark portal-${isManager ? "manager" : activeCustomer.tier} min-h-screen bg-[#f7f8fa] pb-16 text-[#172033]`}>
      <section className="portal-toolbar border-b border-[#e5e8ef] bg-white">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <img src="/images/logo123.png" alt="АО Пластик" className="h-8 w-auto brightness-0 invert sm:h-9" />
            <span className="hidden min-w-0 sm:block"><span className="block text-xs font-semibold uppercase tracking-[.12em] text-[#7b8496]">Личный кабинет</span><span className="mt-0.5 block truncate text-sm font-semibold text-[#1b2a49]">Клиентский сервис</span></span>
          </Link>
          <div className="relative flex items-center gap-2">
            <button
              type="button"
              onClick={() => data.demoMode && setAccountMenuOpen((open) => !open)}
              className="flex h-11 items-center gap-3 rounded-full border border-[#dfe3eb] bg-white pl-2 pr-3 text-left shadow-sm transition hover:border-[#bcc7dc]"
            >
              <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${isManager ? "bg-[#172d59] text-white" : "bg-[#eaf0fc] text-[#214792]"}`}>
                {isManager ? <UserCog className="h-4 w-4" /> : activeCustomer.initials}
              </span>
              <span className="hidden min-w-0 sm:block">
                <span className="block max-w-48 truncate text-xs font-semibold text-[#1d2940]">{isManager ? "Мария Орлова" : activeCustomer.company}</span>
                <span className="block text-[11px] text-[#7b8496]">{isManager ? "Менеджер по клиентам" : CUSTOMER_TIER_META[activeCustomer.tier].label}</span>
              </span>
              {data.demoMode && <ChevronDown className={`h-4 w-4 text-[#7b8496] transition ${accountMenuOpen ? "rotate-180" : ""}`} />}
            </button>
            <button type="button" onClick={logout} aria-label="Выйти" className="flex h-11 w-11 items-center justify-center rounded-full border border-[#dfe3eb] bg-white text-[#687286] transition hover:text-[#163b88]"><LogOut className="h-4 w-4" /></button>

            {data.demoMode && accountMenuOpen && (
              <div className="absolute right-12 top-14 z-50 w-[min(340px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-[#e0e4eb] bg-white p-2 shadow-[0_24px_70px_rgba(25,38,65,.16)] sm:right-0">
                <p className="px-3 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-[.12em] text-[#8b93a2]">Тестовые аккаунты</p>
                {customers.map((customer) => (
                  <button key={customer.id} type="button" onClick={() => { setView(customer.id); setAccountMenuOpen(false) }} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${view === customer.id ? "bg-[#eef3fc]" : "hover:bg-[#f6f7f9]"}`}>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e8edf6] text-xs font-bold text-[#29477e]">{customer.initials}</span>
                    <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{customer.company}</span><span className="block text-xs text-[#7f8795]">{CUSTOMER_TIER_META[customer.tier].label}</span></span>
                    {view === customer.id && <Check className="h-4 w-4 text-[#2350a5]" />}
                  </button>
                ))}
                <div className="my-2 border-t border-[#edf0f4]" />
                <button type="button" onClick={() => { setView("manager"); setAccountMenuOpen(false) }} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${isManager ? "bg-[#eef3fc]" : "hover:bg-[#f6f7f9]"}`}>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#172d59] text-white"><UserCog className="h-4 w-4" /></span>
                  <span className="flex-1"><span className="block text-sm font-semibold">Режим менеджера</span><span className="block text-xs text-[#7f8795]">Управление уровнями доступа</span></span>
                  {isManager && <Check className="h-4 w-4 text-[#2350a5]" />}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {isManager ? (
        <ManagerWorkspace customers={customers} onTierChange={updateCustomerTier} onOpenCustomer={setView} />
      ) : (
        <CustomerWorkspace data={data} customer={activeCustomer} />
      )}
    </main>
  )
}

function CustomerWorkspace({ data, customer }: { data: AccountData; customer: DemoCustomer }) {
  const [step, setStep] = useState(1)
  const [query, setQuery] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<CatalogItem | null>(null)
  const [quantity, setQuantity] = useState("10")
  const [date, setDate] = useState("2026-08-28")
  const [delivery, setDelivery] = useState<"delivery" | "pickup">("delivery")
  const [address, setAddress] = useState("г. Москва, ул. Промышленная, 12")
  const [documents, setDocuments] = useState({ requisites: true, contract: true, edo: false })
  const [submitting, setSubmitting] = useState(false)
  const [completed, setCompleted] = useState(false)
  const tier = customer.tier
  const tierMeta = CUSTOMER_TIER_META[tier]

  useEffect(() => {
    setStep(1)
    setSelectedProduct(null)
    setCompleted(false)
  }, [customer.id])

  const results = useMemo(() => {
    const value = query.trim().toLowerCase()
    if (value.length < 2) return suggestedProducts
    return catalog.filter((item) => `${item.name} ${item.categoryName}`.toLowerCase().includes(value)).slice(0, 5)
  }, [query])

  const totalSpend = data.orders.reduce((sum, order) => sum + order.items.reduce((value, item) => value + (Number(item.price) || 0) * Number(item.quantity || 0), 0), 0)

  function chooseProduct(item: CatalogItem) {
    setSelectedProduct(item)
    setQuery("")
  }

  function nextStep() {
    if (step === 1 && !selectedProduct) return
    setStep((current) => Math.min(4, current + 1))
  }

  async function submitOrder(event: FormEvent) {
    event.preventDefault()
    if (!selectedProduct) return
    setSubmitting(true)
    await fetch("/api/customer/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productName: selectedProduct.name,
        quantity,
        unit: "т",
        requestedDeliveryDate: date,
        comment: `${delivery === "delivery" ? "Доставка" : "Самовывоз"}. ${address}`,
      }),
    })
    setSubmitting(false)
    setCompleted(true)
  }

  return (
    <div className="mx-auto max-w-[1320px] px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
      <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ color: tierMeta.accent, backgroundColor: tierMeta.soft }}>{tierMeta.label}</span>
            <span className="text-xs text-[#818999]">{tierMeta.description}</span>
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-.04em] text-[#17223a] sm:text-4xl">Здравствуйте, {customer.contact.split(" ")[0]}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#687286]">Здесь можно провести заказ от выбора продукта до отгрузки. На каждом шаге показано только то, что нужно сейчас.</p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-[#e2e6ed] bg-white px-4 py-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eef3fc] text-[#234a96]"><Headphones className="h-4 w-4" /></span>
          <span><span className="block text-[11px] text-[#818999]">Ваш менеджер</span><span className="block text-sm font-semibold">{data.manager?.name || "Отдел продаж"}</span></span>
          {data.manager?.phone && <a href={`tel:${data.manager.phone}`} className="ml-3 hidden text-xs font-semibold text-[#2450a2] sm:block">Позвонить</a>}
        </div>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
        <div className="overflow-hidden rounded-[28px] border border-[#e1e5ec] bg-white shadow-[0_20px_70px_rgba(25,38,66,.06)]">
          <OrderProgress step={step} />
          <div className="p-5 sm:p-8 lg:p-10">
            {completed ? (
              <OrderCompleted product={selectedProduct!} date={date} onReset={() => { setCompleted(false); setStep(1); setSelectedProduct(null) }} />
            ) : (
              <form onSubmit={submitOrder}>
                {step === 1 && <ProductStep query={query} setQuery={setQuery} results={results} selected={selectedProduct} onSelect={chooseProduct} onClear={() => setSelectedProduct(null)} />}
                {step === 2 && <DeliveryStep product={selectedProduct!} quantity={quantity} setQuantity={setQuantity} date={date} setDate={setDate} delivery={delivery} setDelivery={setDelivery} address={address} setAddress={setAddress} />}
                {step === 3 && <DocumentsStep documents={documents} setDocuments={setDocuments} />}
                {step === 4 && <ReviewStep product={selectedProduct!} quantity={quantity} date={date} delivery={delivery} address={address} />}

                <div className="mt-8 flex items-center justify-between border-t border-[#edf0f4] pt-6">
                  {step > 1 ? <button type="button" onClick={() => setStep((current) => current - 1)} className="inline-flex items-center gap-2 text-sm font-semibold text-[#657085]"><ArrowLeft className="h-4 w-4" />Назад</button> : <span />}
                  {step < 4 ? (
                    <button key="next-step" type="button" onClick={(event) => { event.preventDefault(); nextStep() }} disabled={step === 1 && !selectedProduct} className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#214a9a] px-6 text-sm font-semibold text-white transition hover:bg-[#193d84] disabled:cursor-not-allowed disabled:bg-[#cbd3e1]">Продолжить <ArrowRight className="h-4 w-4" /></button>
                  ) : (
                    <button key="submit-order" type="submit" disabled={submitting} className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#214a9a] px-6 text-sm font-semibold text-white transition hover:bg-[#193d84] disabled:opacity-60">{submitting ? "Отправляем…" : "Отправить заказ"}<ArrowRight className="h-4 w-4" /></button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>

        <aside className="space-y-4">
          <CurrentDelivery customer={customer} />
          <div className="rounded-[24px] border border-[#e1e5ec] bg-white p-5">
            <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eff4fd] text-[#2450a2]"><FileText className="h-4 w-4" /></span><div><p className="text-sm font-semibold">Документы</p><p className="text-xs text-[#818999]">Все сделки в одном месте</p></div></div>
            <div className="mt-4 space-y-2 text-sm"><StatusLine label="Договор поставки" done /><StatusLine label="Реквизиты компании" done /><StatusLine label="Подключение к ЭДО" done={documents.edo} /></div>
          </div>
        </aside>
      </section>

      <MarketInsights tier={tier} totalSpend={totalSpend} />
    </div>
  )
}

function OrderProgress({ step }: { step: number }) {
  const steps = [
    { label: "Продукт", icon: Package },
    { label: "Поставка", icon: Truck },
    { label: "Документы", icon: FileCheck2 },
    { label: "Проверка", icon: CheckCircle2 },
  ]
  return <div className="border-b border-[#edf0f4] bg-[#fbfcfd] px-5 py-5 sm:px-8"><div className="relative grid grid-cols-4"><div className="absolute left-[12.5%] right-[12.5%] top-4 h-px bg-[#dfe4ec]" /><div className="absolute left-[12.5%] top-4 h-px bg-[#2855a7] transition-all duration-500" style={{ width: `${Math.max(0, step - 1) * 25}%` }} />{steps.map((item, index) => { const position = index + 1; const active = position === step; const done = position < step; return <div key={item.label} className="relative z-10 flex flex-col items-center"><span className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold transition ${done ? "border-[#2855a7] bg-[#2855a7] text-white" : active ? "border-[#2855a7] bg-white text-[#2855a7] ring-4 ring-[#e9f0ff]" : "border-[#dfe4ec] bg-white text-[#9aa2b0]"}`}>{done ? <Check className="h-4 w-4" /> : position}</span><span className={`mt-2 text-[10px] font-semibold sm:text-xs ${active || done ? "text-[#244a94]" : "text-[#9aa2b0]"}`}>{item.label}</span></div> })}</div></div>
}

function ProductStep({ query, setQuery, results, selected, onSelect, onClear }: { query: string; setQuery: (value: string) => void; results: CatalogItem[]; selected: CatalogItem | null; onSelect: (item: CatalogItem) => void; onClear: () => void }) {
  return <div><p className="text-xs font-semibold uppercase tracking-[.12em] text-[#6f7b8f]">Шаг 1 из 4</p><h2 className="mt-2 text-2xl font-semibold tracking-[-.03em] sm:text-3xl">Что хотите заказать?</h2><p className="mt-2 text-sm text-[#737d8e]">Введите марку или выберите один из продуктов, которые заказывают чаще всего.</p>
    {selected ? <div className="mt-7 flex items-center gap-4 rounded-2xl border border-[#bfd0ee] bg-[#f3f7ff] p-4"><ProductIcon item={selected} /><div className="min-w-0 flex-1"><p className="truncate font-semibold text-[#1d2a42]">{selected.name}</p><p className="mt-1 text-xs text-[#71809a]">{selected.categoryName}</p></div><button type="button" onClick={onClear} aria-label="Изменить продукт" className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#657085]"><X className="h-4 w-4" /></button></div> : <><div className="relative mt-7"><Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8b95a7]" /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Например, АБС 2020 или УПЕКС" className="h-14 w-full rounded-2xl border border-[#dfe4ec] bg-[#fafbfc] pl-12 pr-4 text-sm outline-none transition focus:border-[#7d9bd1] focus:bg-white focus:ring-4 focus:ring-[#eaf1ff]" /></div><div className="mt-4 divide-y divide-[#edf0f4] rounded-2xl border border-[#e3e7ed]">{results.map((item) => <button key={`${item.categoryId}-${item.id}`} type="button" onClick={() => onSelect(item)} className="flex w-full items-center gap-4 px-4 py-3.5 text-left transition first:rounded-t-2xl last:rounded-b-2xl hover:bg-[#f7f9fc]"><ProductIcon item={item} /><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{item.name}</span><span className="mt-0.5 block truncate text-xs text-[#8a93a2]">{item.categoryName}</span></span><ArrowRight className="h-4 w-4 text-[#a0a8b5]" /></button>)}</div></>}
  </div>
}

function ProductIcon({ item }: { item: CatalogItem }) {
  return <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white ring-1 ring-[#e5e8ee]">{item.image && !item.image.includes("placeholder") ? <img src={item.image} alt="" className="h-full w-full object-contain" /> : <Package className="h-5 w-5 text-[#526f9f]" />}</span>
}

function DeliveryStep({ product, quantity, setQuantity, date, setDate, delivery, setDelivery, address, setAddress }: { product: CatalogItem; quantity: string; setQuantity: (value: string) => void; date: string; setDate: (value: string) => void; delivery: "delivery" | "pickup"; setDelivery: (value: "delivery" | "pickup") => void; address: string; setAddress: (value: string) => void }) {
  return <div><p className="text-xs font-semibold uppercase tracking-[.12em] text-[#6f7b8f]">Шаг 2 из 4</p><h2 className="mt-2 text-2xl font-semibold tracking-[-.03em] sm:text-3xl">Спланируйте поставку</h2><p className="mt-2 text-sm text-[#737d8e]">Мы покажем менеджеру желаемые объём и дату. Финальное окно подтвердим после проверки наличия.</p><div className="mt-7 rounded-2xl bg-[#f6f8fb] px-4 py-3 text-sm"><span className="text-[#7d8797]">Продукт</span><span className="ml-3 font-semibold">{product.name}</span></div><div className="mt-5 grid gap-4 sm:grid-cols-2"><Label text="Объём"><div className="relative"><input type="number" min="0.1" step="0.1" value={quantity} onChange={(event) => setQuantity(event.target.value)} className="h-13 w-full rounded-xl border border-[#dfe4ec] px-4 pr-10 outline-none focus:border-[#7d9bd1] focus:ring-4 focus:ring-[#eaf1ff]" /><span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#7d8797]">тонн</span></div></Label><Label text="Желаемая дата"><input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="h-13 w-full rounded-xl border border-[#dfe4ec] px-4 outline-none focus:border-[#7d9bd1] focus:ring-4 focus:ring-[#eaf1ff]" /></Label></div><div className="mt-5"><p className="mb-2 text-xs font-semibold text-[#596579]">Способ получения</p><div className="grid grid-cols-2 gap-2 rounded-xl bg-[#f0f3f7] p-1"><button type="button" onClick={() => setDelivery("delivery")} className={`h-11 rounded-lg text-sm font-semibold transition ${delivery === "delivery" ? "bg-white text-[#214a9a] shadow-sm" : "text-[#778194]"}`}>Доставка</button><button type="button" onClick={() => setDelivery("pickup")} className={`h-11 rounded-lg text-sm font-semibold transition ${delivery === "pickup" ? "bg-white text-[#214a9a] shadow-sm" : "text-[#778194]"}`}>Самовывоз</button></div></div><div className="mt-5"><Label text={delivery === "delivery" ? "Адрес поставки" : "Склад самовывоза"}><input value={address} onChange={(event) => setAddress(event.target.value)} className="h-13 w-full rounded-xl border border-[#dfe4ec] px-4 text-sm outline-none focus:border-[#7d9bd1] focus:ring-4 focus:ring-[#eaf1ff]" /></Label></div></div>
}

function DocumentsStep({ documents, setDocuments }: { documents: { requisites: boolean; contract: boolean; edo: boolean }; setDocuments: (value: { requisites: boolean; contract: boolean; edo: boolean }) => void }) {
  const rows = [
    { key: "requisites" as const, title: "Реквизиты компании", note: "Проверены 12 августа", locked: true },
    { key: "contract" as const, title: "Рамочный договор", note: "Действует до 31.12.2026", locked: true },
    { key: "edo" as const, title: "Электронный документооборот", note: "Можно подключить к этой сделке", locked: false },
  ]
  return <div><p className="text-xs font-semibold uppercase tracking-[.12em] text-[#6f7b8f]">Шаг 3 из 4</p><h2 className="mt-2 text-2xl font-semibold tracking-[-.03em] sm:text-3xl">Проверьте документы</h2><p className="mt-2 text-sm text-[#737d8e]">Большая часть уже заполнена из профиля компании. Повторно загружать документы не нужно.</p><div className="mt-7 divide-y divide-[#edf0f4] rounded-2xl border border-[#e1e5ec]">{rows.map((row) => <label key={row.key} className={`flex items-center gap-4 p-4 ${row.locked ? "cursor-default" : "cursor-pointer"}`}><button type="button" disabled={row.locked} onClick={() => setDocuments({ ...documents, [row.key]: !documents[row.key] })} className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${documents[row.key] ? "border-[#2e62bd] bg-[#2e62bd] text-white" : "border-[#cbd2de] bg-white"}`}>{documents[row.key] && <Check className="h-3.5 w-3.5" />}</button><span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{row.title}</span><span className="mt-0.5 block text-xs text-[#818999]">{row.note}</span></span>{row.locked && <span className="rounded-full bg-[#eef7f0] px-2.5 py-1 text-[11px] font-semibold text-[#3c7a4e]">Готово</span>}</label>)}</div><div className="mt-5 flex items-start gap-3 rounded-2xl bg-[#f2f6fd] p-4 text-sm leading-6 text-[#536784]"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#2855a7]" /><span>Документы хранятся в защищённом профиле и автоматически подставляются в следующие заказы.</span></div></div>
}

function ReviewStep({ product, quantity, date, delivery, address }: { product: CatalogItem; quantity: string; date: string; delivery: "delivery" | "pickup"; address: string }) {
  return <div><p className="text-xs font-semibold uppercase tracking-[.12em] text-[#6f7b8f]">Шаг 4 из 4</p><h2 className="mt-2 text-2xl font-semibold tracking-[-.03em] sm:text-3xl">Всё готово к отправке</h2><p className="mt-2 text-sm text-[#737d8e]">Менеджер проверит наличие, стоимость и логистику. Подтверждение появится здесь и придёт на почту.</p><dl className="mt-7 divide-y divide-[#edf0f4] rounded-2xl border border-[#e1e5ec] px-5"><ReviewRow label="Продукт" value={product.name} /><ReviewRow label="Объём" value={`${quantity} тонн`} /><ReviewRow label="Дата" value={new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${date}T12:00:00`))} /><ReviewRow label="Получение" value={delivery === "delivery" ? "Доставка" : "Самовывоз"} /><ReviewRow label="Адрес" value={address} /></dl></div>
}

function ReviewRow({ label, value }: { label: string; value: string }) { return <div className="grid gap-1 py-4 sm:grid-cols-[150px_1fr]"><dt className="text-sm text-[#818999]">{label}</dt><dd className="text-sm font-semibold text-[#27344b]">{value}</dd></div> }

function OrderCompleted({ product, date, onReset }: { product: CatalogItem; date: string; onReset: () => void }) {
  return <div className="flex min-h-[430px] flex-col items-center justify-center text-center"><span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#eaf6ed] text-[#438257]"><CheckCircle2 className="h-8 w-8" /></span><p className="mt-6 text-xs font-semibold uppercase tracking-[.12em] text-[#5c8666]">Заявка № 1057</p><h2 className="mt-2 text-3xl font-semibold tracking-[-.04em]">Заказ передан менеджеру</h2><p className="mt-3 max-w-md text-sm leading-6 text-[#737d8e]">{product.name} · желаемая дата {new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" }).format(new Date(`${date}T12:00:00`))}. Ответим в течение рабочего дня.</p><button type="button" onClick={onReset} className="mt-7 inline-flex h-11 items-center gap-2 rounded-xl border border-[#dce1e9] px-5 text-sm font-semibold text-[#31518c]">Создать ещё заказ <ArrowRight className="h-4 w-4" /></button></div>
}

function CurrentDelivery({ customer }: { customer: DemoCustomer }) {
  return <div className="rounded-[24px] bg-[#172d59] p-5 text-white"><div className="flex items-center justify-between"><span className="text-xs font-semibold uppercase tracking-[.11em] text-[#aebfe1]">Ближайшая поставка</span><span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-[#dbe6ff]">В пути</span></div><p className="mt-5 text-2xl font-semibold">{customer.nextDelivery}</p><p className="mt-1 text-sm text-[#bfcae0]">АБС-пластик 2020-31 · 12 т</p><div className="relative mt-6 h-1 rounded-full bg-white/15"><span className="absolute inset-y-0 left-0 w-[68%] rounded-full bg-[#80a9ff]" /></div><div className="mt-3 flex justify-between text-[11px] text-[#aebbd4]"><span>Подтверждено</span><span>Отгрузка</span><span>Доставка</span></div><div className="mt-5 flex items-center gap-2 text-xs text-[#d7e1f6]"><Clock3 className="h-4 w-4" />Ожидаем прибытие до 16:00</div></div>
}

function StatusLine({ label, done }: { label: string; done: boolean }) { return <div className="flex items-center gap-3 py-1.5"><span className={`flex h-5 w-5 items-center justify-center rounded-full ${done ? "bg-[#e8f5eb] text-[#418255]" : "bg-[#f0f2f5] text-[#9aa2af]"}`}>{done ? <Check className="h-3 w-3" /> : <Circle className="h-2.5 w-2.5" />}</span><span className={done ? "text-[#445066]" : "text-[#818999]"}>{label}</span></div> }

function MarketInsights({ tier, totalSpend }: { tier: CustomerTier; totalSpend: number }) {
  if (tier === "partner") return <PartnerAnalytics totalSpend={totalSpend} />
  if (tier === "gold") return <GoldAnalytics totalSpend={totalSpend} />
  return <section className="mt-10"><AnalyticsHeading eyebrow="Рабочая сводка" title="Ваши закупки" description="Только актуальная информация по вашим заказам, поставкам и документам." /><div className="mt-5 grid gap-4 md:grid-cols-3"><InsightCard icon={BarChart3} label="Закупки за период" value={totalSpend ? money(totalSpend) : "2,9 млн ₽"} note="Подтверждённые сделки" /><InsightCard icon={Truck} label="Заказов в работе" value="2" note="Одна поставка уже в пути" /><InsightCard icon={FileCheck2} label="Готовность документов" value="2 из 3" note="Осталось подключить ЭДО" /></div></section>
}

function AnalyticsHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="portal-accent-text text-xs font-semibold uppercase tracking-[.14em]">{eyebrow}</p><h2 className="mt-2 text-2xl font-semibold tracking-[-.03em] sm:text-3xl">{title}</h2></div><p className="max-w-md text-sm leading-6 text-[#788293]">{description}</p></div>
}

function GoldAnalytics({ totalSpend }: { totalSpend: number }) {
  const bars = [42, 58, 51, 69, 63, 78, 86, 74, 91, 82, 88, 96]
  return <section className="mt-10"><AnalyticsHeading eyebrow="Gold Analytics" title="Динамика и планирование" description="Расширенный обзор спроса и цен для планирования закупок на ближайшие 30 дней." /><div className="mt-5 grid gap-4 xl:grid-cols-[1.45fr_.75fr]"><article className="portal-analytics-card rounded-[26px] border border-[#e1e5ec] bg-white p-5 sm:p-7"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs text-[#818999]">Индекс спроса · АБС-пластики</p><p className="mt-2 text-3xl font-semibold">106,4 <span className="text-sm font-medium text-[#6e7d95]">+6,4%</span></p></div><span className="portal-status rounded-full px-3 py-1.5 text-xs font-semibold">Рынок растёт</span></div><div className="mt-8 flex h-48 items-end gap-2 sm:gap-3">{bars.map((height, index) => <div key={index} className="group flex h-full flex-1 items-end"><span className="portal-chart-bar w-full rounded-t-md transition" style={{ height: `${height}%`, opacity: .45 + index / 22 }} /></div>)}</div><div className="mt-3 flex justify-between text-[10px] uppercase tracking-[.08em] text-[#7e899b]"><span>Сен</span><span>Дек</span><span>Мар</span><span>Авг</span></div></article><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1"><InsightCard icon={BarChart3} label="Объём закупок" value={totalSpend ? money(totalSpend) : "5,47 млн ₽"} note="За 6 месяцев" /><InsightCard icon={LineChart} label="Ценовой коридор" value="158–166 тыс. ₽" note="Прогноз на 30 дней" /></div></div></section>
}

function PartnerAnalytics({ totalSpend }: { totalSpend: number }) {
  const line = "M0 144 C45 138 62 104 106 111 S165 138 206 92 S278 82 318 56 S379 70 430 34 S505 42 560 12"
  const area = `${line} L560 180 L0 180 Z`
  const segments = [{ label: "АБС-пластики", value: 82 }, { label: "УПЕКС", value: 67 }, { label: "Стирол", value: 44 }]
  return <section className="mt-10"><div className="partner-heading relative overflow-hidden rounded-[28px] border p-6 sm:p-8"><div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-cyan-300" /><p className="text-xs font-semibold uppercase tracking-[.16em] text-cyan-200">Partner Intelligence</p></div><h2 className="mt-3 text-3xl font-semibold tracking-[-.04em] text-white sm:text-4xl">Персональный центр рынка</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100/75">Прогнозы сформированы по вашему портфелю, графику потребления и рыночной динамике.</p></div><div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.06] px-4 py-3 backdrop-blur"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-300/15 text-cyan-200"><ShieldCheck className="h-4 w-4" /></span><span><span className="block text-[11px] text-blue-200/70">Статус сервиса</span><span className="block text-sm font-semibold text-white">Приоритетный канал</span></span></div></div></div><div className="mt-4 grid gap-4 xl:grid-cols-[1.55fr_.75fr]"><article className="portal-analytics-card rounded-[26px] border border-[#e1e5ec] bg-white p-5 sm:p-7"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs text-[#818999]">Рыночный индекс вашего портфеля</p><div className="mt-2 flex items-end gap-3"><p className="text-3xl font-semibold">112,8</p><span className="mb-1 rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold text-emerald-300">+8,2%</span></div></div><div className="text-right"><p className="text-xs text-[#818999]">Прогноз · 90 дней</p><p className="mt-2 text-sm font-semibold">Умеренный рост</p></div></div><div className="relative mt-6 h-56 overflow-hidden"><div className="portal-grid absolute inset-0" /><svg viewBox="0 0 560 180" className="relative h-full w-full overflow-visible" preserveAspectRatio="none"><defs><linearGradient id="partner-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--portal-accent)" stopOpacity=".38" /><stop offset="1" stopColor="var(--portal-accent)" stopOpacity="0" /></linearGradient><filter id="partner-glow"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs><path d={area} fill="url(#partner-area)" /><path d={line} fill="none" stroke="var(--portal-accent-bright)" strokeWidth="3" vectorEffect="non-scaling-stroke" filter="url(#partner-glow)" /><circle cx="560" cy="12" r="5" fill="var(--portal-accent-bright)" /></svg></div><div className="mt-2 flex justify-between text-[10px] uppercase tracking-[.08em] text-[#7e899b]"><span>Сен 2025</span><span>Дек</span><span>Мар</span><span>Авг 2026</span></div></article><div className="space-y-4"><article className="portal-analytics-card rounded-[26px] border border-[#e1e5ec] bg-white p-5"><p className="text-xs text-[#818999]">Спрос по категориям</p><div className="mt-5 space-y-4">{segments.map((segment) => <div key={segment.label}><div className="flex justify-between text-xs"><span>{segment.label}</span><span className="font-semibold">{segment.value}%</span></div><div className="mt-2 h-1.5 rounded-full bg-white/10"><div className="portal-chart-bar h-full rounded-full" style={{ width: `${segment.value}%` }} /></div></div>)}</div></article><article className="partner-recommendation rounded-[26px] border p-5"><div className="flex items-center gap-2 text-cyan-200"><Sparkles className="h-4 w-4" /><span className="text-xs font-semibold uppercase tracking-[.12em]">Рекомендация</span></div><p className="mt-4 text-lg font-semibold text-white">Зафиксировать 40 т УПЕКС</p><p className="mt-2 text-xs leading-5 text-blue-100/70">Оптимальное окно цены — до 7 сентября. Зарезервировано приоритетное окно отгрузки.</p></article></div></div><div className="mt-4 grid gap-4 sm:grid-cols-3"><InsightCard icon={BarChart3} label="Закупки за период" value={totalSpend ? money(totalSpend) : "5,47 млн ₽"} note="Подтверждённые сделки" /><InsightCard icon={CalendarDays} label="Резерв мощности" value="40 тонн" note="До 7 сентября" /><InsightCard icon={TrendingUp} label="Экономический эффект" value="+3,8%" note="От планирования объёма" /></div></section>
}

function InsightCard({ icon: Icon, label, value, note }: { icon: typeof BarChart3; label: string; value: string; note: string }) {
  return <article className="relative min-h-44 overflow-hidden rounded-[22px] border border-[#e1e5ec] bg-white p-5"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef3fc] text-[#2855a7]"><Icon className="h-4 w-4" /></span><p className="mt-5 text-xs text-[#818999]">{label}</p><p className="mt-1 text-xl font-semibold">{value}</p><p className="mt-1 text-xs text-[#9199a7]">{note}</p></article>
}

function ManagerWorkspace({ customers, onTierChange, onOpenCustomer }: { customers: DemoCustomer[]; onTierChange: (id: string, tier: CustomerTier) => void; onOpenCustomer: (id: string) => void }) {
  return <div className="mx-auto max-w-[1180px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12"><section className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between"><div><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.12em] text-[#6f7b8f]"><UsersRound className="h-4 w-4" />Клиентский доступ</div><h1 className="mt-3 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">Уровни клиентов</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#707b8d]">Менеджер назначает уровень, а клиент сразу видит соответствующие аналитику и инструменты. В демо изменения сохраняются в этом браузере.</p></div><div className="rounded-2xl border border-[#dfe4eb] bg-white px-4 py-3 text-sm"><span className="text-[#818999]">Клиентов в работе</span><span className="ml-3 text-lg font-semibold">{customers.length}</span></div></section><section className="mt-8 overflow-hidden rounded-[26px] border border-[#e0e4eb] bg-white"><div className="hidden grid-cols-[1.4fr_.8fr_1fr_110px] gap-5 border-b border-[#edf0f4] bg-[#fafbfc] px-6 py-4 text-[11px] font-semibold uppercase tracking-[.08em] text-[#87909f] md:grid"><span>Клиент</span><span>Активность</span><span>Уровень доступа</span><span /></div><div className="divide-y divide-[#edf0f4]">{customers.map((customer) => <div key={customer.id} className="grid gap-5 px-5 py-5 md:grid-cols-[1.4fr_.8fr_1fr_110px] md:items-center md:px-6"><div className="flex items-center gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#edf2fa] text-xs font-bold text-[#29497f]">{customer.initials}</span><span className="min-w-0"><span className="block truncate text-sm font-semibold">{customer.company}</span><span className="mt-0.5 block text-xs text-[#858e9d]">{customer.contact}</span></span></div><div className="text-sm"><span className="font-semibold">{customer.activeOrders}</span><span className="ml-1 text-[#858e9d]">заказа в работе</span></div><select value={customer.tier} onChange={(event) => onTierChange(customer.id, event.target.value as CustomerTier)} className="h-11 rounded-xl border border-[#dfe4eb] bg-white px-3 text-sm font-semibold text-[#30405c] outline-none focus:border-[#7d9bd1] focus:ring-4 focus:ring-[#eaf1ff]"><option value="silver">Серебряный</option><option value="gold">Золотой</option><option value="partner">Партнёр</option></select><button type="button" onClick={() => onOpenCustomer(customer.id)} className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-[#eef3fc] px-3 text-xs font-semibold text-[#2855a7]">Посмотреть <ArrowRight className="h-3.5 w-3.5" /></button></div>)}</div></section><section className="mt-6 grid gap-4 md:grid-cols-3">{(["silver", "gold", "partner"] as CustomerTier[]).map((tier) => { const meta = CUSTOMER_TIER_META[tier]; return <article key={tier} className="rounded-[22px] border border-[#e0e4eb] bg-white p-5"><div className="flex items-center justify-between"><span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ color: meta.accent, backgroundColor: meta.soft }}>{meta.label}</span><span className="text-xs text-[#929aa8]">{customers.filter((customer) => customer.tier === tier).length} клиент</span></div><p className="mt-4 text-sm font-semibold">{meta.description}</p><ul className="mt-4 space-y-2">{meta.analytics.map((item) => <li key={item} className="flex items-center gap-2 text-xs text-[#6f798b]"><Check className="h-3.5 w-3.5 text-[#4b72b8]" />{item}</li>)}</ul></article> })}</section></div>
}

function Label({ text, children }: { text: string; children: React.ReactNode }) { return <label className="block"><span className="mb-2 block text-xs font-semibold text-[#596579]">{text}</span>{children}</label> }
