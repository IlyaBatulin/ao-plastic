-- ============================================================
-- БАЗОВАЯ СХЕМА БД ДЛЯ МАГАЗИНА АО «ПЛАСТИК»
-- ============================================================

-- ========== КАТЕГОРИИ ==========
create table if not exists public.categories (
  id          text primary key,
  slug        text unique not null,
  name        text not null,
  description text,
  image       text,
  sort        integer default 0,
  is_active   boolean default true,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create index if not exists idx_categories_sort on public.categories(sort);
create index if not exists idx_categories_active on public.categories(is_active);

alter table public.categories enable row level security;

drop policy if exists "categories_select_public" on public.categories;
create policy "categories_select_public"
on public.categories
for select
to public
using (is_active = true);

comment on table public.categories is 'Категории продукции';

-- ========== ПОДКАТЕГОРИИ ==========
create table if not exists public.subcategories (
  id            text primary key,
  category_id   text not null references public.categories(id) on delete cascade,
  slug          text not null,
  name          text not null,
  description   text,
  sort          integer default 0,
  is_active     boolean default true,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now(),
  unique(category_id, slug)
);

create index if not exists idx_subcategories_category on public.subcategories(category_id);
create index if not exists idx_subcategories_active on public.subcategories(is_active);

alter table public.subcategories enable row level security;

drop policy if exists "subcategories_select_public" on public.subcategories;
create policy "subcategories_select_public"
on public.subcategories
for select
to public
using (is_active = true);

comment on table public.subcategories is 'Подкатегории продукции';

-- ========== ТОВАРЫ ==========
create table if not exists public.products (
  id                text primary key,
  category_id       text not null references public.categories(id) on delete cascade,
  subcategory_id    text references public.subcategories(id) on delete set null,
  slug              text unique not null,
  name              text not null,
  description       text,
  brand             text,
  type              text,
  image             text,
  specifications    jsonb,
  sort              integer default 0,
  is_active         boolean default true,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

create index if not exists idx_products_category on public.products(category_id);
create index if not exists idx_products_subcategory on public.products(subcategory_id);
create index if not exists idx_products_active on public.products(is_active);

alter table public.products enable row level security;

drop policy if exists "products_select_public" on public.products;
create policy "products_select_public"
on public.products
for select
to public
using (is_active = true);

comment on table public.products is 'Товары';

-- ========== МЕНЕДЖЕРЫ ==========
create table if not exists public.managers (
  id          bigserial primary key,
  name        text not null,
  tg_chat_id  text,
  email       text,
  phone       text,
  is_active   boolean default true,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create index if not exists idx_managers_active on public.managers(is_active);

alter table public.managers enable row level security;

drop policy if exists "managers_select_auth" on public.managers;
create policy "managers_select_auth"
on public.managers
for select
to authenticated
using (true);

comment on table public.managers is 'Менеджеры для распределения заказов';

-- ========== ПРАВИЛА МАРШРУТИЗАЦИИ ==========
create table if not exists public.routing_rules (
  id              bigserial primary key,
  category_id     text references public.categories(id) on delete cascade,
  subcategory_id  text references public.subcategories(id) on delete cascade,
  tag_id          text,
  manager_id      bigint not null references public.managers(id) on delete cascade,
  priority        integer default 100,
  is_active       boolean default true,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create index if not exists idx_routing_rules_category on public.routing_rules(category_id);
create index if not exists idx_routing_rules_subcategory on public.routing_rules(subcategory_id);
create index if not exists idx_routing_rules_manager on public.routing_rules(manager_id);
create index if not exists idx_routing_rules_active on public.routing_rules(is_active, priority);

alter table public.routing_rules enable row level security;

drop policy if exists "routing_rules_select_auth" on public.routing_rules;
create policy "routing_rules_select_auth"
on public.routing_rules
for select
to authenticated
using (true);

comment on table public.routing_rules is 'Правила распределения заказов между менеджерами';

-- ========== ЗАКАЗЫ ==========
create table if not exists public.orders (
  id              bigserial primary key,
  customer_name   text,
  customer_phone  text,
  customer_email  text,
  comment         text,
  manager_id      bigint references public.managers(id) on delete set null,
  payload         jsonb,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create index if not exists idx_orders_manager on public.orders(manager_id);
create index if not exists idx_orders_created on public.orders(created_at desc);

alter table public.orders enable row level security;

-- Публичная вставка заказов (через API)
drop policy if exists "orders_insert_public" on public.orders;
create policy "orders_insert_public"
on public.orders
for insert
to public
with check (true);

-- Чтение только для authenticated
drop policy if exists "orders_select_auth" on public.orders;
create policy "orders_select_auth"
on public.orders
for select
to authenticated
using (true);

comment on table public.orders is 'Заказы клиентов';

-- ========== ПОЗИЦИИ ЗАКАЗА ==========
create table if not exists public.order_items (
  id              bigserial primary key,
  order_id        bigint not null references public.orders(id) on delete cascade,
  product_id      text references public.products(id) on delete set null,
  category_id     text references public.categories(id) on delete set null,
  subcategory_id  text references public.subcategories(id) on delete set null,
  quantity        numeric(18,3) not null default 1,
  price           numeric(18,2),
  manager_id      bigint references public.managers(id) on delete set null,
  created_at      timestamptz default now()
);

create index if not exists idx_order_items_order on public.order_items(order_id);
create index if not exists idx_order_items_manager on public.order_items(manager_id);

comment on table public.order_items is 'Позиции заказа';

alter table public.order_items enable row level security;

-- Публичная вставка позиций
drop policy if exists "order_items_insert_public" on public.order_items;
create policy "order_items_insert_public"
on public.order_items
for insert
to public
with check (manager_id is null);

-- Чтение только для authenticated
drop policy if exists "order_items_select_auth" on public.order_items;
create policy "order_items_select_auth"
on public.order_items
for select
to authenticated
using (true);

-- ========== ФУНКЦИЯ НАЗНАЧЕНИЯ МЕНЕДЖЕРА ДЛЯ ЗАКАЗА ==========
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

-- Готово!

