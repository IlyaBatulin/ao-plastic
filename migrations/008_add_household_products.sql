-- ========================================
-- Миграция: Добавление категории "Хозяйственные товары"
-- ========================================

-- 1. Добавляем главную категорию "Хозяйственные товары"
INSERT INTO public.categories (id, name, slug, description, image, display_order, created_at)
VALUES (
  'hoztovary',
  'Хозяйственные товары',
  'hoztovary',
  'Качественные изделия из пластика для дома и быта',
  '/placeholder.svg',
  3,
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. Добавляем подкатегории
INSERT INTO public.subcategories (id, category_id, name, slug, description, image, display_order, created_at)
VALUES
  -- Ведра и тазы
  ('vedra-tazy', 'hoztovary', 'Ведра и тазы', 'vedra-tazy', 
   'Прочные пластиковые ведра и тазы различных объемов', 
   '/placeholder.svg', 1, NOW()),
  
  -- Уборочный инвентарь
  ('uborka', 'hoztovary', 'Уборочный инвентарь', 'uborka',
   'Совки, щетки, наборы для уборки',
   '/placeholder.svg', 2, NOW()),
  
  -- Стеклоочистители
  ('steklo', 'hoztovary', 'Стеклоочистители', 'steklo',
   'Стеклоочистители для окон и зеркал',
   '/placeholder.svg', 3, NOW()),
  
  -- Для санузла
  ('sanuzel', 'hoztovary', 'Для санузла', 'sanuzel',
   'Комплекты для туалета, мыльницы и аксессуары',
   '/placeholder.svg', 4, NOW()),
  
  -- Кухонные принадлежности
  ('kuhnya', 'hoztovary', 'Кухонные принадлежности', 'kuhnya',
   'Воронки, кружки, фильтры и другие кухонные аксессуары',
   '/placeholder.svg', 5, NOW()),
  
  -- Вешалки и плечики
  ('veshalki', 'hoztovary', 'Вешалки и плечики', 'veshalki',
   'Вешалки-плечики различных размеров',
   '/placeholder.svg', 6, NOW()),
  
  -- Товары для отдыха
  ('otdyh', 'hoztovary', 'Товары для отдыха', 'otdyh',
   'Товары для пикника, барбекю и отдыха на природе',
   '/placeholder.svg', 7, NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. Добавляем товары категории "Ведра и тазы"

-- Ведро BASE 9,5 л
INSERT INTO public.products (
  id, category_id, subcategory_id, name, slug, description, 
  specifications, image, display_order, created_at, barcode, package_quantity, weight, dimensions, material
)
VALUES (
  'vedro-base-95l', 'hoztovary', 'vedra-tazy',
  'Ведро BASE 9,5 л',
  'vedro-base-95l',
  'Прямоугольное Ведро BASE 9,5 л специально разработано для удобство использования современных швабр-мопов с механизмом отжима. Особая форма ведра позволяет сделать процесс мытья полов быстрым и удобным.',
  jsonb_build_object(
    'Объем', '9,5 л',
    'Материал', 'Полипропилен PP 8348SM',
    'Вес изделия', '268 г',
    'Ширина', '225 мм',
    'Длина', '362 мм',
    'Высота', '255 мм',
    'Количество в упаковке', '6 шт',
    'Штрихкод', '4630002361425',
    'Артикул', 'П2701'
  ),
  '/images/xoztov/П2701.jpg',
  1,
  NOW(),
  '4630002361425',
  6,
  268.0,
  'Ширина 225 мм, длина 362 мм, высота 255 мм',
  'Полипропилен PP 8348SM'
);

-- Ведро 2,5 л
INSERT INTO public.products (
  id, category_id, subcategory_id, name, slug, description,
  specifications, image, display_order, created_at, barcode, package_quantity, weight, dimensions, material
)
VALUES (
  'vedro-25l', 'hoztovary', 'vedra-tazy',
  'Ведро 2,5 л',
  'vedro-25l',
  'Ведро не только красивое, эргономичное, но и чрезвычайно прочное. Выполнено из высококачественного пластика в соответствии с ГОСТ Р 50962-96, проходит строгий ОТК.',
  jsonb_build_object(
    'Объем', '2,5 л',
    'Материал', 'ПЭНД',
    'Вес изделия', '215,8 г',
    'Высота', '158 мм',
    'Толщина стенки', '2,2 мм',
    'Верхний диаметр', '188 мм',
    'Диаметр дна', '128 мм',
    'Количество в упаковке', '20 шт',
    'Штрихкод', '4630002361906',
    'Артикул', 'П2049'
  ),
  '/placeholder.svg',
  2,
  NOW(),
  '4630002361906',
  20,
  215.8,
  'Высота 158 мм, верхний диаметр 188 мм, диаметр дна 128 мм',
  'ПЭНД'
);

-- Ведро 5 л
INSERT INTO public.products (
  id, category_id, subcategory_id, name, slug, description,
  specifications, image, display_order, created_at, barcode, package_quantity, weight, dimensions, material
)
VALUES (
  'vedro-5l', 'hoztovary', 'vedra-tazy',
  'Ведро 5 л',
  'vedro-5l',
  'Ведро не только красивое, эргономичное, но и чрезвычайно прочное. Выполнено из высококачественного пластика в соответствии с ГОСТ Р 50962-96, проходит строгий ОТК.',
  jsonb_build_object(
    'Объем', '5 л',
    'Материал', 'ПЭНД',
    'Вес изделия', '374 г',
    'Высота', '210 мм',
    'Толщина стенки', '2,2 мм',
    'Верхний диаметр', '240 мм',
    'Диаметр дна', '170 мм',
    'Количество в упаковке', '10 шт',
    'Штрихкод', '4630002361913',
    'Артикул', 'П1916'
  ),
  '/placeholder.svg',
  3,
  NOW(),
  '4630002361913',
  10,
  374.0,
  'Высота 210 мм, верхний диаметр 240 мм, диаметр дна 170 мм',
  'ПЭНД'
);

-- Ведро 7 л
INSERT INTO public.products (
  id, category_id, subcategory_id, name, slug, description,
  specifications, image, display_order, created_at, barcode, package_quantity, weight, dimensions, material
)
VALUES (
  'vedro-7l', 'hoztovary', 'vedra-tazy',
  'Ведро 7 л',
  'vedro-7l',
  'Ведро не только красивое, эргономичное, но и чрезвычайно прочное. Выполнено из высококачественного пластика в соответствии с ГОСТ Р 50962-96, проходит строгий ОТК.',
  jsonb_build_object(
    'Объем', '7 л',
    'Материал', 'ПЭНД',
    'Вес изделия', '394 г',
    'Высота', '260 мм',
    'Толщина стенки', '2,2 мм',
    'Верхний диаметр', '240 мм',
    'Диаметр дна', '170 мм',
    'Количество в упаковке', '10 шт',
    'Штрихкод', '4630002361920',
    'Артикул', 'П2168'
  ),
  '/placeholder.svg',
  4,
  NOW(),
  '4630002361920',
  10,
  394.0,
  'Высота 260 мм, верхний диаметр 240 мм, диаметр дна 170 мм',
  'ПЭНД'
);

-- Ведро 10 л
INSERT INTO public.products (
  id, category_id, subcategory_id, name, slug, description,
  specifications, image, display_order, created_at, barcode, package_quantity, weight, dimensions, material
)
VALUES (
  'vedro-10l', 'hoztovary', 'vedra-tazy',
  'Ведро 10 л',
  'vedro-10l',
  'Ведро не только красивое, эргономичное, но и чрезвычайно прочное. Выполнено из высококачественного пластика в соответствии с ГОСТ Р 50962-96, проходит строгий ОТК. Наши изделия вобрали в себя лучшие - советское качество и современный стиль.',
  jsonb_build_object(
    'Объем', '10 л',
    'Материал', 'ПЭНД',
    'Вес изделия', '634 г',
    'Высота', '284 мм',
    'Толщина стенки', '2,83 мм',
    'Диаметр дна', '209 мм',
    'Количество в упаковке', '10 шт',
    'Штрихкод', '4630002361944',
    'Артикул', 'П2172'
  ),
  '/placeholder.svg',
  5,
  NOW(),
  '4630002361944',
  10,
  634.0,
  'Высота 284 мм, диаметр дна 209 мм',
  'ПЭНД'
);

-- Таз 10 л
INSERT INTO public.products (
  id, category_id, subcategory_id, name, slug, description,
  specifications, image, display_order, created_at, barcode, package_quantity, weight, dimensions, material
)
VALUES (
  'taz-10l', 'hoztovary', 'vedra-tazy',
  'Таз 10 л',
  'taz-10l',
  'Таз из пластика 10 литров оптимален по объему. Прочный, выдерживает нагрузку. Надежный помощник при стирке, уборке, на кухне, в саду.',
  jsonb_build_object(
    'Объем', '10 л',
    'Материал', 'ПЭНД',
    'Вес изделия', '410 г',
    'Высота', '145 мм',
    'Толщина стенки', '1,8 мм',
    'Верхний диаметр', '370 мм',
    'Количество в упаковке', '10 шт',
    'Штрихкод', '4630002361968',
    'Артикул', 'П2171'
  ),
  '/placeholder.svg',
  6,
  NOW(),
  '4630002361968',
  10,
  410.0,
  'Высота 145 мм, верхний диаметр 370 мм',
  'ПЭНД'
);

-- Таз 15 л
INSERT INTO public.products (
  id, category_id, subcategory_id, name, slug, description,
  specifications, image, display_order, created_at, barcode, package_quantity, weight, dimensions, material
)
VALUES (
  'taz-15l', 'hoztovary', 'vedra-tazy',
  'Таз 15 л',
  'taz-15l',
  'Таз из пластика - выдерживает большой вес. Оптимальная конструкция, проверенная не одним поколением домохозяек.',
  jsonb_build_object(
    'Объем', '15 л',
    'Материал', 'ПЭНД',
    'Вес изделия', '700 г',
    'Высота', '185 мм',
    'Толщина стенки', '2,5 мм',
    'Верхний диаметр', '400 мм',
    'Количество в упаковке', '10 шт',
    'Штрихкод', '4630002361975',
    'Артикул', 'П2061'
  ),
  '/placeholder.svg',
  7,
  NOW(),
  '4630002361975',
  10,
  700.0,
  'Высота 185 мм, верхний диаметр 400 мм',
  'ПЭНД'
);

-- Продолжение следует (остальные категории товаров)...

COMMENT ON TABLE public.products IS 'Добавлены хозяйственные товары с характеристиками из Excel';

