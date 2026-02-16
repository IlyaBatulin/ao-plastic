-- ============================================================
-- МИГРАЦИЯ: Добавление товаров подкатегории "Канистры"
-- ============================================================
-- Подкатегория canisters уже есть в subcategories (category_id = hoztovary).
-- Товары канистр из data/products.json никогда не вставлялись в products.
-- Эта миграция добавляет их.

-- Канистра 3 л
INSERT INTO public.products (
  id, category_id, subcategory_id, slug, name, brand, type, description, image, specifications, sort, is_active
)
VALUES (
  'canister-3l', 'hoztovary', 'canisters', 'canister-3l',
  'Канистра 3 л', 'К-3', 'Выдувное изделие',
  'Компактная пластиковая канистра малого объема',
  '/images/xoztov/kanistra.jpeg',
  '{"Материал": "ПНД", "Объем": "3 л", "Цвет": "Белый, синий", "Применение": "Хранение малых объемов жидкостей"}'::jsonb,
  1, true
)
ON CONFLICT (id) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  subcategory_id = EXCLUDED.subcategory_id,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  specifications = EXCLUDED.specifications;

-- Канистра 5 л
INSERT INTO public.products (
  id, category_id, subcategory_id, slug, name, brand, type, description, image, specifications, sort, is_active
)
VALUES (
  'canister-5l', 'hoztovary', 'canisters', 'canister-5l',
  'Канистра 5 л', 'К-5', 'Выдувное изделие',
  'Пластиковая канистра для хранения жидкостей',
  '/images/xoztov/kanistra.jpeg',
  '{"Материал": "ПНД", "Объем": "5 л", "Цвет": "Белый, синий", "Применение": "Хранение жидкостей"}'::jsonb,
  2, true
)
ON CONFLICT (id) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  subcategory_id = EXCLUDED.subcategory_id,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  specifications = EXCLUDED.specifications;

-- Канистра 10 л
INSERT INTO public.products (
  id, category_id, subcategory_id, slug, name, brand, type, description, image, specifications, sort, is_active
)
VALUES (
  'canister-10l', 'hoztovary', 'canisters', 'canister-10l',
  'Канистра 10 л', 'К-10', 'Выдувное изделие',
  'Пластиковая канистра среднего объема',
  '/images/xoztov/kanistra.jpeg',
  '{"Материал": "ПНД", "Объем": "10 л", "Цвет": "Белый, синий", "Применение": "Хранение и транспортировка жидкостей"}'::jsonb,
  3, true
)
ON CONFLICT (id) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  subcategory_id = EXCLUDED.subcategory_id,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  specifications = EXCLUDED.specifications;

-- Канистра 20 л
INSERT INTO public.products (
  id, category_id, subcategory_id, slug, name, brand, type, description, image, specifications, sort, is_active
)
VALUES (
  'canister-20l', 'hoztovary', 'canisters', 'canister-20l',
  'Канистра 20 л', 'К-20', 'Выдувное изделие',
  'Промышленная канистра большого объема',
  '/images/xoztov/kanistra.jpeg',
  '{"Материал": "ПНД", "Объем": "20 л", "Цвет": "Белый", "Применение": "Промышленное хранение и транспортировка"}'::jsonb,
  4, true
)
ON CONFLICT (id) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  subcategory_id = EXCLUDED.subcategory_id,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  specifications = EXCLUDED.specifications;

-- Канистра 30 л
INSERT INTO public.products (
  id, category_id, subcategory_id, slug, name, brand, type, description, image, specifications, sort, is_active
)
VALUES (
  'canister-30l', 'hoztovary', 'canisters', 'canister-30l',
  'Канистра 30 л', 'К-30', 'Выдувное изделие',
  'Промышленная канистра увеличенного объема',
  '/images/xoztov/kanistra.jpeg',
  '{"Материал": "ПНД", "Объем": "30 л", "Цвет": "Белый", "Применение": "Промышленное хранение и транспортировка больших объемов"}'::jsonb,
  5, true
)
ON CONFLICT (id) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  subcategory_id = EXCLUDED.subcategory_id,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  specifications = EXCLUDED.specifications;

-- Фото подкатегории "Канистры" на карточке категории
UPDATE public.subcategories
SET image = '/images/xoztov/kanistra.jpeg'
WHERE id = 'canisters';

-- Готово!
