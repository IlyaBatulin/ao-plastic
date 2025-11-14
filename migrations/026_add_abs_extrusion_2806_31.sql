-- ============================================================
-- ДОБАВЛЕНИЕ ЭКСТРУЗИОННОЙ МАРКИ АБС-2806-31
-- АБС-пластик для экструзии листов и профилей
-- ============================================================

-- Используем изображение из каталога
DO $$
DECLARE
  v_category_image text := '/images/abs-plastik-katalog.webp';
BEGIN

  -- АБС-2806-31
  INSERT INTO public.products (id, slug, category_id, subcategory_id, name, brand, type, description, image, specifications, is_active, sort)
  VALUES (
    'abs-2806-31',
    'abs-2806-31',
    'abs',
    'abs-extrusion',
    'АБС-2806-31',
    'АБС-2806-31',
    'Экструзионный',
    'Экструзионный АБС-пластик марки 2806-31 для производства листов и профилей методом экструзии',
    v_category_image,
    '{"Марка": "АБС-2806-31", "Тип": "Экструзионный", "Применение": "Листы, профили, трубы, экструзионные изделия", "Плотность_кг_м3": 1040, "Показатель_текучести_расплава_MFR_г_10мин": 8.0, "Относительное_удлинение_при_разрыве_проц": 35.0, "Ударная_вязкость_по_Изоду_кДж_м2": 28.0, "Предел_текучести_при_растяжении_МПа": 420.0, "Температура_размягчения_по_Вика_градС": 98.0, "Блеск_проц": 85.0}'::jsonb,
    true,
    10
  )
  ON CONFLICT (id) DO UPDATE
  SET name = excluded.name,
      description = excluded.description,
      specifications = excluded.specifications,
      subcategory_id = excluded.subcategory_id,
      type = excluded.type;

END $$;

-- Проверка: выводим добавленный товар
SELECT 
  p.id,
  p.name,
  c.name as category_name,
  s.name as subcategory_name,
  p.type,
  p.is_active
FROM public.products p
LEFT JOIN public.categories c ON p.category_id = c.id
LEFT JOIN public.subcategories s ON p.subcategory_id = s.id
WHERE p.id = 'abs-2806-31';

