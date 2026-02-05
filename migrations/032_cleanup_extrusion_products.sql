-- ============================================================
-- УДАЛЕНИЕ ТАБЛИЦЫ extrusion_products (если была создана вручную)
-- ============================================================

-- Удаляем таблицу если она существует
DROP TABLE IF EXISTS public.extrusion_products CASCADE;

-- Удаляем возможные индексы
DROP INDEX IF EXISTS idx_extrusion_products_type;
DROP INDEX IF EXISTS idx_extrusion_products_code;
DROP INDEX IF EXISTS idx_extrusion_products_length_kind;
DROP INDEX IF EXISTS idx_extrusion_products_source_no;

-- Комментарий
COMMENT ON SCHEMA public IS 'Очистка перед созданием правильной таблицы extrusion_products';
