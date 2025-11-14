-- ============================================================
-- Создание таблицы ответов на вакансии
-- ============================================================

create table if not exists public.vacancy_responses (
  id            bigserial primary key,
  vacancy_id    bigint not null references public.vacancies(id) on delete cascade,
  company_name  text,
  email         text not null,
  phone         text,
  message       text,
  resume_url    text, -- URL к резюме (если загружено)
  status        text default 'new', -- new, reviewed, contacted, rejected
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create index if not exists idx_vacancy_responses_vacancy on public.vacancy_responses(vacancy_id);
create index if not exists idx_vacancy_responses_status on public.vacancy_responses(status);
create index if not exists idx_vacancy_responses_created on public.vacancy_responses(created_at);

alter table public.vacancy_responses enable row level security;

-- Только админы могут видеть ответы
drop policy if exists "vacancy_responses_select_admin" on public.vacancy_responses;
create policy "vacancy_responses_select_admin"
on public.vacancy_responses
for select
to service_role
using (true);

-- Публичный доступ для создания ответов
drop policy if exists "vacancy_responses_insert_public" on public.vacancy_responses;
create policy "vacancy_responses_insert_public"
on public.vacancy_responses
for insert
to public
with check (true);

comment on table public.vacancy_responses is 'Ответы на вакансии';

