-- ============================================================
-- Исправление RLS политик для rfp_responses
-- ============================================================

-- Удаляем старую политику
drop policy if exists "rfp_responses_insert_public" on public.rfp_responses;

-- Создаем правильную политику для вставки (для анонимных и авторизованных пользователей)
create policy "rfp_responses_insert_public"
on public.rfp_responses
for insert
to anon, authenticated
with check (true);

-- Также добавляем политику для SELECT через service_role (для админки)
drop policy if exists "rfp_responses_select_admin" on public.rfp_responses;
create policy "rfp_responses_select_admin"
on public.rfp_responses
for select
to service_role
using (true);

