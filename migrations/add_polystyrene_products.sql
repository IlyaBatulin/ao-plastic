-- ============================================================
-- ТОВАРЫ ПОЛИСТИРОЛ (ВСПЕНИВАЮЩИЙСЯ POLYSTYRENE EPS)
-- ============================================================

-- Полистирол вспенивающийся ПСВ-С
insert into public.products (id, slug, category_id, subcategory_id, name, brand, type, description, image, specifications, is_active, sort)
values (
  'psv-s',
  'psv-s',
  'polystyrene',
  'ps-psv-s',
  'Полистирол вспенивающийся ПСВ-С',
  'ПСВ-С',
  'Гранулы',
  'Вспенивающийся полистирол для производства пенопласта, теплоизоляционных плит и упаковочных материалов. Используется в строительстве и упаковке.',
  '/images/polystyrene-granules-1.png',
  '{"Насыпная плотность": "20-25 кг/м³", "Размер гранул": "0.5-2.0 мм", "Коэффициент вспенивания": "40-50", "Температура плавления": "240°C", "Применение": "Теплоизоляция, упаковка", "Упаковка": "Мешки 15 кг"}'::jsonb,
  true,
  10
)
on conflict (id) do nothing;

-- Полистирол вспенивающийся ПСВ-Л
insert into public.products (id, slug, category_id, subcategory_id, name, brand, type, description, image, specifications, is_active, sort)
values (
  'psv-l',
  'psv-l',
  'polystyrene',
  'ps-psv-l',
  'Полистирол вспенивающийся ПСВ-Л',
  'ПСВ-Л',
  'Гранулы',
  'Литейный вспенивающийся полистирол с повышенным коэффициентом вспенивания',
  '/images/polystyrene-granules-2.png',
  '{"Насыпная плотность": "15-20 кг/м³", "Размер гранул": "0.5-2.0 мм", "Коэффициент вспенивания": "50-60", "Применение": "Теплоизоляция", "Упаковка": "Мешки 15 кг"}'::jsonb,
  true,
  20
)
on conflict (id) do nothing;

-- Полистирол ПСЭ-1
insert into public.products (id, slug, category_id, subcategory_id, name, brand, type, description, image, specifications, is_active, sort)
values (
  'pse-1',
  'pse-1',
  'polystyrene',
  'ps-pse',
  'Полистирол ПСЭ-1',
  'ПСЭ-1',
  'Гранулы',
  'Полистирол эмульсионный общего назначения для производства листов и изделий',
  '/images/polystyrene-granules-3.jpeg',
  '{"Тип": "Эмульсионный", "Применение": "Листы, профили, изделия", "Упаковка": "Мешки 25 кг"}'::jsonb,
  true,
  30
)
on conflict (id) do nothing;

-- Проверка: выводим добавленные товары
SELECT 
  p.id,
  p.name,
  c.name as category_name,
  s.name as subcategory_name,
  p.is_active
FROM public.products p
LEFT JOIN public.categories c ON p.category_id = c.id
LEFT JOIN public.subcategories s ON p.subcategory_id = s.id
WHERE p.category_id = 'polystyrene'
ORDER BY p.id;

