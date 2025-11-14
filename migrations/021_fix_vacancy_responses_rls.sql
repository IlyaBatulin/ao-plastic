-- ============================================================
-- Исправление RLS политик для vacancy_responses
-- ============================================================

-- Удаляем старую политику
drop policy if exists "vacancy_responses_insert_public" on public.vacancy_responses;

-- Создаем правильную политику для вставки (для анонимных и авторизованных пользователей)
create policy "vacancy_responses_insert_public"
on public.vacancy_responses
for insert
to anon, authenticated
with check (true);

-- Также добавляем политику для SELECT через service_role (для админки)
drop policy if exists "vacancy_responses_select_admin" on public.vacancy_responses;
create policy "vacancy_responses_select_admin"
on public.vacancy_responses
for select
to service_role
using (true);

