-- ============================================================
-- Создание таблицы сообщений с сайта
-- ============================================================

create table if not exists public.contact_messages (
  id            bigserial primary key,
  source        text not null, -- 'contacts' или 'homepage'
  name          text not null,
  email         text not null,
  phone         text,
  message       text not null,
  status        text default 'new', -- new, read, replied, archived
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create index if not exists idx_contact_messages_source on public.contact_messages(source);
create index if not exists idx_contact_messages_status on public.contact_messages(status);
create index if not exists idx_contact_messages_created on public.contact_messages(created_at);

alter table public.contact_messages enable row level security;

-- Публичный доступ для создания сообщений
drop policy if exists "contact_messages_insert_public" on public.contact_messages;
create policy "contact_messages_insert_public"
on public.contact_messages
for insert
to public
with check (true);

-- SELECT только для service_role (админка)
drop policy if exists "contact_messages_select_service" on public.contact_messages;
create policy "contact_messages_select_service"
on public.contact_messages
for select
to service_role
using (true);

comment on table public.contact_messages is 'Сообщения с сайта (формы обратной связи)';

