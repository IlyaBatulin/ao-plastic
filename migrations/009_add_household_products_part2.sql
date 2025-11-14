-- ========================================
-- Продолжение: Хозяйственные товары (Уборка, стеклоочистители, санузел и др.)
-- ========================================

-- ===== УБОРОЧНЫЙ ИНВЕНТАРЬ =====

-- Совок BASE
INSERT INTO public.products (
  id, category_id, subcategory_id, name, slug, description,
  specifications, image, display_order, created_at, barcode, package_quantity, weight, dimensions, material
)
VALUES (
  'sovok-base', 'hoztovary', 'uborka',
  'Совок BASE',
  'sovok-base',
  'Совок сочетает в себе ряд преимуществ - это качество и удобство. Совок BASE отличается от модели ERGO более компактным размером и стоимостью.',
  jsonb_build_object(
    'Материал', 'Полипропилен',
    'Вес изделия', '55 г',
    'Длина', '287 мм',
    'Ширина', '209 мм',
    'Серия', 'BASE',
    'Количество в упаковке', '30 шт',
    'Штрихкод', '4630002361449',
    'Артикул', 'П2703'
  ),
  '/images/xoztov/П2703.jpg',
  1,
  NOW(),
  '4630002361449',
  30,
  55.0,
  'Длина 287 мм, ширина 209 мм',
  'Полипропилен'
);

-- Совок с резинкой BASE
INSERT INTO public.products (
  id, category_id, subcategory_id, name, slug, description,
  specifications, image, display_order, created_at, barcode, package_quantity, weight, dimensions, material
)
VALUES (
  'sovok-s-rezinkoy-base', 'hoztovary', 'uborka',
  'Совок с резинкой BASE',
  'sovok-s-rezinkoy-base',
  'Совок с резинкой BASE отличается от модели ERGO более компактным размером, что удобно для хранения. Все технические характеристики остаются прежними - это упругость, гибкость, наличие резинки.',
  jsonb_build_object(
    'Материал', 'Полипропилен',
    'Вес изделия', '63,5 г',
    'Длина', '287 мм',
    'Ширина', '209 мм',
    'Серия', 'BASE',
    'Особенность', 'С резиновой кромкой',
    'Количество в упаковке', '30 шт',
    'Штрихкод', '4630002361456',
    'Артикул', 'П2704'
  ),
  '/images/xoztov/П2704.jpg',
  2,
  NOW(),
  '4630002361456',
  30,
  63.5,
  'Длина 287 мм, ширина 209 мм',
  'Полипропилен'
);

-- Совок
INSERT INTO public.products (
  id, category_id, subcategory_id, name, slug, description,
  specifications, image, display_order, created_at, barcode, package_quantity, weight, dimensions, material
)
VALUES (
  'sovok', 'hoztovary', 'uborka',
  'Совок',
  'sovok',
  'Совок выполнен из высококачественного материала, благодаря чему упруг и гибок и обладает незаменимыми качествами для быстрой уборки.',
  jsonb_build_object(
    'Материал', 'Полипропилен',
    'Вес изделия', '87,7 г',
    'Длина', '324,6 мм',
    'Ширина', '216,4 мм',
    'Количество в упаковке', '24 шт',
    'Штрихкод', '4630002361463',
    'Артикул', 'П2705'
  ),
  '/images/xoztov/П2705.jpg',
  3,
  NOW(),
  '4630002361463',
  24,
  87.7,
  'Длина 324,6 мм, ширина 216,4 мм',
  'Полипропилен'
);

-- Совок с резинкой
INSERT INTO public.products (
  id, category_id, subcategory_id, name, slug, description,
  specifications, image, display_order, created_at, barcode, package_quantity, weight, dimensions, material
)
VALUES (
  'sovok-s-rezinkoy', 'hoztovary', 'uborka',
  'Совок с резинкой',
  'sovok-s-rezinkoy',
  'Совок отличается большим размером, что делает его эргономичным и удобным для уборки крупного мусора. Резиновая кромка, при этом, не пропустит, даже мельчайших пылинок. Совок плотно прилегает к поверхности.',
  jsonb_build_object(
    'Материал', 'Полипропилен',
    'Вес изделия', '98,2 г',
    'Длина', '333 мм',
    'Ширина', '216,4 мм',
    'Особенность', 'С резиновой кромкой',
    'Количество в упаковке', '24 шт',
    'Штрихкод', '4630002361470',
    'Артикул', 'П2706'
  ),
  '/images/xoztov/П2706.jpg',
  4,
  NOW(),
  '4630002361470',
  24,
  98.2,
  'Длина 333 мм, ширина 216,4 мм',
  'Полипропилен'
);

