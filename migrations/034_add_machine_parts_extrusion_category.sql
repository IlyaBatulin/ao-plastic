-- ============================================================
-- ДОБАВЛЕНИЕ КАТЕГОРИИ "ДЕТАЛИ МАШИН" И ПОДКАТЕГОРИИ "ЭКСТРУЗИОННЫЕ ИЗДЕЛИЯ"
-- ============================================================

-- Проверяем и добавляем категорию "Детали машин"
INSERT INTO public.categories (id, slug, name, description, image, sort, is_active)
VALUES (
  'machine-parts',
  'machine-parts',
  'Детали машиностроения',
  'Экструзионные изделия и детали для автомобильной промышленности',
  '/images/machine-parts.jpg',
  100,
  true
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  is_active = true;

-- Проверяем и добавляем подкатегорию "Экструзионные изделия ДМС"
INSERT INTO public.subcategories (id, category_id, slug, name, description, sort, is_active)
VALUES (
  'parts-extrusion',
  'machine-parts',
  'parts-extrusion',
  'Экструзионные изделия ДМС',
  'Сепараторы, трубки, шланги, окантовки, профили и другие экструзионные изделия для автомобильной промышленности',
  10,
  true
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  is_active = true;

-- Готово!
