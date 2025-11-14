-- ============================================================
-- Финальное исправление RLS политик для responses таблиц
-- Используем тот же подход, что и для orders (to public)
-- ============================================================

-- ========== ФИКС ДЛЯ rfp_responses ==========
-- Удаляем все старые политики
drop policy if exists "rfp_responses_insert_public" on public.rfp_responses;
drop policy if exists "rfp_responses_select_admin" on public.rfp_responses;

-- Публичная вставка (как для orders)
create policy "rfp_responses_insert_public"
on public.rfp_responses
for insert
to public
with check (true);

-- SELECT только для service_role (админка)
create policy "rfp_responses_select_service"
on public.rfp_responses
for select
to service_role
using (true);

-- ========== ФИКС ДЛЯ vacancy_responses ==========
-- Удаляем все старые политики
drop policy if exists "vacancy_responses_insert_public" on public.vacancy_responses;
drop policy if exists "vacancy_responses_select_admin" on public.vacancy_responses;

-- Публичная вставка (как для orders)
create policy "vacancy_responses_insert_public"
on public.vacancy_responses
for insert
to public
with check (true);

-- SELECT только для service_role (админка)
create policy "vacancy_responses_select_service"
on public.vacancy_responses
for select
to service_role
using (true);

