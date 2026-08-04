"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Building2, LockKeyhole, UserRound } from "lucide-react"
import { createClient } from "@/utils/supabase/client"

export default function CustomerLoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<"login" | "register">("login")
  const [accountType, setAccountType] = useState<"company" | "individual">("company")
  const [form, setForm] = useState({ email: "", password: "", companyName: "", inn: "", contactName: "", phone: "" })
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [pending, setPending] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault(); setError(""); setMessage(""); setPending(true)
    const supabase = createClient()
    if (mode === "login") {
      const previewResponse = await fetch("/api/customer/preview-auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ login: form.email, password: form.password }) })
      if (previewResponse.ok) {
        router.push("/account"); router.refresh(); setPending(false); return
      }
      const { error: authError } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
      if (authError) setError("Не удалось войти. Проверьте email и пароль.")
      else { router.push("/account"); router.refresh() }
    } else {
      const { data, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { account_type: accountType, company_name: form.companyName, inn: form.inn, contact_name: form.contactName, phone: form.phone } },
      })
      if (authError) setError(authError.message)
      else if (data.session) { router.push("/account"); router.refresh() }
      else setMessage("Проверьте почту и подтвердите регистрацию. После подтверждения можно войти.")
    }
    setPending(false)
  }

  const field = (key: keyof typeof form, placeholder: string, type = "text", required = true) => (
    <input type={type} required={required} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder}
      className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10" />
  )

  return <main className="min-h-[calc(100svh-7rem)] bg-[#f4f7fb] px-4 py-10 lg:py-16">
    <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_80px_rgba(18,42,86,.12)] lg:grid-cols-[.9fr_1.1fr]">
      <section className="relative hidden overflow-hidden bg-[#102757] p-12 text-white lg:flex lg:items-center lg:justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_10%,rgba(53,112,219,.65),transparent_38%)]" />
        <Image src="/images/logo123.png" alt="АО Пластик" width={330} height={120} className="relative h-auto w-[72%] brightness-0 invert" priority />
      </section>
      <section className="p-6 sm:p-10 lg:p-14">
        <div className="mb-8 flex rounded-xl bg-slate-100 p-1"><button onClick={() => setMode("login")} className={`h-11 flex-1 rounded-lg text-sm font-semibold transition ${mode === "login" ? "bg-white text-primary shadow-sm" : "text-slate-500"}`}>Войти</button><button onClick={() => setMode("register")} className={`h-11 flex-1 rounded-lg text-sm font-semibold transition ${mode === "register" ? "bg-white text-primary shadow-sm" : "text-slate-500"}`}>Регистрация</button></div>
        <div className="mb-7"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><LockKeyhole /></div><h2 className="mt-5 text-3xl font-semibold tracking-tight">{mode === "login" ? "Личный кабинет" : "Стать оптовым покупателем"}</h2><p className="mt-2 text-sm leading-relaxed text-slate-500">Кабинет предназначен для оптовых клиентов и корпоративных закупок.</p></div>
        <form onSubmit={submit} className="space-y-4">
          {mode === "register" && <><div className="grid grid-cols-2 gap-2"><button type="button" onClick={() => setAccountType("company")} className={`flex h-12 items-center justify-center gap-2 rounded-xl border text-sm font-medium ${accountType === "company" ? "border-primary bg-primary/5 text-primary" : "border-slate-200"}`}><Building2 className="h-4 w-4" />Компания / ИП</button><button type="button" onClick={() => setAccountType("individual")} className={`flex h-12 items-center justify-center gap-2 rounded-xl border text-sm font-medium ${accountType === "individual" ? "border-primary bg-primary/5 text-primary" : "border-slate-200"}`}><UserRound className="h-4 w-4" />Частное лицо</button></div>{field("companyName", accountType === "company" ? "Название компании или ИП" : "ФИО покупателя")}{accountType === "company" && field("inn", "ИНН", "text", true)}{field("contactName", "Контактное лицо")}{field("phone", "+7 (___) ___-__-__", "tel")}</>}
          {field("email", mode === "login" ? "Email или логин" : "Рабочий email", mode === "login" ? "text" : "email")}{field("password", mode === "login" ? "Пароль" : "Пароль — не менее 8 символов", "password")}
          {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}{message && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>}
          <button disabled={pending} className="h-12 w-full rounded-xl bg-primary font-semibold text-white transition hover:bg-primary/90 disabled:opacity-60">{pending ? "Подождите…" : mode === "login" ? "Войти в кабинет" : "Создать кабинет"}</button>
        </form>
        <p className="mt-6 text-center text-xs leading-relaxed text-slate-400">Продолжая, вы соглашаетесь с <Link href="/legal/privacy-policy" className="text-primary hover:underline">политикой конфиденциальности</Link>.</p>
      </section>
    </div>
  </main>
}
