"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowRight, BarChart3, Building2, CalendarDays, Check, ChevronLeft, ChevronRight,
  Clock3, LogOut, Mail, PackageCheck, Phone, Plus, RefreshCw, Search, ShoppingBag,
  Sparkles, UserRound,
} from "lucide-react"
import productsData from "@/data/products.json"
import { createClient } from "@/utils/supabase/client"
import { useCart } from "@/contexts/cart-context"

type OrderItem = { id: number; quantity: number; price?: number | null; products?: { name?: string } | null; category_id?: string }
type Order = { id: number; created_at: string; comment?: string; items: OrderItem[] }
type Reservation = { id: number; product_name: string; quantity: number; unit: string; requested_delivery_date: string; status: string }
type AccountData = {
  profile: Record<string, any>
  manager: { name: string; email?: string; phone?: string } | null
  orders: Order[]
  reservations: Reservation[]
  reservationsAvailable: boolean
}
type CatalogItem = { id: string; name: string; categoryId: string; subcategoryId?: string; categoryName: string; image?: string; isPackages: boolean; packageQuantity?: number }

const money = (value: number) => new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(value)
const longDate = (value: string) => new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value))
const monthLabel = (value: Date) => new Intl.DateTimeFormat("ru-RU", { month: "long", year: "numeric" }).format(value)
const isoDate = (value: Date) => `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`

function flattenCatalog(): CatalogItem[] {
  const result: CatalogItem[] = []
  for (const category of productsData.categories as any[]) {
    const add = (product: any, subcategoryId?: string) => result.push({
      id: String(product.id), name: String(product.name), categoryId: String(category.id), subcategoryId,
      categoryName: String(category.name), image: product.image, isPackages: category.id === "hoztovary",
      packageQuantity: Number(product.package_quantity) || undefined,
    })
    for (const product of category.products || []) add(product)
    for (const subcategory of category.subcategories || []) for (const product of subcategory.products || []) add(product, String(subcategory.slug || subcategory.id))
  }
  return result
}

const catalog = flattenCatalog()

