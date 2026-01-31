"use client"

import { VacanciesClient } from "./vacancies-client"
import { HHVacanciesClient } from "./hh-vacancies-client"

export function VacanciesSwitcher() {
  return (
    <div className="w-full">
      {/* Показываем только вакансии с HeadHunter */}
      <HHVacanciesClient />
      
      {/* Внутренние вакансии скрыты, но компонент сохранен */}
      <div className="hidden">
        <VacanciesClient />
      </div>
    </div>
  )
}
