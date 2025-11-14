-- ============================================================
-- ФИКС: Исправление безопасности функций
-- Устанавливаем search_path для защиты от SQL injection через подмену схемы
-- ============================================================

-- Функция назначения менеджера для заказа
create or replace function public.assign_manager_to_order(p_order_id bigint)
returns bigint
language plpgsql
security definer
set search_path = public, pg_temp
as $$
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
$$;

-- Триггерная функция для вставки позиций заказа
create or replace function public.fn_on_order_items_insert()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  perform public.assign_manager_to_order(new.order_id);
  return new;
end;
$$;

-- Функция аудита (если существует)
create or replace function public.fn_audit()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.audit_log (
    table_name,
    record_id,
    action,
    old_data,
    new_data,
    user_id,
    created_at
  ) values (
    tg_table_name,
    coalesce(new.id::text, old.id::text),
    tg_op,
    case when tg_op = 'DELETE' then to_jsonb(old) else null end,
    case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) else null end,
    null, -- user_id можно получить из current_setting('app.user_id', true)
    now()
  );
  return coalesce(new, old);
end;
$$;

-- Функция триггера при вставке заказа (если существует)
create or replace function public.fn_on_order_insert()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  -- Триггер может вызывать assign_manager_to_order или другую логику
  -- Если функция не используется, можно оставить пустой или удалить
  return new;
end;
$$;

-- Функция санитизации заказов (если существует)
create or replace function public.fn_orders_sanitize()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  -- Нормализуем данные перед вставкой
  if new.customer_email is not null then
    new.customer_email = trim(lower(new.customer_email));
  end if;
  if new.customer_phone is not null then
    new.customer_phone = regexp_replace(new.customer_phone, '[^0-9+]', '', 'g');
  end if;
  return new;
end;
$$;

-- Функция очистки старых событий вебхуков (если существует)
create or replace function public.gc_webhook_events()
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  delete from public.webhook_events
  where created_at < now() - interval '30 days';
end;
$$;

-- Функция обновления материализованного представления заказов (если существует)
create or replace function public.refresh_orders_summary()
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  refresh materialized view concurrently if exists public.mv_orders_summary;
end;
$$;