-- Совок ERGO
INSERT INTO public.products (
  id, category_id, subcategory_id, name, slug, description,
  specifications, image, display_order, created_at, barcode, package_quantity, weight, dimensions, material
)
VALUES (
  'sovok-ergo', 'hoztovary', 'uborka',
  'Совок ERGO',
  'sovok-ergo',
  'Совок выполнен из пластика, удобен в использовании, что позволяет быстро собирать мусор.',
  jsonb_build_object(
    'Материал', 'Полипропилен',
    'Вес изделия', '78,5 г',
    'Длина', '330 мм',
    'Ширина', '218 мм',
    'Серия', 'ERGO',
    'Количество в упаковке', '30 шт',
    'Штрихкод', '4630002361487',
    'Артикул', 'П2707'
  ),
  '/images/xoztov/П2707.jpg',
  5,
  NOW(),
  '4630002361487',
  30,
  78.5,
  'Длина 330 мм, ширина 218 мм',
  'Полипропилен'
);

-- Совок с резинкой ERGO
INSERT INTO public.products (
  id, category_id, subcategory_id, name, slug, description,
  specifications, image, display_order, created_at, barcode, package_quantity, weight, dimensions, material
)
VALUES (
  'sovok-s-rezinkoy-ergo', 'hoztovary', 'uborka',
  'Совок с резинкой ERGO',
  'sovok-s-rezinkoy-ergo',
  'Совок с резинкой выполнен из высококачественного материала, удобен в использовании, хранении, и эксплуатации. Благодаря материалу совок обладает упругостью, гибкостью.',
  jsonb_build_object(
    'Материал', 'Полипропилен',
    'Вес изделия', '89 г',
    'Длина', '340 мм',
    'Ширина', '218 мм',
    'Серия', 'ERGO',
    'Особенность', 'С резиновой кромкой',
    'Количество в упаковке', '30 шт',
    'Штрихкод', '4630002361494',
    'Артикул', 'П2708'
  ),
  '/images/xoztov/П2708.jpg',
  6,
  NOW(),
  '4630002361494',
  30,
  89.0,
  'Длина 340 мм, ширина 218 мм',
  'Полипропилен'
);

-- Совок для мусора
INSERT INTO public.products (
  id, category_id, subcategory_id, name, slug, description,
  specifications, image, display_order, created_at, barcode, package_quantity, weight, dimensions, material
)
VALUES (
  'sovok-dlya-musora', 'hoztovary', 'uborka',
  'Совок для мусора',
  'sovok-dlya-musora',
  'Совок выполнен в овальных формах, ручка удобно расположена сбоку, что позволяет быстро и удобно собирать мелкий мусор и пыль.',
  jsonb_build_object(
    'Материал', 'Полипропилен',
    'Вес изделия', '115 г',
    'Длина', '240 мм',
    'Ширина', '200 мм',
    'Количество в упаковке', '50 шт',
    'Штрихкод', '4630002361722',
    'Артикул', 'П494'
  ),
  '/placeholder.svg',
  7,
  NOW(),
  '4630002361722',
  50,
  115.0,
  'Длина 240 мм, ширина 200 мм',
  'Полипропилен'
);

