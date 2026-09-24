"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight, ArrowUpRight, Factory, FlaskConical, GraduationCap } from "lucide-react"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"

const photos = "/images/technopark"
const collegeUrl = "https://utk71.ru/professionalitet"
const vkUrl = "https://vk.com/upc_professionalitet"

const content = {
  ru: {
    breadcrumb: "Карьера",
    eyebrow: "Профессионалитет · Узловая",
    title: "От учебной лаборатории — к реальному производству",
    intro: "АО «Пластик» и Узловский политехнический колледж вместе развивают подготовку специалистов для химической отрасли. Здесь теория встречается с оборудованием, процессами и задачами современного предприятия.",
    heroCaption: "Обучение химической технологии в лаборатории колледжа",
    since: "с 2022 года",
    sinceLabel: "партнёрство в проекте «Профессионалитет»",
    labs: "6 лабораторий",
    labsLabel: "для практической подготовки",
    place: "Узловая",
    placeLabel: "колледж и производственная площадка",
    storyEyebrow: "Не просто аудитория",
    storyTitle: "Место, где начинается профессия",
    storyOne: "В 2022 году колледж вошёл в федеральный проект «Профессионалитет», а АО «Пластик» стало предприятием-партнёром. Вместе они сформировали образовательно-производственный кластер химической отрасли.",
    storyTwo: "Для подготовки по химическим специальностям предприятие передало колледжу учебно-лабораторный корпус. Лаборатории позволяют знакомиться с процессами и оборудованием до выхода на производство.",
    equipmentCaption: "Учебная установка ректификации",
    advantagesEyebrow: "Связь учёбы и производства",
    advantagesTitle: "Что делает проект особенным",
    advantages: [
      { title: "Учиться на практике", body: "В центре обучения — лабораторные занятия, современные мастерские и работа с технологическими процессами." },
      { title: "Видеть отрасль изнутри", body: "Программы развиваются при участии предприятия-партнёра и соотносятся с задачами реального производства." },
      { title: "Понимать следующий шаг", body: "Колледж помогает освоить профессию; актуальные возможности работы на предприятии собраны в разделе вакансий." },
    ],
    galleryEyebrow: "Пространство для будущих специалистов",
    galleryTitle: "Колледж в кадре",
    classCaption: "Учебный класс",
    studentsCaption: "Студенты у учебно-лабораторного корпуса",
    ctaTitle: "Начните знакомство с профессией",
    ctaBody: "Актуальные программы, правила приёма и контакты уточняйте на официальном сайте колледжа. За жизнью проекта можно следить в сообществе «Профессионалитета».",
    collegeLink: "Сайт колледжа",
    vkLink: "Сообщество VK",
    vacanciesLink: "Вакансии АО «Пластик»",
  },
  en: {
    breadcrumb: "Career",
    eyebrow: "Professionalitet · Uzlovaya",
    title: "From the teaching lab to real production",
    intro: "JSC Plastic and Uzlovaya Polytechnic College work together to train specialists for the chemical industry. Classroom learning meets the equipment, processes and challenges of a modern plant.",
    heroCaption: "Chemical technology training in the college laboratory",
    since: "since 2022",
    sinceLabel: "partnership in the Professionalitet project",
    labs: "6 laboratories",
    labsLabel: "for practical training",
    place: "Uzlovaya",
    placeLabel: "college and industrial site",
    storyEyebrow: "More than a classroom",
    storyTitle: "Where a profession begins",
    storyOne: "In 2022, the college joined the federal Professionalitet project, with JSC Plastic as its industrial partner. Together they established an education-and-industry cluster for the chemical sector.",
    storyTwo: "JSC Plastic provided the college with a training and laboratory building for chemical technology programmes. Its laboratories let students explore processes and equipment before entering the workplace.",
    equipmentCaption: "Training rectification unit",
    advantagesEyebrow: "Connecting education and industry",
    advantagesTitle: "What makes this project different",
    advantages: [
      { title: "Learn by doing", body: "Laboratory work, modern workshops and technological processes are central to the learning experience." },
      { title: "See the industry up close", body: "Programmes are developed with the industrial partner and reflect the needs of real production." },
      { title: "Know your next step", body: "The college provides professional training; current opportunities at the plant are listed on our vacancies page." },
    ],
    galleryEyebrow: "A place for future specialists",
    galleryTitle: "Inside the college",
    classCaption: "Training classroom",
    studentsCaption: "Students outside the training and laboratory building",
    ctaTitle: "Explore your future profession",
    ctaBody: "Check the college's official website for current programmes, admissions rules and contacts. Follow the Professionalitet community for project updates.",
    collegeLink: "College website",
    vkLink: "VK community",
    vacanciesLink: "JSC Plastic vacancies",
  },
} as const

