-- ============================================================
-- МИГРАЦИЯ: Переработка структуры каталога продукции
-- ============================================================
-- 1. Добавление новых полей в таблицу categories
-- 2. Удаление дублирующей категории household
-- 3. Переименование hoztovary в "Товары народного потребления"
-- 4. Обновление информации о категориях

-- ========== ШАГ 1: Добавление новых полей ==========
ALTER TABLE public.categories 
ADD COLUMN IF NOT EXISTS technical_purpose TEXT,
ADD COLUMN IF NOT EXISTS target_application TEXT,
ADD COLUMN IF NOT EXISTS is_custom_order BOOLEAN DEFAULT false;

COMMENT ON COLUMN public.categories.technical_purpose IS 'Краткое техническое назначение категории';
COMMENT ON COLUMN public.categories.target_application IS 'Целевое применение продукции';
COMMENT ON COLUMN public.categories.is_custom_order IS 'Статус "под заказ" (true если продукция делается специально под клиента)';

-- ========== ШАГ 2: Удаление дублирующей категории household ==========
-- Деактивируем категорию household (если она существует)
UPDATE public.categories 
SET is_active = false 
WHERE id = 'household';

-- Переносим подкатегории и товары из household в hoztovary (если есть)
UPDATE public.subcategories 
SET category_id = 'hoztovary' 
WHERE category_id = 'household';

UPDATE public.products 
SET category_id = 'hoztovary' 
WHERE category_id = 'household';

-- ========== ШАГ 3: Переименование hoztovary ==========
UPDATE public.categories 
SET 
  name = 'Товары народного потребления',
  description = 'Качественные изделия из пластика для дома и быта',
  technical_purpose = 'Производство товаров народного потребления из полипропилена и ПЭНД методом литья под давлением и выдувного формования',
  target_application = 'Бытовые товары для дома, кухни, санузла, уборки и отдыха',
  is_custom_order = false
WHERE id = 'hoztovary';

-- ========== ШАГ 4: Обновление информации о категориях ==========

-- Стирол
UPDATE public.categories 
SET 
  technical_purpose = 'Мономерный стирол высокой чистоты для синтеза полимеров',
  target_application = 'Производство полистирола, АБС-пластиков, сополимеров стирола',
  is_custom_order = false
WHERE id = 'styrene';

-- АБС-пластики
UPDATE public.categories 
SET 
  technical_purpose = 'Термопластичный сополимер акрилонитрил-бутадиен-стирол для литья и экструзии',
  target_application = 'Автомобильная промышленность, приборостроение, электроника, медицина, бытовая техника',
  is_custom_order = false
WHERE id = 'abs';

-- Полистирол
UPDATE public.categories 
SET 
  technical_purpose = 'Полимер стирола для производства теплоизоляционных материалов и упаковки',
  target_application = 'Теплоизоляция зданий, упаковочные материалы, одноразовая посуда',
  is_custom_order = false
WHERE id = 'polystyrene';

-- Дисперсия стирол-акриловая
UPDATE public.categories 
SET 
  technical_purpose = 'Водная дисперсия стирол-акрилового сополимера для лакокрасочных материалов',
  target_application = 'Производство водоэмульсионных красок, строительных материалов, ЛКМ',
  is_custom_order = false
WHERE id = 'dispersion';

-- Детали машиностроения
UPDATE public.categories 
SET 
  technical_purpose = 'Пластиковые детали для автомобильной промышленности и машиностроения',
  target_application = 'Автомобильные комплектующие, декоративные элементы, защитные детали',
  is_custom_order = true
WHERE id = 'machine-parts';

-- Канистры
UPDATE public.categories 
SET 
  technical_purpose = 'Пластиковые емкости для хранения и транспортировки жидкостей методом выдувного формования',
  target_application = 'Хранение и транспортировка технических жидкостей, воды, пищевых продуктов',
  is_custom_order = false
WHERE id = 'canisters';

-- Ящики
UPDATE public.categories 
SET 
  technical_purpose = 'Пластиковые контейнеры для хранения и транспортировки методом литья под давлением',
  target_application = 'Складское хранение, логистика, транспортировка товаров',
  is_custom_order = false
WHERE id = 'boxes';

-- Модификатор для композиций ПВХ
UPDATE public.categories 
SET 
  technical_purpose = 'Модифицирующая добавка для улучшения свойств ПВХ композиций',
  target_application = 'Производство ПВХ-профилей, труб, листов с улучшенными механическими свойствами',
  is_custom_order = false
WHERE id = 'pvc-modifier';

-- КОРС
UPDATE public.categories 
SET 
  technical_purpose = 'Кубовый остаток ректификации стирола - побочный продукт производства',
  target_application = 'Топливо для промышленных печей, компонент лакокрасочных составов',
  is_custom_order = false
WHERE id = 'kors';

-- Изготовление изделий из АБС пластика на заказ
UPDATE public.categories 
SET 
  technical_purpose = 'Производство изделий из АБС-пластика по индивидуальным заказам',
  target_application = 'Изготовление деталей по чертежам заказчика для различных отраслей',
  is_custom_order = true
WHERE id = 'custom-abs';

-- ========== ШАГ 5: Обновление порядка сортировки категорий ==========
-- Устанавливаем новый порядок отображения категорий

-- 1. АБС-пластики
UPDATE public.categories SET sort = 10 WHERE id = 'abs';

-- 2. ПСВ и полистиролы
UPDATE public.categories SET sort = 20 WHERE id = 'polystyrene';

-- 3. Стирол
UPDATE public.categories SET sort = 30 WHERE id = 'styrene';

-- 4. ТПН (пропущено - требуется уточнение)

-- 5. Канистры (с указанием литража в описании)
UPDATE public.categories 
SET 
  sort = 50,
  description = 'Пластиковые канистры различного объема (3л, 5л, 10л, 20л, 30л) для хранения жидкостей'
WHERE id = 'canisters';

-- 6. Ящики (с пометкой «под заказ»)
UPDATE public.categories 
SET 
  sort = 60,
  is_custom_order = true,
  description = 'Пластиковые ящики для хранения и транспортировки (под заказ)'
WHERE id = 'boxes';

-- 7. Товары народного потребления
UPDATE public.categories SET sort = 70 WHERE id = 'hoztovary';

-- 8. Остальные материалы
UPDATE public.categories SET sort = 80 WHERE id = 'dispersion';
UPDATE public.categories SET sort = 90 WHERE id = 'machine-parts';
UPDATE public.categories SET sort = 100 WHERE id = 'pvc-modifier';
UPDATE public.categories SET sort = 110 WHERE id = 'kors';
UPDATE public.categories SET sort = 120 WHERE id = 'custom-abs';

-- Готово!

