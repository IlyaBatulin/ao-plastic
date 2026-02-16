-- ============================================================
-- МИГРАЦИЯ: Добавление товаров подкатегории "Ящики"
-- ============================================================
-- Подкатегория boxes уже есть в subcategories (category_id = hoztovary).
-- Товары ящиков из data/products.json никогда не вставлялись в products.
-- Всем товарам и карточке категории — фото /images/xoztov/box.jpeg

-- Ящик 40 л
INSERT INTO public.products (
  id, category_id, subcategory_id, slug, name, brand, type, description, image, specifications, sort, is_active
)
VALUES (
  'box-40l', 'hoztovary', 'boxes', 'box-40l',
  'Ящик для хранения 40 л', 'ЯХ-40', 'Литьевое изделие',
  'Прочный пластиковый ящик для хранения',
  '/images/xoztov/box.jpeg',
  '{"Материал": "ПП", "Объем": "40 л", "Размеры": "600×400×300 мм", "Цвет": "Серый, синий"}'::jsonb,
  1, true
)
ON CONFLICT (id) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  subcategory_id = EXCLUDED.subcategory_id,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image;

-- Ящик 60 л
INSERT INTO public.products (
  id, category_id, subcategory_id, slug, name, brand, type, description, image, specifications, sort, is_active
)
VALUES (
  'box-60l', 'hoztovary', 'boxes', 'box-60l',
  'Ящик для хранения 60 л', 'ЯХ-60', 'Литьевое изделие',
  'Большой пластиковый ящик',
  '/images/xoztov/box.jpeg',
  '{"Материал": "ПП", "Объем": "60 л", "Размеры": "800×400×300 мм"}'::jsonb,
  2, true
)
ON CONFLICT (id) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  subcategory_id = EXCLUDED.subcategory_id,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  specifications = EXCLUDED.specifications,
  image = EXCLUDED.image;

-- Фото подкатегории "Ящики" на карточке категории
UPDATE public.subcategories
SET image = '/images/xoztov/box.jpeg'
WHERE id = 'boxes';

-- Готово!
