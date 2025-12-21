-- ============================================================
-- МИГРАЦИЯ: Перенос канистр и ящиков в категорию ТНП
-- ============================================================
-- 1. Создание подкатегорий "Канистры" и "Ящики" в категории hoztovary
-- 2. Перенос товаров из категорий canisters и boxes в hoztovary
-- 3. Деактивация категорий canisters и boxes

-- ========== ШАГ 1: Создание подкатегорий ==========
INSERT INTO public.subcategories (id, category_id, slug, name, description, image, sort, is_active, created_at)
VALUES
  -- Канистры
  ('canisters', 'hoztovary', 'canisters', 'Канистры', 
   'Пластиковые канистры различного объема (3л, 5л, 10л, 20л, 30л) для хранения жидкостей',
   '/images/products/canisters.jpg', 80, true, NOW()),
  -- Ящики
  ('boxes', 'hoztovary', 'boxes', 'Ящики',
   'Пластиковые ящики для хранения и транспортировки (под заказ)',
   '/images/products/boxes.jpg', 90, true, NOW())
ON CONFLICT (id) DO UPDATE
SET 
  category_id = EXCLUDED.category_id,
  slug = EXCLUDED.slug,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  sort = EXCLUDED.sort,
  is_active = EXCLUDED.is_active;

-- ========== ШАГ 2: Перенос товаров из canisters в hoztovary ==========
UPDATE public.products
SET 
  category_id = 'hoztovary',
  subcategory_id = 'canisters'
WHERE category_id = 'canisters';

-- ========== ШАГ 3: Перенос товаров из boxes в hoztovary ==========
UPDATE public.products
SET 
  category_id = 'hoztovary',
  subcategory_id = 'boxes'
WHERE category_id = 'boxes';

-- ========== ШАГ 4: Деактивация категорий canisters и boxes ==========
UPDATE public.categories
SET is_active = false
WHERE id IN ('canisters', 'boxes');

-- ========== ШАГ 5: Обновление описания категории hoztovary ==========
UPDATE public.categories
SET 
  target_application = 'Бытовые товары для дома, кухни, санузла, уборки и отдыха, канистры и ящики для хранения'
WHERE id = 'hoztovary';

-- Готово!

