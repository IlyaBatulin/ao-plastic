-- ============================================================
-- Создание таблицы вакансий
-- ============================================================

create table if not exists public.vacancies (
  id          bigserial primary key,
  title       text not null,
  department  text,
  location    text,
  type        text, -- Полная занятость, Частичная занятость, Удаленная работа
  description text,
  requirements text, -- Требования
  responsibilities text, -- Обязанности
  conditions  text, -- Условия работы
  salary      text, -- Зарплата (текст, например "от 50000 руб")
  is_active   boolean default true,
  sort        integer default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create index if not exists idx_vacancies_active on public.vacancies(is_active);
create index if not exists idx_vacancies_sort on public.vacancies(sort);

alter table public.vacancies enable row level security;

-- Публичный доступ для чтения активных вакансий
drop policy if exists "vacancies_select_public" on public.vacancies;
create policy "vacancies_select_public"
on public.vacancies
for select
to public
using (is_active = true);

-- Полный доступ для админов (через service_role)
drop policy if exists "vacancies_all_admin" on public.vacancies;
create policy "vacancies_all_admin"
on public.vacancies
for all
to service_role
using (true)
with check (true);

comment on table public.vacancies is 'Вакансии компании';