export default function AccountPage() {
  const router = useRouter()
  const { addItem, itemCount } = useCart()
  const [data, setData] = useState<AccountData | null>(null)
  const [loading, setLoading] = useState(true)
  const [notice, setNotice] = useState("")
  const [query, setQuery] = useState("")
  const [addedId, setAddedId] = useState("")
  const [calendarMonth, setCalendarMonth] = useState(() => new Date(2026, 7, 1))
  const [reservation, setReservation] = useState({ productName: "", quantity: "", unit: "т", requestedDeliveryDate: "2026-08-20", comment: "" })

  async function load() {
    const response = await fetch("/api/customer/account", { cache: "no-store" })
    if (response.status === 401) { router.replace("/account/login"); return }
    if (response.ok) setData(await response.json())
    setLoading(false)
  }
  useEffect(() => { void load() }, [])

  async function logout() {
    await fetch("/api/customer/preview-auth", { method: "DELETE" })
    await createClient().auth.signOut()
    router.push("/")
    router.refresh()
  }

  async function reserve(event: FormEvent) {
    event.preventDefault(); setNotice("")
    const response = await fetch("/api/customer/reservations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(reservation) })
    const result = await response.json()
    if (!response.ok) { setNotice(result.error || "Не удалось отправить запрос"); return }
    setNotice("Поставка добавлена в план — менеджер подтвердит наличие и логистику")
    await load()
  }

  function addCatalogItem(item: CatalogItem) {
    addItem({ productId: item.id, productName: item.name, productImage: item.image, categoryId: item.categoryId, subcategoryId: item.subcategoryId, quantity: 1, isPackages: item.isPackages, packageQuantity: item.packageQuantity })
    setAddedId(item.id); window.setTimeout(() => setAddedId(""), 1600)
  }

  const results = useMemo(() => {
    const value = query.trim().toLowerCase()
    if (value.length < 2) return []
    return catalog.filter(item => `${item.name} ${item.categoryName}`.toLowerCase().includes(value)).slice(0, 6)
  }, [query])

  const totalSpend = useMemo(() => data?.orders.reduce((sum, order) => sum + order.items.reduce((s, item) => s + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0), 0) || 0, [data])
  const chart = useMemo(() => {
    const months = Array.from({ length: 6 }, (_, index) => { const d = new Date(2026, 2 + index, 1); return { key: `${d.getFullYear()}-${d.getMonth()}`, label: new Intl.DateTimeFormat("ru-RU", { month: "short" }).format(d), value: 0 } })
    for (const order of data?.orders || []) { const d = new Date(order.created_at); const point = months.find(item => item.key === `${d.getFullYear()}-${d.getMonth()}`); if (point) point.value += order.items.reduce((sum, item) => sum + (Number(item.price) || 0) * Number(item.quantity), 0) }
    const max = Math.max(...months.map(item => item.value), 1)
    return months.map(item => ({ ...item, height: Math.max(8, Math.round(item.value / max * 100)) }))
  }, [data])

  if (loading) return <main className="flex min-h-[70svh] items-center justify-center bg-[#f2f5fa]"><RefreshCw className="h-7 w-7 animate-spin text-primary" /></main>
  if (!data) return null

  const displayName = data.profile.company_name || data.profile.contact_name || "Покупатель"

  return <main className="min-h-screen bg-[#f2f5fa] pb-20 text-[#14213d]">
    <section className="relative overflow-hidden border-b border-slate-200 bg-[#0d2149] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_-10%,rgba(75,132,255,.38),transparent_38%)]" />
      <div className="container relative mx-auto px-4 py-9 sm:px-6 lg:py-12">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div><p className="text-xs font-semibold uppercase tracking-[.18em] text-blue-200">Личный кабинет · B2B</p><h1 className="mt-3 text-3xl font-semibold tracking-[-.03em] sm:text-5xl">Добрый день, {displayName}</h1><p className="mt-3 flex items-center gap-2 text-sm text-blue-100"><span className="h-2 w-2 rounded-full bg-emerald-400" />Профиль подтверждён · менеджер на связи</p></div>
          <div className="flex gap-2"><Link href="/cart" className="relative inline-flex h-12 items-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-[#102757]"><ShoppingBag className="h-4 w-4" />Корзина{itemCount > 0 && <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-white">{itemCount}</span>}</Link><button onClick={logout} className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-white/10" aria-label="Выйти"><LogOut className="h-4 w-4" /></button></div>
        </div>
      </div>
    </section>

    <div className="container mx-auto space-y-6 px-4 py-7 sm:px-6 lg:py-10">
      <section className="grid gap-3 sm:grid-cols-3">
        <Metric icon={<ShoppingBag />} value={String(data.orders.length)} label="заказов" hint="за всё время" />
        <Metric icon={<PackageCheck />} value={String(data.reservations.length)} label="поставок в плане" hint="активные заявки" />
        <Metric icon={<BarChart3 />} value={totalSpend ? money(totalSpend) : "По запросу"} label="объём закупок" hint="согласованные цены" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_16px_50px_rgba(20,50,100,.06)] sm:p-7">
          <div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-primary">Динамика заказов</p><h2 className="mt-2 text-2xl font-semibold tracking-tight">Закупки за полгода</h2><p className="mt-1 text-sm text-slate-500">Сумма подтверждённых позиций по месяцам</p></div><span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">+ активность</span></div>
          <div className="mt-8 flex h-56 items-end gap-3 border-b border-slate-200 px-1 sm:gap-5">{chart.map((item, index) => <div key={item.key} className="group flex h-full flex-1 flex-col justify-end"><div className="relative flex flex-1 items-end"><div className={`w-full rounded-t-xl transition-all duration-700 ${index === chart.length - 1 ? "bg-[#2e5bc7]" : "bg-[#dfe8fa] group-hover:bg-[#aac1ef]"}`} style={{ height: `${item.height}%` }}><span className="absolute -top-6 left-1/2 hidden -translate-x-1/2 whitespace-nowrap text-[11px] font-semibold text-slate-600 group-hover:block">{item.value ? money(item.value) : "—"}</span></div></div><span className="py-3 text-center text-xs font-medium capitalize text-slate-400">{item.label}</span></div>)}</div>
        </div>
        <DeliveryCalendar month={calendarMonth} setMonth={setCalendarMonth} reservations={data.reservations} selected={reservation.requestedDeliveryDate} onSelect={value => setReservation({ ...reservation, requestedDeliveryDate: value })} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
        <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_16px_50px_rgba(20,50,100,.05)]">
          <div className="border-b border-slate-100 p-5 sm:p-7"><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Search /></span><div><h2 className="text-xl font-semibold">Быстрый заказ из каталога</h2><p className="text-sm text-slate-500">Найдите марку или товар и добавьте в корзину</p></div></div><div className="relative mt-5"><Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Например: АБС 2020, полистирол, ведро…" className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10" /></div></div>
          <div className="min-h-52 p-3 sm:p-4">{results.length ? <div className="divide-y divide-slate-100">{results.map(item => <div key={`${item.categoryId}-${item.id}`} className="flex items-center gap-4 rounded-xl px-2 py-3 transition hover:bg-slate-50"><div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100">{item.image && !item.image.includes("placeholder") ? <img src={item.image} alt="" className="h-full w-full object-contain" /> : <PackageCheck className="h-5 w-5 text-slate-400" />}</div><div className="min-w-0 flex-1"><p className="truncate font-semibold text-slate-900">{item.name}</p><p className="mt-0.5 truncate text-xs text-slate-400">{item.categoryName}</p></div><button onClick={() => addCatalogItem(item)} className={`flex h-10 shrink-0 items-center gap-2 rounded-xl px-4 text-sm font-semibold transition ${addedId === item.id ? "bg-emerald-100 text-emerald-700" : "bg-primary text-white hover:bg-primary/90"}`}>{addedId === item.id ? <><Check className="h-4 w-4" />Добавлено</> : <><Plus className="h-4 w-4" /><span className="hidden sm:inline">В корзину</span></>}</button></div>)}</div> : <div className="flex h-44 flex-col items-center justify-center text-center"><Sparkles className="h-7 w-7 text-primary/35" /><p className="mt-3 font-medium text-slate-500">Начните вводить название товара</p><p className="mt-1 text-sm text-slate-400">Поиск работает по всему каталогу</p></div>}</div>
          {itemCount > 0 && <div className="flex items-center justify-between border-t border-slate-100 bg-blue-50/60 px-5 py-4"><span className="text-sm font-medium text-slate-600">В корзине: {itemCount}</span><Link href="/cart" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">Оформить заказ <ArrowRight className="h-4 w-4" /></Link></div>}
        </div>

        <form onSubmit={reserve} className="rounded-[1.75rem] bg-[#102757] p-5 text-white shadow-[0_18px_55px_rgba(16,39,87,.2)] sm:p-7"><p className="text-xs font-bold uppercase tracking-[.14em] text-blue-200">Планирование</p><h2 className="mt-2 text-2xl font-semibold">Запланировать поставку</h2><p className="mt-2 text-sm leading-relaxed text-blue-100">Выберите дату в календаре и оставьте объём. Менеджер подтвердит график.</p>{notice && <p className="mt-4 rounded-xl bg-white/10 px-4 py-3 text-sm text-blue-50">{notice}</p>}<div className="mt-6 space-y-3"><Field value={reservation.productName} onChange={value => setReservation({ ...reservation, productName: value })} placeholder="Продукция или марка" dark /><div className="grid grid-cols-[1fr_92px] gap-2"><Field value={reservation.quantity} onChange={value => setReservation({ ...reservation, quantity: value })} placeholder="Объём" type="number" dark /><select value={reservation.unit} onChange={event => setReservation({ ...reservation, unit: event.target.value })} className="rounded-xl border border-white/15 bg-white/10 px-3 text-sm"><option className="text-slate-900">т</option><option className="text-slate-900">уп.</option></select></div><Field value={reservation.requestedDeliveryDate} onChange={value => setReservation({ ...reservation, requestedDeliveryDate: value })} placeholder="Дата" type="date" dark /><Field value={reservation.comment} onChange={value => setReservation({ ...reservation, comment: value })} placeholder="Адрес, график или комментарий" dark /><button className="h-12 w-full rounded-xl bg-white text-sm font-semibold text-[#102757] transition hover:bg-blue-50">Отправить менеджеру</button></div></form>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white"><div className="flex items-center justify-between border-b border-slate-100 p-5 sm:p-7"><div><h2 className="text-xl font-semibold">Последние заказы</h2><p className="mt-1 text-sm text-slate-500">История, состав и согласованные цены</p></div><Link href="/products" className="text-sm font-semibold text-primary">Каталог</Link></div>{data.orders.length ? <div className="divide-y divide-slate-100">{data.orders.map(order => <OrderRow key={order.id} order={order} />)}</div> : <div className="p-12 text-center text-slate-400">Заказов пока нет</div>}</div>
        <aside className="space-y-5"><section className="rounded-[1.75rem] border border-slate-200 bg-white p-6"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><UserRound /></div><p className="mt-5 text-xs font-bold uppercase tracking-[.12em] text-slate-400">Персональный менеджер</p><h2 className="mt-2 text-xl font-semibold">{data.manager?.name || "Будет назначен"}</h2><div className="mt-5 space-y-2">{data.manager?.phone && <a href={`tel:${data.manager.phone}`} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm"><Phone className="h-4 w-4 text-primary" />{data.manager.phone}</a>}{data.manager?.email && <a href={`mailto:${data.manager.email}`} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm"><Mail className="h-4 w-4 text-primary" /><span className="truncate">{data.manager.email}</span></a>}</div></section><section className="rounded-[1.75rem] border border-slate-200 bg-white p-6"><div className="flex items-center gap-3"><Building2 className="h-5 w-5 text-primary" /><h2 className="font-semibold">Профиль покупателя</h2></div><dl className="mt-4 space-y-3 text-sm"><InfoRow label="ИНН" value={data.profile.inn || "Не указан"} /><InfoRow label="Контакт" value={data.profile.contact_name || "Не указан"} /><InfoRow label="Email" value={data.profile.email} /></dl></section></aside>
      </section>
    </div>
  </main>
}

function DeliveryCalendar({ month, setMonth, reservations, selected, onSelect }: { month: Date; setMonth: (value: Date) => void; reservations: Reservation[]; selected: string; onSelect: (value: string) => void }) {
  const year = month.getFullYear(), monthIndex = month.getMonth(), first = new Date(year, monthIndex, 1), days = new Date(year, monthIndex + 1, 0).getDate()
  const offset = (first.getDay() + 6) % 7
  const cells = [...Array(offset).fill(null), ...Array.from({ length: days }, (_, index) => new Date(year, monthIndex, index + 1))]
  const events = new Set(reservations.map(item => item.requested_delivery_date))
  return <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_16px_50px_rgba(20,50,100,.06)] sm:p-7"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-primary">Календарь поставок</p><h2 className="mt-2 text-2xl font-semibold capitalize">{monthLabel(month)}</h2></div><div className="flex gap-2"><button onClick={() => setMonth(new Date(year, monthIndex - 1, 1))} className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200"><ChevronLeft className="h-4 w-4" /></button><button onClick={() => setMonth(new Date(year, monthIndex + 1, 1))} className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200"><ChevronRight className="h-4 w-4" /></button></div></div><div className="mt-6 grid grid-cols-7 gap-1 text-center">{["Пн","Вт","Ср","Чт","Пт","Сб","Вс"].map(day => <span key={day} className="py-2 text-[11px] font-bold uppercase text-slate-400">{day}</span>)}{cells.map((cell, index) => cell ? (() => { const key = isoDate(cell), active = selected === key, hasEvent = events.has(key); return <button type="button" key={key} onClick={() => onSelect(key)} className={`relative flex aspect-square items-center justify-center rounded-xl text-sm font-semibold transition ${active ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-blue-50"}`}>{cell.getDate()}{hasEvent && <span className={`absolute bottom-1.5 h-1.5 w-1.5 rounded-full ${active ? "bg-white" : "bg-emerald-500"}`} />}</button> })() : <span key={`empty-${index}`} />)}</div><div className="mt-5 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"><div className="flex items-center gap-2 text-sm text-slate-500"><span className="h-2 w-2 rounded-full bg-emerald-500" />Подтверждённая поставка</div><span className="text-xs font-semibold text-primary">{selected ? longDate(selected) : "Выберите дату"}</span></div></div>
}

function Metric({ icon, value, label, hint }: { icon: React.ReactNode; value: string; label: string; hint: string }) { return <div className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-start justify-between"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary [&>svg]:h-5 [&>svg]:w-5">{icon}</div><span className="text-xs text-slate-400">{hint}</span></div><p className="mt-5 text-2xl font-semibold tracking-tight">{value}</p><p className="mt-1 text-sm text-slate-500">{label}</p></div> }
function Field({ value, onChange, placeholder, type = "text", dark = false }: { value: string; onChange: (value: string) => void; placeholder: string; type?: string; dark?: boolean }) { return <input required value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} type={type} min={type === "date" ? new Date().toISOString().slice(0, 10) : undefined} className={`h-12 w-full rounded-xl px-4 text-sm outline-none ${dark ? "border border-white/15 bg-white/10 text-white placeholder:text-blue-200/60 focus:border-white/40" : "border border-slate-200 bg-white focus:border-primary"}`} /> }
function InfoRow({ label, value }: { label: string; value: string }) { return <div className="flex justify-between gap-4"><dt className="text-slate-400">{label}</dt><dd className="text-right font-medium text-slate-700">{value}</dd></div> }
function OrderRow({ order }: { order: Order }) { const total = order.items.reduce((sum, item) => sum + (Number(item.price) || 0) * Number(item.quantity), 0); return <article className="p-5 sm:p-7"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex items-center gap-3"><h3 className="font-semibold">Заказ №{order.id}</h3><span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-primary">Принят</span></div><p className="mt-1 text-sm text-slate-500">{longDate(order.created_at)}</p></div><div className="sm:text-right"><p className="font-semibold">{total ? money(total) : "Цена согласовывается"}</p><p className="mt-1 text-xs text-slate-400">{order.items.length} поз.</p></div></div><div className="mt-4 space-y-2">{order.items.slice(0, 4).map(item => <div key={item.id} className="flex justify-between gap-4 text-sm"><span className="truncate text-slate-600">{item.products?.name || item.category_id || "Продукция"}</span><span className="shrink-0 font-medium">{item.quantity} {item.category_id === "hoztovary" ? "уп." : "т"}</span></div>)}</div></article> }
