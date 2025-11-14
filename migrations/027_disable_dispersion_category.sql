-- ============================================================
-- ОТКЛЮЧЕНИЕ: Категория "Дисперсия стирол-акриловая" (dispersion)
-- ============================================================
-- Отключаем категорию dispersion и все связанные подкатегории и товары

-- 1. Отключаем все товары категории dispersion
UPDATE public.products
SET is_active = false,
    updated_at = NOW()
WHERE category_id = 'dispersion';

-- 2. Отключаем все подкатегории категории dispersion
UPDATE public.subcategories
SET is_active = false,
    updated_at = NOW()
WHERE category_id = 'dispersion';

-- 3. Отключаем саму категорию dispersion
UPDATE public.categories
SET is_active = false,
    updated_at = NOW()
WHERE id = 'dispersion';

-- Проверка: выводим статус категории и связанных записей
SELECT 
  'Category' as type,
  id,
  name,
  is_active
FROM public.categories
WHERE id = 'dispersion'

UNION ALL

SELECT 
  'Subcategory' as type,
  id,
  name,
  is_active
FROM public.subcategories
WHERE category_id = 'dispersion'

UNION ALL

SELECT 
  'Product' as type,
  id,
  name,
  is_active
FROM public.products
WHERE category_id = 'dispersion';

