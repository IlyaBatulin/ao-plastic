-- ============================================================
-- Создание таблицы ответов на запросы предложений (RFP)
-- ============================================================

create table if not exists public.rfp_responses (
  id            bigserial primary key,
  rfp_request_id bigint not null references public.rfp_requests(id) on delete cascade,
  company_name  text not null,
  email         text not null,
  phone         text,
  message       text, -- Условия поставки, цена и т.д.
  proposal_url  text, -- URL к коммерческому предложению (если загружено)
  status        text default 'new', -- new, reviewed, accepted, rejected
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create index if not exists idx_rfp_responses_rfp on public.rfp_responses(rfp_request_id);
create index if not exists idx_rfp_responses_status on public.rfp_responses(status);
create index if not exists idx_rfp_responses_created on public.rfp_responses(created_at);

alter table public.rfp_responses enable row level security;

-- Только админы могут видеть ответы
drop policy if exists "rfp_responses_select_admin" on public.rfp_responses;
create policy "rfp_responses_select_admin"
on public.rfp_responses
for select
to service_role
using (true);

-- Публичный доступ для создания ответов
drop policy if exists "rfp_responses_insert_public" on public.rfp_responses;
create policy "rfp_responses_insert_public"
on public.rfp_responses
for insert
to public
with check (true);

comment on table public.rfp_responses is 'Ответы на запросы предложений';

