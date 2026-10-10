"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowRight, LockKeyhole } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { createClient } from "@/utils/supabase/client"

export default function CustomerLoginPage() {
  const { lang } = useLanguage()
  const tr = (ru: string, en: string) => lang === "en" ? en : ru
  const router = useRouter()
  const [mode, setMode] = useState<"login" | "register">("login")
  const [form, setForm] = useState({ email: "", password: "", companyName: "", inn: "", contactName: "", phone: "" })
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [pending, setPending] = useState(false)
  const [personalDataConsent, setPersonalDataConsent] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault(); setError(""); setMessage(""); setPending(true)
    const supabase = createClient()
    if (mode === "login") {
      const previewResponse = await fetch("/api/customer/preview-auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ login: form.email, password: form.password }) })
      if (previewResponse.ok) {
        router.push("/account"); router.refresh(); setPending(false); return
      }
      const { error: authError } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
      if (authError) setError(tr("Не удалось войти. Проверьте email и пароль.", "Unable to sign in. Check your email and password."))
      else { router.push("/account"); router.refresh() }
    } else {
      if (!personalDataConsent) {
        setError(tr("Для регистрации подтвердите согласие на обработку персональных данных контактного лица.", "To register, confirm your consent to the processing of the contact person's personal data."))
        setPending(false)
        return
      }
      const { data, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { account_type: "company", company_name: form.companyName, inn: form.inn, contact_name: form.contactName, phone: form.phone } },
      })
      if (authError) setError(authError.message)
      else if (data.session) { router.push("/account"); router.refresh() }
      else setMessage(tr("Проверьте почту и подтвердите регистрацию. После подтверждения можно войти.", "Check your email and confirm your registration. You can then sign in."))
    }
    setPending(false)
  }

  async function openDemo() {
    setPending(true)
    setError("")
    const response = await fetch("/api/customer/demo-auth", { method: "POST" })
    if (!response.ok) {
      setError(tr("Демо-доступ доступен только при локальном запуске.", "Demo access is available only when running locally."))
      setPending(false)
      return
    }
    router.push("/account")
    router.refresh()
  }

  const field = (key: keyof typeof form, placeholder: string, type = "text", required = true) => (
    <input type={type} required={required} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder}
      className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10" />
  )

  return <main className="min-h-[calc(100svh-7rem)] bg-[#f4f7fb] px-4 py-10 lg:py-16">
    <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_80px_rgba(18,42,86,.12)] lg:grid-cols-[.9fr_1.1fr]">
      <section className="relative hidden overflow-hidden bg-[#102757] p-12 text-white lg:flex lg:items-center lg:justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_10%,rgba(53,112,219,.65),transparent_38%)]" />
        <Image src="/images/logo123.png" alt={tr("АО Пластик", "JSC Plastic")} width={330} height={120} className="relative h-auto w-[72%] brightness-0 invert" priority />
      </section>
      <section className="p-6 sm:p-10 lg:p-14">
        <div className="mb-8 flex rounded-xl bg-slate-100 p-1"><button onClick={() => setMode("login")} className={`h-11 flex-1 rounded-lg text-sm font-semibold transition ${mode === "login" ? "bg-white text-primary shadow-sm" : "text-slate-500"}`}>{tr("Войти", "Sign in")}</button><button onClick={() => setMode("register")} className={`h-11 flex-1 rounded-lg text-sm font-semibold transition ${mode === "register" ? "bg-white text-primary shadow-sm" : "text-slate-500"}`}>{tr("Регистрация", "Register")}</button></div>
        <div className="mb-7"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><LockKeyhole /></div><h2 className="mt-5 text-3xl font-semibold tracking-tight">{mode === "login" ? tr("Личный кабинет", "Customer account") : tr("Стать оптовым покупателем", "Become a wholesale customer")}</h2><p className="mt-2 text-sm leading-relaxed text-slate-500">{tr("Кабинет предназначен для оптовых клиентов и корпоративных закупок.", "An account for wholesale customers and corporate purchasing.")}</p></div>
        <form onSubmit={submit} className="space-y-4">
          {mode === "register" && <>{field("companyName", tr("Название компании или ИП", "Company or sole trader name"))}{field("inn", tr("ИНН", "Tax identification number (INN)"), "text", true)}{field("contactName", tr("Контактное лицо", "Contact person"))}{field("phone", "+7 (___) ___-__-__", "tel")}</>}
          {field("email", mode === "login" ? tr("Email или логин", "Email or username") : tr("Рабочий email", "Work email"), mode === "login" ? "text" : "email")}{field("password", mode === "login" ? tr("Пароль", "Password") : tr("Пароль — не менее 8 символов", "Password — at least 8 characters"), "password")}
          {mode === "register" && <div className="flex items-start gap-3 text-sm text-slate-600">
            <input id="registration-personal-data-consent" type="checkbox" checked={personalDataConsent} onChange={(event) => setPersonalDataConsent(event.target.checked)} required className="mt-1 h-4 w-4 shrink-0 accent-primary" />
            <label htmlFor="registration-personal-data-consent">{tr("Даю отдельное ", "I give separate ")}<Link href="/legal/personal-data-consent" target="_blank" rel="noopener noreferrer" className="text-primary underline">{tr("согласие на обработку персональных данных", "consent to the processing of personal data")}</Link>{tr(" контактного лица. С ", " of the contact person. I have read the ")}<Link href="/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary underline">{tr("политикой обработки персональных данных", "Personal Data Processing Policy")}</Link>{tr(" ознакомлен(а).", ".")}</label>
          </div>}
          {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}{message && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>}
          <button disabled={pending || (mode === "register" && !personalDataConsent)} className="h-12 w-full rounded-xl bg-primary font-semibold text-white transition hover:bg-primary/90 disabled:opacity-60">{pending ? tr("Подождите…", "Please wait…") : mode === "login" ? tr("Войти в кабинет", "Sign in") : tr("Создать кабинет", "Create account")}</button>
        </form>
        {process.env.NODE_ENV === "development" && mode === "login" && <div className="mt-6 border-t border-slate-100 pt-6"><button type="button" onClick={openDemo} disabled={pending} className="group flex w-full items-center justify-between rounded-2xl bg-[#eef4ff] px-5 py-4 text-left text-[#173b88] transition hover:bg-[#e5eeff] disabled:opacity-60"><span><span className="block text-sm font-semibold">{tr("Посмотреть демо-кабинет", "Explore the demo account")}</span><span className="mt-0.5 block text-xs text-[#5570a8]">{tr("Серебряный, золотой и партнёрский профили", "Silver, Gold and Partner profiles")}</span></span><ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" /></button></div>}
        <p className="mt-6 text-center text-xs leading-relaxed text-slate-400">{tr("Кабинет доступен только организациям и индивидуальным предпринимателям.", "Accounts are available to companies and sole traders only.")}</p>
      </section>
    </div>
  </main>
}
