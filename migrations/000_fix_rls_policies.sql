-- ============================================================
-- ФИКС: Включаем RLS и добавляем политики для orders и order_items
-- Примените ЭТУ миграцию ПЕРВОЙ, если таблицы уже существуют
-- ============================================================

-- ========== ФИКС ДЛЯ ТАБЛИЦЫ orders ==========
-- Включаем RLS, если еще не включен
alter table if exists public.orders enable row level security;

-- Удаляем старые политики если есть
drop policy if exists "orders_insert_public" on public.orders;
drop policy if exists "orders_select_public" on public.orders;
drop policy if exists "orders_select_auth" on public.orders;

-- Добавляем публичную политику для вставки заказов (обязательно!)
create policy "orders_insert_public"
on public.orders
for insert
to public
with check (true);

-- Чтение только для authenticated
create policy "orders_select_auth"
on public.orders
for select
to authenticated
using (true);

-- ========== ФИКС ДЛЯ ТАБЛИЦЫ order_items ==========
-- Включаем RLS, если еще не включен
alter table if exists public.order_items enable row level security;

-- Удаляем старые политики если есть
drop policy if exists "order_items_insert_public" on public.order_items;
drop policy if exists "order_items_select_public" on public.order_items;
drop policy if exists "order_items_select_auth" on public.order_items;

-- Публичная вставка позиций
create policy "order_items_insert_public"
on public.order_items
for insert
to public
with check (manager_id is null);

-- Чтение только для authenticated
create policy "order_items_select_auth"
on public.order_items
for select
to authenticated
using (true);

-- ========== ФИКС ДЛЯ ОСТАЛЬНЫХ ТАБЛИЦ (если они уже существуют) ==========
alter table if exists public.audit_log enable row level security;
alter table if exists public.customers enable row level security;
alter table if exists public.webhook_events enable row level security;
alter table if exists public.categories enable row level security;
alter table if exists public.subcategories enable row level security;
alter table if exists public.products enable row level security;
alter table if exists public.managers enable row level security;
alter table if exists public.routing_rules enable row level security;

-- Политики для audit_log (триггеры пишут сюда, нужна полная свобода)
drop policy if exists "audit_log_insert_public" on public.audit_log;
create policy "audit_log_insert_public"
on public.audit_log
for insert
to public
with check (true);

drop policy if exists "audit_log_select_auth" on public.audit_log;
create policy "audit_log_select_auth"
on public.audit_log
for select
to authenticated
using (true);

-- Политики для customers
drop policy if exists "customers_select_auth" on public.customers;
create policy "customers_select_auth"
on public.customers
for select
to authenticated
using (true);

drop policy if exists "customers_insert_service" on public.customers;
create policy "customers_insert_service"
on public.customers
for insert
to service_role
with check (true);

-- Политики для webhook_events (триггеры пишут сюда, нужна полная свобода)
drop policy if exists "webhook_events_insert_public" on public.webhook_events;
create policy "webhook_events_insert_public"
on public.webhook_events
for insert
to public
with check (true);

drop policy if exists "webhook_events_select_auth" on public.webhook_events;
create policy "webhook_events_select_auth"
on public.webhook_events
for select
to authenticated
using (true);

-- Политики для categories
drop policy if exists "categories_select_public" on public.categories;
create policy "categories_select_public"
on public.categories
for select
to public
using (is_active = true);

-- Политики для subcategories
drop policy if exists "subcategories_select_public" on public.subcategories;
create policy "subcategories_select_public"
on public.subcategories
for select
to public
using (is_active = true);

-- Политики для products
drop policy if exists "products_select_public" on public.products;
create policy "products_select_public"
on public.products
for select
to public
using (
  (is_active = true OR is_active IS NULL)
  AND (status = 'active' OR status IS NULL)
);

-- Политики для managers
drop policy if exists "managers_select_auth" on public.managers;
create policy "managers_select_auth"
on public.managers
for select
to authenticated
using (true);

-- Политики для routing_rules
drop policy if exists "routing_rules_select_auth" on public.routing_rules;
create policy "routing_rules_select_auth"
on public.routing_rules
for select
to authenticated
using (true);

-- ========== ФУНКЦИЯ НАЗНАЧЕНИЯ МЕНЕДЖЕРА (если не существует) ==========
create or replace function public.assign_manager_to_order(p_order_id bigint)
returns bigint as $$
declare
  v_order record;
  v_item   record;
  v_category_counts jsonb;
  v_main_category   text;
  v_main_manager_id bigint;
  v_item_manager_id bigint;
begin
  select * into v_order from public.orders where id = p_order_id;

  -- Собираем статистику по категориям в корзине
  select jsonb_object_agg(category_id, cnt)
  into v_category_counts
  from (
    select category_id, count(*) as cnt
    from public.order_items
    where order_id = p_order_id and category_id is not null
    group by category_id
  ) t;

  -- Находим категорию с максимальным количеством позиций (приоритет)
  if v_category_counts is not null then
    select key into v_main_category
    from jsonb_each(v_category_counts)
    order by value::int desc
    limit 1;
  end if;

  -- Назначаем главного менеджера по приоритетной категории
  if v_main_category is not null then
    select manager_id into v_main_manager_id
    from public.routing_rules r
    where r.is_active = true
      and r.category_id = v_main_category
      and r.subcategory_id is null
      and r.tag_id is null
    order by r.priority asc
    limit 1;
  end if;

  -- Обновляем главного менеджера заказа
  if v_main_manager_id is not null then
    update public.orders
    set manager_id = v_main_manager_id
    where id = p_order_id;
  end if;

  -- Назначаем менеджера каждой позиции корзины
  for v_item in select * from public.order_items where order_id = p_order_id loop
    -- Ищем правило для категории/подкатегории позиции
    select manager_id into v_item_manager_id
    from public.routing_rules r
    where r.is_active = true
      and (r.category_id is null or r.category_id = v_item.category_id)
      and (r.subcategory_id is null or r.subcategory_id = v_item.subcategory_id)
      and r.tag_id is null
    order by r.priority asc
    limit 1;

    -- Назначаем менеджера позиции
    if v_item_manager_id is not null then
      update public.order_items
      set manager_id = v_item_manager_id
      where id = v_item.id;
    end if;
  end loop;

  return v_main_manager_id;
end;
$$ language plpgsql;

-- ========== ТРИГГЕР НАЗНАЧЕНИЯ МЕНЕДЖЕРОВ ==========
create or replace function public.fn_on_order_items_insert()
returns trigger as $$
begin
  perform public.assign_manager_to_order(new.order_id);
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_order_items_insert on public.order_items;
create trigger trg_order_items_insert
after insert on public.order_items
for each row execute function public.fn_on_order_items_insert();

comment on function public.assign_manager_to_order is 'Назначает главного менеджера заказа (по приоритетной категории) и менеджеров для каждой позиции корзины';

-- Готово! Теперь можно создавать заказы через API
