-- ============================================================
-- Исправление RLS политик для contact_messages
-- Используем тот же подход, что и для orders (to public)
-- ============================================================

-- Удаляем все старые политики
drop policy if exists "contact_messages_insert_public" on public.contact_messages;
drop policy if exists "contact_messages_select_service" on public.contact_messages;

-- Публичная вставка (как для orders)
create policy "contact_messages_insert_public"
on public.contact_messages
for insert
to public
with check (true);

-- SELECT только для service_role (админка)
create policy "contact_messages_select_service"
on public.contact_messages
for select
to service_role
using (true);

