-- ============================================================
-- Создание таблицы новостей
-- ============================================================

create table if not exists public.news (
  id          bigserial primary key,
  title       text not null,
  slug        text unique,
  excerpt     text,
  content     text,
  image_url   text,
  published_at timestamptz,
  is_active   boolean default true,
  sort        integer default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create index if not exists idx_news_active on public.news(is_active);
create index if not exists idx_news_published on public.news(published_at);
create index if not exists idx_news_sort on public.news(sort);

alter table public.news enable row level security;

-- Публичный доступ для чтения активных новостей
drop policy if exists "news_select_public" on public.news;
create policy "news_select_public"
on public.news
for select
to public
using (is_active = true);

-- Полный доступ для админов (через service_role)
drop policy if exists "news_all_admin" on public.news;
create policy "news_all_admin"
on public.news
for all
to service_role
using (true)
with check (true);

comment on table public.news is 'Новости компании';