-- Щетка-сметка
INSERT INTO public.products (
  id, category_id, subcategory_id, name, slug, description,
  specifications, image, display_order, created_at, barcode, package_quantity, weight, dimensions, material
)
VALUES (
  'shchetka-smetka', 'hoztovary', 'uborka',
  'Щетка-сметка',
  'shchetka-smetka',
  'Щетка-сметка оптимальна для удаления пыли и мелкого мусора с таких поверхностей, как подоконники, полки, шкафы, полы. Изготовлена из пластика.',
  jsonb_build_object(
    'Материал', 'Полипропилен',
    'Вес изделия', '88 г',
    'Длина', '286 мм',
    'Ширина', '38 мм',
    'Высота', '104 мм',
    'Количество в упаковке', '24 шт',
    'Штрихкод', '4630002361524',
    'Артикул', 'П2711'
  ),
  '/images/xoztov/П2711.jpg',
  8,
  NOW(),
  '4630002361524',
  24,
  88.0,
  'Длина 286 мм, ширина 38 мм, высота 104 мм',
  'Полипропилен'
);

-- Набор, совок и щетка
INSERT INTO public.products (
  id, category_id, subcategory_id, name, slug, description,
  specifications, image, display_order, created_at, barcode, package_quantity, weight, dimensions, material
)
VALUES (
  'nabor-sovok-shchetka', 'hoztovary', 'uborka',
  'Набор, совок и щетка',
  'nabor-sovok-shchetka',
  'Стандартный набор щетка и совок моментально решают вопрос уборки мелкого мусора. Набором легко работать и его легко хранить. Кромка совка идеально ровная, плотно прилегает к обрабатываемой поверхности. Ручки эргономичные, снабжены отверстием для подвесного хранения.',
  jsonb_build_object(
    'Материал', 'Полипропилен',
    'Вес изделия', '183 г',
    'Комплектация', 'Совок П2705 + Щетка-сметка П2711',
    'Количество в упаковке', '12 шт',
    'Штрихкод', '4630002361500',
    'Артикул', 'П2709'
  ),
  '/images/xoztov/П2709.jpg',
  9,
  NOW(),
  '4630002361500',
  12,
  183.0,
  'Совок: длина 324,6 мм, ширина 216,4 мм; Щетка: длина 286 мм',
  'Полипропилен'
);

-- Набор, совок с резинкой и щетка
INSERT INTO public.products (
  id, category_id, subcategory_id, name, slug, description,
  specifications, image, display_order, created_at, barcode, package_quantity, weight, dimensions, material
)
VALUES (
  'nabor-sovok-s-rezinkoy-shchetka', 'hoztovary', 'uborka',
  'Набор, совок с резинкой и щетка',
  'nabor-sovok-s-rezinkoy-shchetka',
  'Набор щетка и совок с резиновой кромкой обладает всеми достоинствами стандартного набора. Дополнение в виде резиновой кромки придает совку улучшенные характеристики. Он не скользит на гладкой поверхности, обеспечивает более качественный сбор пыли и мелкого мусора.',
  jsonb_build_object(
    'Материал', 'Полипропилен',
    'Вес изделия', '188 г',
    'Комплектация', 'Совок П2706 с резинкой + Щетка-сметка П2711',
    'Особенность', 'С резиновой кромкой',
    'Количество в упаковке', '12 шт',
    'Штрихкод', '4630002361517',
    'Артикул', 'П2710'
  ),
  '/images/xoztov/П2710.jpg',
  10,
  NOW(),
  '4630002361517',
  12,
  188.0,
  'Совок: длина 333 мм, ширина 216,4 мм; Щетка: длина 286 мм',
  'Полипропилен'
);

-- Пылевыбивалка
INSERT INTO public.products (
  id, category_id, subcategory_id, name, slug, description,
  specifications, image, display_order, created_at, barcode, package_quantity, weight, dimensions, material
)
VALUES (
  'pylevybivalka', 'hoztovary', 'uborka',
  'Пылевыбивалка',
  'pylevybivalka',
  'Пылевыбивалка обладает повышенной прочностью, не ломается. Качественный пластик обеспечивает одновременно упругость и гибкость изделия. Пылевыбивалка - простой и проверенный способ борьбы с пылью.',
  jsonb_build_object(
    'Материал', 'Полипропилен',
    'Вес изделия', '87,7 г',
    'Высота', '610 мм',
    'Диаметр', '220 мм',
    'Количество в упаковке', '90 шт',
    'Штрихкод', '4630002361708',
    'Артикул', 'П2093'
  ),
  '/images/xoztov/П2093.jpg',
  11,
  NOW(),
  '4630002361708',
  90,
  87.7,
  'Высота 610 мм, диаметр 220 мм',
  'Полипропилен'
);

