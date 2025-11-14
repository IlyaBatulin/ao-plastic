-- ============================================================
-- Добавляем недостающие колонки в таблицу products
-- ============================================================

-- Добавляем все необходимые колонки
alter table public.products
add column if not exists description text,
add column if not exists brand text,
add column if not exists type text,
add column if not exists image text,
add column if not exists specifications jsonb,
add column if not exists sort integer default 0;

-- Обновляем is_active если его нет
alter table public.products
add column if not exists is_active boolean default true;

-- Проверка структуры таблицы
select 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
from information_schema.columns
where table_schema = 'public' 
  and table_name = 'products'
order by ordinal_position;