export function CollegePageClient() {
  const { lang } = useLanguage()
  const t = content[lang]

  return (
    <>
      <main className="min-h-screen bg-white text-[#16213b]">
        <section className="relative isolate overflow-hidden bg-[#102c64] text-white">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_20%,rgba(89,153,255,.34),transparent_34%),linear-gradient(130deg,#0d2453,#173b81_65%,#1c518e)]" />
          <div className="container mx-auto px-4 pb-16 pt-32 lg:px-8 lg:pb-24 lg:pt-40">
            <Link href="/about/vacancies" className="inline-flex items-center gap-2 text-sm font-medium text-white/75 transition hover:text-white"><ArrowLeft className="h-4 w-4" />{t.breadcrumb}</Link>
            <div className="mt-12 grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
              <div>
                <p className="mb-5 text-xs font-bold uppercase tracking-[.2em] text-[#a9d3ff]">{t.eyebrow}</p>
                <h1 className="max-w-3xl text-4xl font-semibold leading-[1.12] tracking-tight sm:text-5xl lg:text-[clamp(3.5rem,4.5vw,5.25rem)]">{t.title}</h1>
                <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl">{t.intro}</p>
                <a href={collegeUrl} target="_blank" rel="noopener noreferrer" className="mt-9 inline-flex items-center gap-3 rounded-xl bg-white px-6 py-4 font-semibold text-[#173b81] transition hover:bg-[#e6f0ff]">{t.collegeLink}<ArrowUpRight className="h-5 w-5" /></a>
              </div>
              <figure className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 p-2 shadow-2xl">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[1.6rem]"><Image src={`${photos}/lab-students.jpg`} alt={t.heroCaption} fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 45vw" /></div>
                <figcaption className="px-4 py-3 text-sm text-white/75">{t.heroCaption}</figcaption>
              </figure>
            </div>
            <div className="mt-14 grid gap-3 sm:grid-cols-3 lg:mt-20">
              {[[t.since, t.sinceLabel], [t.labs, t.labsLabel], [t.place, t.placeLabel]].map(([value, label]) => (
                <div key={value} className="rounded-2xl border border-white/15 bg-white/10 px-6 py-5 backdrop-blur-sm"><p className="text-2xl font-semibold sm:text-3xl">{value}</p><p className="mt-2 text-sm leading-relaxed text-white/70">{label}</p></div>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto grid items-center gap-12 px-4 py-20 lg:grid-cols-2 lg:gap-20 lg:px-8 lg:py-28">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-[#315ca4]">{t.storyEyebrow}</p>
            <h2 className="mt-4 max-w-xl text-3xl font-semibold leading-tight tracking-tight text-[#173b81] sm:text-4xl">{t.storyTitle}</h2>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-slate-600">{t.storyOne}</p>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">{t.storyTwo}</p>
          </div>
          <figure className="overflow-hidden rounded-3xl border border-slate-200 bg-[#f3f7ff] shadow-sm">
            <div className="relative aspect-[5/4]"><Image src={`${photos}/lab-rectification.jpg`} alt={t.equipmentCaption} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" /></div>
            <figcaption className="px-5 py-4 text-sm text-slate-600">{t.equipmentCaption}</figcaption>
          </figure>
        </section>

        <section className="bg-[#f1f6ff] py-20 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-[#315ca4]">{t.advantagesEyebrow}</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#173b81] sm:text-4xl">{t.advantagesTitle}</h2>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {[FlaskConical, Factory, GraduationCap].map((Icon, index) => (
                <article key={t.advantages[index].title} className="rounded-3xl border border-[#dbe7f7] bg-white p-7 shadow-sm sm:p-8">
                  <span className="inline-flex rounded-2xl bg-[#e8f0ff] p-3 text-[#20488f]"><Icon className="h-7 w-7" /></span>
                  <p className="mt-8 text-xs font-semibold tracking-[.2em] text-[#6280ad]">0{index + 1}</p>
                  <h3 className="mt-3 text-xl font-semibold text-[#173b81]">{t.advantages[index].title}</h3>
                  <p className="mt-3 leading-relaxed text-slate-600">{t.advantages[index].body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-20 lg:px-8 lg:py-28">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-[#315ca4]">{t.galleryEyebrow}</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#173b81] sm:text-4xl">{t.galleryTitle}</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {[["lab-class.jpg", t.classCaption], ["college.jpg", t.studentsCaption]].map(([src, caption]) => (
              <figure key={src} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="relative aspect-[8/5]"><Image src={`${photos}/${src}`} alt={caption} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" /></div>
                <figcaption className="px-6 py-4 text-sm text-slate-600">{caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 pb-20 lg:px-8 lg:pb-28">
          <div className="rounded-[2rem] bg-[#173b81] px-7 py-10 text-white sm:px-12 sm:py-14 lg:flex lg:items-end lg:justify-between lg:gap-10">
            <div className="max-w-2xl"><h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t.ctaTitle}</h2><p className="mt-4 leading-relaxed text-white/75">{t.ctaBody}</p></div>
            <div className="mt-8 flex flex-wrap gap-3 lg:mt-0">
              <a href={collegeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-[#173b81] transition hover:bg-[#e8f0ff]">{t.collegeLink}<ArrowUpRight className="h-4 w-4" /></a>
              <a href={vkUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/35 px-5 py-3 font-semibold transition hover:bg-white/10">{t.vkLink}<ArrowUpRight className="h-4 w-4" /></a>
              <Link href="/about/vacancies" className="inline-flex items-center gap-2 rounded-xl border border-white/35 px-5 py-3 font-semibold transition hover:bg-white/10">{t.vacanciesLink}<ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