-- ===== СТЕКЛООЧИСТИТЕЛИ =====

-- Стеклоочиститель с абразивом
INSERT INTO public.products (
  id, category_id, subcategory_id, name, slug, description,
  specifications, image, display_order, created_at, barcode, package_quantity, weight, dimensions, material
)
VALUES (
  'stekloochistitel-s-abrazivom', 'hoztovary', 'steklo',
  'Стеклоочиститель с абразивом',
  'stekloochistitel-s-abrazivom',
  'Стеклоочиститель - легкий и удобный способ для мытья окон, длина рукоятки удобно ложится в руку. Материал из которого изготовлен стеклоочиститель прочный, практичный.',
  jsonb_build_object(
    'Материал', 'Полипропилен',
    'Вес изделия', '110,2 г',
    'Высота', '145 мм',
    'Толщина стенки', '1,8 мм',
    'Верхний диаметр', '370 мм',
    'Особенность', 'С абразивом',
    'Количество в упаковке', '12 шт',
    'Штрихкод', '4630002361548',
    'Артикул', 'П2713'
  ),
  '/images/xoztov/П2713.jpg',
  1,
  NOW(),
  '4630002361548',
  12,
  110.2,
  'Высота 145 мм, верхний диаметр 370 мм',
  'Полипропилен'
);

-- Стеклоочиститель ERGO
INSERT INTO public.products (
  id, category_id, subcategory_id, name, slug, description,
  specifications, image, display_order, created_at, barcode, package_quantity, weight, dimensions, material
)
VALUES (
  'stekloochistitel-ergo', 'hoztovary', 'steklo',
  'Стеклоочиститель ERGO',
  'stekloochistitel-ergo',
  'Легкость и прочность этого стеклоочистителя обеспечит не только легкую и быструю уборку в доме, но и беспроблемное мытье автомобильных стекол. Губка хорошо впитывает воду, а ровная качественная резиновая кромка идеально собирает влагу с поверхности. Продукт прошел испытания качества.',
  jsonb_build_object(
    'Материал', 'Полипропилен',
    'Вес изделия', '110,7 г',
    'Длина', '167 мм',
    'Ширина', '202,4 мм',
    'Серия', 'ERGO',
    'Количество в упаковке', '12 шт',
    'Штрихкод', '4630002361555',
    'Артикул', 'П2714'
  ),
  '/images/xoztov/П2714.jpg',
  2,
  NOW(),
  '4630002361555',
  12,
  110.7,
  'Длина 167 мм, ширина 202,4 мм',
  'Полипропилен'
);

-- Стеклоочиститель ERGO с черенком 60 см
INSERT INTO public.products (
  id, category_id, subcategory_id, name, slug, description,
  specifications, image, display_order, created_at, barcode, package_quantity, weight, dimensions, material
)
VALUES (
  'stekloochistitel-ergo-s-cherenkom', 'hoztovary', 'steklo',
  'Стеклоочиститель ERGO с черенком 60 см',
  'stekloochistitel-ergo-s-cherenkom',
  'Стеклоочиститель удобный и легкий в эксплуатации, экономит время в мытье окон за счет длинного черенка и быстро впитывающей губки. Резиновая кромка идеально ровная, не оставляет разводов на стекле.',
  jsonb_build_object(
    'Материал', 'Полипропилен',
    'Вес изделия', '185,7 г',
    'Длина', '700 мм',
    'Ширина', '202,4 мм',
    'Серия', 'ERGO',
    'Особенность', 'С черенком 60 см',
    'Количество в упаковке', '15 шт',
    'Штрихкод', '4630002361562',
    'Артикул', 'П2715'
  ),
  '/images/xoztov/П2715.jpg',
  3,
  NOW(),
  '4630002361562',
  15,
  185.7,
  'Длина 700 мм, ширина 202,4 мм',
  'Полипропилен'
);

-- Продолжение следует...

COMMENT ON TABLE public.products IS 'Добавлены товары для уборки и стеклоочистители';

