-- ============================================================
-- ОТКЛЮЧЕНИЕ: Категории "Каски защитные" и "Маски медицинские"
-- ============================================================
-- Отключаем категории helmets и masks, так как они больше не нужны

-- Отключаем категорию "Каски защитные"
UPDATE public.categories
SET is_active = false
WHERE id = 'helmets';

-- Отключаем категорию "Маски медицинские"
UPDATE public.categories
SET is_active = false
WHERE id = 'masks';

-- Также отключаем все подкатегории этих категорий (если есть)
UPDATE public.subcategories
SET is_active = false
WHERE category_id = 'helmets' OR category_id = 'masks';

-- Отключаем все товары этих категорий
UPDATE public.products
SET is_active = false
WHERE category_id = 'helmets' OR category_id = 'masks';

-- Проверяем результат
SELECT id, name, slug, is_active
FROM public.categories
WHERE id IN ('helmets', 'masks');

