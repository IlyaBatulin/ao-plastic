-- ============================================================
-- МИГРАЦИЯ: Корзина с распределением менеджеров по позициям
-- ============================================================

-- ========== Позиции заказа (корзина) ==========
create table if not exists public.order_items (
  id              bigserial primary key,
  order_id        bigint not null references public.orders(id) on delete cascade,
  product_id      text references public.products(id) on delete set null,
  category_id     text references public.categories(id) on delete set null,
  subcategory_id  text references public.subcategories(id) on delete set null,
  quantity        numeric(18,3) not null default 1,
  price           numeric(18,2),       -- цена на момент заказа (snapshot)
  manager_id      bigint references public.managers(id) on delete set null, -- менеджер этой позиции
  created_at      timestamptz default now()
);

create index if not exists idx_order_items_order on public.order_items(order_id);
create index if not exists idx_order_items_manager on public.order_items(manager_id);

comment on table public.order_items is 'Позиции заказа (корзина): каждая позиция может иметь своего менеджера';

alter table public.order_items enable row level security;

-- Публичная вставка позиций (через API заказа)
drop policy if exists "order_items_insert_public" on public.order_items;
create policy "order_items_insert_public"
on public.order_items
for insert
to public
with check (
  manager_id is null  -- назначается автоматически
);

-- Чтение только для authenticated
drop policy if exists "order_items_select_auth" on public.order_items;
create policy "order_items_select_auth"
on public.order_items
for select
to authenticated
using (true);

-- ========== ОБНОВЛЕННАЯ функция назначения менеджера для корзины ==========
create or replace function public.assign_manager_to_order(p_order_id bigint)
returns bigint as $$
declare
  v_order record;
  v_item   record;
  v_rule   record;
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
      and r.subcategory_id is null  -- только категория
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

-- Триггер: после вставки order_items назначаем менеджеров
create or replace function public.fn_on_order_items_insert()
returns trigger as $$
begin
  -- Вызываем назначение менеджеров для всего заказа
  perform public.assign_manager_to_order(new.order_id);
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_order_items_insert on public.order_items;
create trigger trg_order_items_insert
after insert on public.order_items
for each row execute function public.fn_on_order_items_insert();

comment on function public.assign_manager_to_order is 'Назначает главного менеджера заказа (по приоритетной категории) и менеджеров для каждой позиции корзины';

-- Готово!
