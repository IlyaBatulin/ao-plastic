"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Building2, CalendarDays, ChevronRight, Clock3, LogOut, Mail, PackageCheck, Phone, Plus, RefreshCw, ShoppingBag, UserRound } from "lucide-react"
import { createClient } from "@/utils/supabase/client"

type AccountData = {
  profile: any
  manager: { name: string; email?: string; phone?: string } | null
  orders: Array<{ id: number; created_at: string; comment?: string; items: Array<{ id: number; quantity: number; price?: number | null; products?: { name?: string } | null; category_id?: string }> }>
  reservations: Array<{ id: number; product_name: string; quantity: number; unit: string; requested_delivery_date: string; status: string }>
  reservationsAvailable: boolean
}

const money = (value: number) => new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(value)
const date = (value: string) => new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value))

export default function AccountPage() {
  const router = useRouter()
  const [data, setData] = useState<AccountData | null>(null)
  const [loading, setLoading] = useState(true)
  const [reservationOpen, setReservationOpen] = useState(false)
  const [notice, setNotice] = useState("")
  const [reservation, setReservation] = useState({ productName: "", quantity: "", unit: "т", requestedDeliveryDate: "", comment: "" })

  async function load() {
    const response = await fetch("/api/customer/account", { cache: "no-store" })
    if (response.status === 401) { router.replace("/account/login"); return }
    if (response.ok) setData(await response.json())
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  async function logout() { await fetch("/api/customer/preview-auth", { method: "DELETE" }); await createClient().auth.signOut(); router.push("/"); router.refresh() }
  async function reserve(event: FormEvent) {
    event.preventDefault(); setNotice("")
    const response = await fetch("/api/customer/reservations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(reservation) })
    const result = await response.json()
    if (!response.ok) { setNotice(result.error || "Не удалось отправить запрос"); return }
    setNotice("Запрос на резерв отправлен менеджеру"); setReservationOpen(false); await load()
  }
  const totalSpend = useMemo(() => data?.orders.reduce((sum, order) => sum + order.items.reduce((s, item) => s + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0), 0) || 0, [data])

  if (loading) return <main className="flex min-h-[70svh] items-center justify-center bg-[#f4f7fb]"><RefreshCw className="h-7 w-7 animate-spin text-primary" /></main>
  if (!data) return null
  const displayName = data.profile.company_name || data.profile.contact_name || "Покупатель"

  return <main className="min-h-screen bg-[#f4f7fb] pb-16">
    <section className="border-b border-slate-200 bg-white"><div className="container mx-auto flex flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:py-10">
      <div><p className="text-caption text-primary">ЛИЧНЫЙ КАБИНЕТ</p><h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{displayName}</h1><p className="mt-2 flex items-center gap-2 text-sm text-slate-500"><span className={`h-2 w-2 rounded-full ${data.profile.is_approved ? "bg-emerald-500" : "bg-amber-400"}`} />{data.profile.is_approved ? "Оптовый клиент подтверждён" : "Профиль на проверке у менеджера"}</p></div>
      <div className="flex gap-2"><Link href="/products" className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white"><Plus className="h-4 w-4" />Новый заказ</Link><button onClick={logout} className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500" aria-label="Выйти"><LogOut className="h-4 w-4" /></button></div>
    </div></section>

    <div className="container mx-auto grid gap-6 px-4 py-7 sm:px-6 lg:grid-cols-[1fr_320px] lg:py-10">
      <div className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat icon={<ShoppingBag />} value={String(data.orders.length)} label="Заказов" />
          <Stat icon={<PackageCheck />} value={data.reservations.length ? String(data.reservations.length) : "—"} label="Активных резервов" />
          <Stat icon={<CalendarDays />} value={totalSpend ? money(totalSpend) : "По запросу"} label="Объём закупок" />
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6"><div><h2 className="text-xl font-semibold">История заказов</h2><p className="mt-1 text-sm text-slate-500">Состав, согласованные цены и быстрый повтор</p></div><Link href="/products" className="hidden text-sm font-semibold text-primary sm:block">Открыть каталог</Link></div>
          {data.orders.length ? <div className="divide-y divide-slate-100">{data.orders.map(order => {
            const total = order.items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0)
            return <article key={order.id} className="p-5 sm:p-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex items-center gap-3"><h3 className="font-semibold">Заказ №{order.id}</h3><span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-primary">Принят</span></div><p className="mt-1 text-sm text-slate-500">{date(order.created_at)}</p></div><div className="sm:text-right"><p className="font-semibold">{total ? money(total) : "Цена согласовывается"}</p><p className="mt-1 text-xs text-slate-400">{order.items.length} поз.</p></div></div><div className="mt-4 space-y-2">{order.items.slice(0, 4).map(item => <div key={item.id} className="flex justify-between gap-4 text-sm"><span className="truncate text-slate-600">{item.products?.name || item.category_id || "Продукция АО «Пластик»"}</span><span className="shrink-0 font-medium">{item.quantity} {item.category_id === "hoztovary" ? "уп." : "т"}</span></div>)}</div><div className="mt-5 flex gap-2"><Link href="/products" className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-semibold">Повторить заказ <ChevronRight className="h-4 w-4" /></Link></div></article>
          })}</div> : <Empty icon={<ShoppingBag />} title="Заказов пока нет" text="Добавьте продукцию из каталога — заявка и согласованная цена появятся здесь." action="Перейти в каталог" href="/products" />}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-xl font-semibold">План поставок и резерв</h2><p className="mt-1 text-sm text-slate-500">Укажите нужный объём и дату — менеджер подтвердит наличие и логистику.</p></div><button onClick={() => setReservationOpen(!reservationOpen)} className="h-11 rounded-xl bg-[#102757] px-5 text-sm font-semibold text-white">Запланировать поставку</button></div>
          {notice && <p className="mt-4 rounded-xl bg-blue-50 px-4 py-3 text-sm text-primary">{notice}</p>}
          {reservationOpen && <form onSubmit={reserve} className="mt-5 grid gap-3 border-t border-slate-100 pt-5 sm:grid-cols-2"><Input value={reservation.productName} onChange={v => setReservation({...reservation, productName:v})} placeholder="Продукция или марка" /><div className="grid grid-cols-[1fr_90px] gap-2"><Input value={reservation.quantity} onChange={v => setReservation({...reservation, quantity:v})} placeholder="Объём" type="number" /><select value={reservation.unit} onChange={e => setReservation({...reservation, unit:e.target.value})} className="rounded-xl border border-slate-200 bg-white px-3 text-sm"><option>т</option><option>уп.</option></select></div><Input value={reservation.requestedDeliveryDate} onChange={v => setReservation({...reservation, requestedDeliveryDate:v})} placeholder="Дата" type="date" /><Input value={reservation.comment} onChange={v => setReservation({...reservation, comment:v})} placeholder="Комментарий, адрес или график" /><button className="h-11 rounded-xl bg-primary text-sm font-semibold text-white sm:col-span-2">Отправить запрос менеджеру</button></form>}
          {data.reservations.length > 0 && <div className="mt-5 grid gap-3 sm:grid-cols-2">{data.reservations.map(item => <div key={item.id} className="rounded-xl bg-slate-50 p-4"><p className="font-semibold">{item.product_name}</p><p className="mt-1 text-sm text-slate-500">{item.quantity} {item.unit} · {date(item.requested_delivery_date)}</p></div>)}</div>}
        </section>
      </div>

      <aside className="space-y-5">
        <section className="rounded-2xl bg-[#102757] p-6 text-white"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10"><UserRound /></div><p className="mt-6 text-xs font-semibold uppercase tracking-[.12em] text-blue-200">Персональный менеджер</p><h2 className="mt-2 text-xl font-semibold">{data.manager?.name || "Будет назначен"}</h2><p className="mt-2 text-sm leading-relaxed text-blue-100">Поможет с подбором марки, ценой, документами и графиком отгрузки.</p><div className="mt-5 space-y-2">{data.manager?.phone && <a href={`tel:${data.manager.phone}`} className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-sm"><Phone className="h-4 w-4" />{data.manager.phone}</a>}{data.manager?.email && <a href={`mailto:${data.manager.email}`} className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-sm"><Mail className="h-4 w-4" /><span className="truncate">{data.manager.email}</span></a>}{!data.manager && <Link href="/contacts" className="flex items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#102757]">Связаться с отделом продаж</Link>}</div></section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-center gap-3"><Building2 className="h-5 w-5 text-primary" /><h2 className="font-semibold">Реквизиты покупателя</h2></div><dl className="mt-4 space-y-3 text-sm"><Row label="Тип" value={data.profile.account_type === "individual" ? "Частное лицо" : "Компания / ИП"} /><Row label="ИНН" value={data.profile.inn || "Не указан"} /><Row label="Контакт" value={data.profile.contact_name || "Не указан"} /><Row label="Email" value={data.profile.email} /></dl></section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-center gap-3"><Clock3 className="h-5 w-5 text-primary" /><div><p className="font-semibold">Документы и счета</p><p className="mt-1 text-sm text-slate-500">Будут доступны после согласования первого заказа.</p></div></div></section>
      </aside>
    </div>
  </main>
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) { return <div className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary [&>svg]:h-5 [&>svg]:w-5">{icon}</div><p className="mt-4 text-2xl font-semibold tracking-tight">{value}</p><p className="mt-1 text-sm text-slate-500">{label}</p></div> }
function Empty({ icon, title, text, action, href }: { icon: React.ReactNode; title: string; text: string; action: string; href: string }) { return <div className="flex flex-col items-center px-6 py-14 text-center"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">{icon}</div><h3 className="mt-4 font-semibold">{title}</h3><p className="mt-2 max-w-md text-sm text-slate-500">{text}</p><Link href={href} className="mt-5 text-sm font-semibold text-primary">{action} →</Link></div> }
function Input({ value, onChange, placeholder, type = "text" }: { value: string; onChange: (v:string)=>void; placeholder: string; type?: string }) { return <input required value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} type={type} min={type === "date" ? new Date().toISOString().slice(0,10) : undefined} className="h-11 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-primary" /> }
function Row({ label, value }: { label: string; value: string }) { return <div className="flex justify-between gap-4"><dt className="text-slate-400">{label}</dt><dd className="text-right font-medium text-slate-700">{value}</dd></div> }
