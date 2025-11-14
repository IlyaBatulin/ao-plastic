-- ============================================================
-- Создание таблицы запросов предложений (RFP - Request for Proposal)
-- ============================================================

create table if not exists public.rfp_requests (
  id            bigserial primary key,
  request_number text not null unique, -- REQ-001, REQ-002 и т.д.
  title         text not null,
  description   text,
  details       text, -- Детали запроса (можно хранить как JSON или текст)
  deadline      text, -- Срок подачи предложений (текст, например "до 15.12.2024")
  customer      text default 'АО «Пластик»', -- Заказчик
  is_active     boolean default true,
  sort          integer default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create index if not exists idx_rfp_requests_active on public.rfp_requests(is_active);
create index if not exists idx_rfp_requests_sort on public.rfp_requests(sort);
create index if not exists idx_rfp_requests_number on public.rfp_requests(request_number);

alter table public.rfp_requests enable row level security;

-- Публичный доступ для чтения активных запросов
drop policy if exists "rfp_requests_select_public" on public.rfp_requests;
create policy "rfp_requests_select_public"
on public.rfp_requests
for select
to public
using (is_active = true);

-- Полный доступ для админов (через service_role)
drop policy if exists "rfp_requests_all_admin" on public.rfp_requests;
create policy "rfp_requests_all_admin"
on public.rfp_requests
for all
to service_role
using (true)
with check (true);

comment on table public.rfp_requests is 'Запросы предложений для поставщиков';

