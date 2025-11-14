-- ============================================================
-- ОТКЛЮЧЕНИЕ: Подкатегория "Технические характеристики АБС" (abs-specs)
-- ============================================================
-- Отключаем подкатегорию abs-specs, так как она больше не нужна

UPDATE public.subcategories
SET is_active = false
WHERE id = 'abs-specs' AND category_id = 'abs';

-- Проверяем результат
SELECT id, name, slug, is_active
FROM public.subcategories
WHERE id = 'abs-specs';

