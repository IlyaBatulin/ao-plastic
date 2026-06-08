"use client"

import { useState, useEffect } from "react"
import { Briefcase, MapPin, Clock, Banknote, ExternalLink, Building, Search, SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { HH_EMPLOYER_URL } from "@/lib/hh-api"
import { useLanguage } from "@/contexts/language-context"

interface HHVacancy {
  id: string
  name: string
  area: {
    name: string
  }
  salary: {
    from?: number
    to?: number
    currency?: string
    gross?: boolean
  } | null
  employment?: {
    id: string
    name: string
  }
  schedule?: {
    id: string
    name: string
  }
  experience?: {
    id: string
    name: string
  }
  description?: string
  key_skills?: Array<{ name: string }>
  alternate_url: string
  apply_alternate_url?: string
  snippet?: {
    requirement?: string
    responsibility?: string
  }
  address?: {
    city?: string
    street?: string
    building?: string
    metro?: {
      station_name: string
      line_name: string
    }
  }
  employer: {
    name: string
    logo_urls?: {
      "90"?: string
      "240"?: string
      original?: string
    }
  }
  published_at: string
}

interface HHVacanciesResponse {
  items: HHVacancy[]
  found: number
  pages: number
  page: number
  per_page: number
  fallbackUrl?: string
  warning?: string
}

export function HHVacanciesClient() {
  const { t, lang } = useLanguage()
  const [vacancies, setVacancies] = useState<HHVacancy[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [warning, setWarning] = useState<string | null>(null)
  const [fallbackUrl, setFallbackUrl] = useState(HH_EMPLOYER_URL)
  const [hhBlocked, setHhBlocked] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalFound, setTotalFound] = useState(0)
  
  // Фильтры
  const [showFilters, setShowFilters] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [minSalary, setMinSalary] = useState("")
  const [onlyWithSalary, setOnlyWithSalary] = useState(false)
  const [selectedExperience, setSelectedExperience] = useState("")
  const [selectedEmployment, setSelectedEmployment] = useState("")
  const [selectedSchedule, setSelectedSchedule] = useState("")

  useEffect(() => {
    fetchVacancies(currentPage)
  }, [currentPage, searchText, minSalary, onlyWithSalary, selectedExperience, selectedEmployment, selectedSchedule])

  const fetchVacancies = async (page: number) => {
    setIsLoading(true)
    setError(null)
    setWarning(null)
    setHhBlocked(false)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: "20",
      })

      if (searchText) params.append("text", searchText)
      if (minSalary) params.append("salary", minSalary)
      if (onlyWithSalary) params.append("only_with_salary", "true")
      if (selectedExperience) params.append("experience", selectedExperience)
      if (selectedEmployment) params.append("employment", selectedEmployment)
      if (selectedSchedule) params.append("schedule", selectedSchedule)

      const applyList = (data: HHVacanciesResponse) => {
        setVacancies((data.items ?? []) as HHVacancy[])
        setTotalPages(data.pages ?? 0)
        setTotalFound(data.found ?? 0)
        if (data.fallbackUrl) setFallbackUrl(data.fallbackUrl)
      }

      const response = await fetch(`/api/hh-vacancies?${params.toString()}`)
      const data: HHVacanciesResponse = await response.json()

      applyList(data)

      if ((data.items?.length ?? 0) > 0) {
        return
      }
      if (data.warning) {
        setWarning(data.warning)
        setHhBlocked(true)
      } else if (!response.ok) {
        throw new Error(t("vacanciesPage.loadError"))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("vacanciesPage.genericError"))
    } finally {
      setIsLoading(false)
    }
  }

  const handleApplyFilters = () => {
    setCurrentPage(0)
    fetchVacancies(0)
  }

  const handleResetFilters = () => {
    setSearchText("")
    setMinSalary("")
    setOnlyWithSalary(false)
    setSelectedExperience("")
    setSelectedEmployment("")
    setSelectedSchedule("")
    setCurrentPage(0)
  }

  const hasActiveFilters = searchText || minSalary || onlyWithSalary || selectedExperience || selectedEmployment || selectedSchedule

  const formatSalary = (salary: HHVacancy["salary"]) => {
    if (!salary) return t("vacanciesPage.salaryNotSpecified")

    const currencySymbols: Record<string, string> = {
      RUR: "₽",
      USD: "$",
      EUR: "€",
      KZT: "₸",
      UAH: "₴",
      BYR: "Br",
      UZS: "UZS",
    }

    const symbol = currencySymbols[salary.currency || "RUR"] || salary.currency
    const locale = lang === "en" ? "en-US" : "ru-RU"

    if (salary.from && salary.to) {
      return `${salary.from.toLocaleString(locale)} — ${salary.to.toLocaleString(locale)} ${symbol}`
    } else if (salary.from) {
      return `${t("vacanciesPage.salaryFrom")} ${salary.from.toLocaleString()} ${symbol}`
    } else if (salary.to) {
      return `${t("vacanciesPage.salaryTo")} ${salary.to.toLocaleString()} ${symbol}`
    }

    return t("vacanciesPage.salaryNotSpecified")
  }

  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV")
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ""
  }

  return (
    <div className="space-y-6">
      {/* Поиск и фильтры */}
      <div className="bg-card rounded-lg p-5 border border-border shadow-sm">
        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t("vacanciesPage.searchPlaceholder")}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-10 h-10 border-border focus:border-primary dark:focus:border-[#60a5fa]"
            />
          </div>
          <Button
            variant={showFilters ? "secondary" : "outline"}
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 h-10 px-4"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {t("vacanciesPage.filters")}
            {hasActiveFilters && (
              <span className="ml-1 px-2 py-0.5 bg-primary dark:bg-[#60a5fa] text-white rounded-full text-xs font-medium">
                {[searchText, minSalary, onlyWithSalary, selectedExperience, selectedEmployment, selectedSchedule].filter(Boolean).length}
              </span>
            )}
          </Button>
        </div>

        {/* Панель фильтров */}
        {showFilters && (
          <div className="border-t border-border pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Фильтр по зарплате */}
              <div className="space-y-2">
                <Label htmlFor="salary">{t("vacanciesPage.minSalaryLabel")}</Label>
                <Input
                  id="salary"
                  type="number"
                  placeholder={t("vacanciesPage.minSalaryPlaceholder")}
                  value={minSalary}
                  onChange={(e) => setMinSalary(e.target.value)}
                />
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="only-with-salary"
                    checked={onlyWithSalary}
                    onCheckedChange={(checked) => setOnlyWithSalary(checked as boolean)}
                  />
                  <Label htmlFor="only-with-salary" className="text-sm font-normal cursor-pointer">
                    {t("vacanciesPage.onlyWithSalary")}
                  </Label>
                </div>
              </div>

              {/* Фильтр по опыту */}
              <div className="space-y-2">
                <Label htmlFor="experience">{t("vacanciesPage.experienceLabel")}</Label>
                <select
                  id="experience"
                  value={selectedExperience}
                  onChange={(e) => setSelectedExperience(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">{t("vacanciesPage.experienceAny")}</option>
                  <option value="noExperience">{t("vacanciesPage.experienceNo")}</option>
                  <option value="between1And3">{t("vacanciesPage.experience1to3")}</option>
                  <option value="between3And6">{t("vacanciesPage.experience3to6")}</option>
                  <option value="moreThan6">{t("vacanciesPage.experience6plus")}</option>
                </select>
              </div>

              {/* Фильтр по типу занятости */}
              <div className="space-y-2">
                <Label htmlFor="employment">{t("vacanciesPage.employmentLabel")}</Label>
                <select
                  id="employment"
                  value={selectedEmployment}
                  onChange={(e) => setSelectedEmployment(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">{t("vacanciesPage.employmentAny")}</option>
                  <option value="full">{t("vacanciesPage.employmentFull")}</option>
                  <option value="part">{t("vacanciesPage.employmentPart")}</option>
                  <option value="project">{t("vacanciesPage.employmentProject")}</option>
                  <option value="volunteer">{t("vacanciesPage.employmentVolunteer")}</option>
                  <option value="probation">{t("vacanciesPage.employmentProbation")}</option>
                </select>
              </div>

              {/* Фильтр по графику работы */}
              <div className="space-y-2">
                <Label htmlFor="schedule">{t("vacanciesPage.scheduleLabel")}</Label>
                <select
                  id="schedule"
                  value={selectedSchedule}
                  onChange={(e) => setSelectedSchedule(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">{t("vacanciesPage.scheduleAny")}</option>
                  <option value="fullDay">{t("vacanciesPage.scheduleFullDay")}</option>
                  <option value="shift">{t("vacanciesPage.scheduleShift")}</option>
                  <option value="flexible">{t("vacanciesPage.scheduleFlexible")}</option>
                  <option value="remote">{t("vacanciesPage.scheduleRemote")}</option>
                  <option value="flyInFlyOut">{t("vacanciesPage.scheduleFlyInFlyOut")}</option>
                </select>
              </div>
            </div>

            {/* Кнопки действий */}
            <div className="flex items-center gap-3 pt-4">
              <Button onClick={handleApplyFilters} className="flex items-center gap-2 bg-primary hover:bg-[#1e40af] dark:bg-[#60a5fa] dark:hover:bg-[#93c5fd]">
                <Search className="w-4 h-4" />
                {t("vacanciesPage.applyFilters")}
              </Button>
              {hasActiveFilters && (
                <Button variant="outline" onClick={handleResetFilters} className="flex items-center gap-2">
                  <X className="w-4 h-4" />
                  {t("vacanciesPage.resetFilters")}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Информация о результатах */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {t("vacanciesPage.foundCount")} <span className="font-semibold">{totalFound}</span>
        </p>
        <div className="flex items-center gap-2">
          <img
            src="https://hh.ru/favicon.ico"
            alt="HeadHunter"
            className="w-5 h-5"
          />
          <span className="text-sm text-muted-foreground">{t("vacanciesPage.dataSource")}</span>
        </div>
      </div>

      {/* Состояния загрузки и ошибок */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground mt-4">{t("vacanciesPage.loading")}</p>
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => fetchVacancies(currentPage)}>{t("vacanciesPage.retry")}</Button>
        </div>
      )}

      {!isLoading && !error && vacancies.length === 0 && (
        <div className="text-center py-12 rounded-2xl border border-border bg-card/50 px-6">
          <Briefcase className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          {hhBlocked ? (
            <>
              <p className="text-foreground font-medium mb-2">
                {t("vacanciesPage.listUnavailableTitle")}
              </p>
              <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
                {warning ?? t("vacanciesPage.listUnavailableDefault")}
              </p>
              <Button asChild size="lg">
                <a href={fallbackUrl} target="_blank" rel="noopener noreferrer">
                  {t("vacanciesPage.allOnHh")}
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </>
          ) : (
            <>
              <p className="text-muted-foreground mb-2">
                {hasActiveFilters
                  ? t("vacanciesPage.noResultsFiltered")
                  : t("vacanciesPage.noResultsEmpty")}
              </p>
              <a
                href={fallbackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-primary font-semibold hover:underline"
              >
                {t("vacanciesPage.checkOnHh")}
                <ExternalLink className="w-4 h-4" />
              </a>
              {hasActiveFilters && (
                <Button variant="outline" onClick={handleResetFilters} className="mt-4 ml-2">
                  {t("vacanciesPage.resetFilters")}
                </Button>
              )}
            </>
          )}
        </div>
      )}

      {/* Список вакансий */}
      {!isLoading && !error && vacancies.length > 0 && vacancies.map((vacancy) => (
        <div
          key={vacancy.id}
          className="group relative bg-card rounded-lg p-6 border border-border hover:border-primary/30 dark:hover:border-[#60a5fa]/30 hover:shadow-xl transition-all duration-200"
        >
          <div className="relative">
            {/* Заголовок и логотип */}
            <div className="flex items-start justify-between mb-5">
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2 text-primary dark:text-[#60a5fa]">{vacancy.name}</h3>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building className="w-4 h-4" />
                  <span className="text-sm">{vacancy.employer.name}</span>
                </div>
              </div>
              {vacancy.employer.logo_urls?.["90"] ? (
                <img
                  src={vacancy.employer.logo_urls["90"]}
                  alt={vacancy.employer.name}
                  className="w-16 h-16 rounded-lg object-contain p-2 bg-muted/30 border border-border"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-muted/50 flex items-center justify-center border border-border">
                  <Briefcase className="w-8 h-8 text-primary dark:text-[#60a5fa]" />
                </div>
              )}
            </div>

          {/* Краткое описание из snippet */}
          {(vacancy.snippet?.requirement || vacancy.snippet?.responsibility) && (
            <div className="mb-5 space-y-3 p-4 bg-muted/20 rounded-lg border border-border">
              {vacancy.snippet.requirement && (
                <div>
                  <h4 className="font-semibold text-sm text-foreground mb-1.5">
                    {t("vacanciesPage.requirements")}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{vacancy.snippet.requirement}</p>
                </div>
              )}
              {vacancy.snippet.responsibility && (
                <div>
                  <h4 className="font-semibold text-sm text-foreground mb-1.5">
                    {t("vacanciesPage.responsibilities")}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{vacancy.snippet.responsibility}</p>
                </div>
              )}
            </div>
          )}

          {/* Полное описание (если есть) */}
          {vacancy.description && (
            <div className="mb-4">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {stripHtml(vacancy.description)}
              </p>
            </div>
          )}

          {/* Ключевые навыки */}
          {vacancy.key_skills && vacancy.key_skills.length > 0 && (
            <div className="mb-5">
              <h4 className="font-semibold text-sm text-foreground mb-3">{t("vacanciesPage.keySkills")}</h4>
              <div className="flex flex-wrap gap-2">
                {vacancy.key_skills.slice(0, 6).map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-primary/5 dark:bg-[#60a5fa]/10 border border-primary/20 dark:border-[#60a5fa]/20 text-primary dark:text-[#93c5fd] text-xs font-medium rounded-md"
                  >
                    {skill.name}
                  </span>
                ))}
                {vacancy.key_skills.length > 6 && (
                  <span className="px-3 py-1.5 text-muted-foreground text-xs border border-border rounded-md">
                    +{vacancy.key_skills.length - 6} {t("vacanciesPage.moreSkills")}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Информация о вакансии */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-md border border-border">
              <MapPin className="w-4 h-4 text-primary dark:text-[#60a5fa]" />
              <span className="text-sm">
                {vacancy.area.name}
                {vacancy.address?.metro?.station_name &&
                  `, ${lang === "en" ? "metro" : "м."} ${vacancy.address.metro.station_name}`}
              </span>
            </div>

            {vacancy.salary && (
              <div className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-md border border-emerald-200 dark:border-emerald-800">
                <Banknote className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">{formatSalary(vacancy.salary)}</span>
              </div>
            )}

            {vacancy.schedule && (
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-md border border-border">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{vacancy.schedule.name}</span>
              </div>
            )}

            {vacancy.experience && (
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-md border border-border">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{t("vacanciesPage.experiencePrefix")} {vacancy.experience.name}</span>
              </div>
            )}
          </div>

          {/* Адрес */}
          {vacancy.address && (
            <div className="text-xs text-muted-foreground mb-4">
              {[
                vacancy.address.city,
                vacancy.address.street,
                vacancy.address.building,
              ]
                .filter(Boolean)
                .join(", ")}
            </div>
          )}

          {/* Кнопки действий */}
          <div className="flex gap-3">
            <Button
              onClick={() => {
                window.open(
                  vacancy.apply_alternate_url || vacancy.alternate_url,
                  "_blank"
                )
              }}
              className="flex-1 bg-primary hover:bg-[#1e40af] dark:bg-[#60a5fa] dark:hover:bg-[#93c5fd] text-white transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              {t("vacanciesPage.applyOnHh")}
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open(vacancy.alternate_url, "_blank")}
              className="border-border hover:bg-muted transition-colors"
            >
              {t("vacanciesPage.details")}
            </Button>
          </div>

          {/* Дата публикации */}
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {t("vacanciesPage.published")}{" "}
              {new Date(vacancy.published_at).toLocaleDateString(lang === "en" ? "en-US" : "ru-RU", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="text-primary dark:text-[#60a5fa] font-medium">ID: {vacancy.id}</span>
          </div>
        </div>
        </div>
      ))}

      {/* Пагинация */}
      {!isLoading && !error && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
          >
            {t("vacanciesPage.prev")}
          </Button>
          <span className="text-sm text-muted-foreground px-4">
            {t("vacanciesPage.pageOf")} {currentPage + 1} {t("vacanciesPage.of")} {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage >= totalPages - 1}
          >
            {t("vacanciesPage.next")}
          </Button>
        </div>
      )}
    </div>
  )
}
