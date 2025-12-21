-- ============================================================
-- ИМПОРТ КАТЕГОРИЙ И ПОДКАТЕГОРИЙ из data/products.json
-- ============================================================

-- Категории (сортировка по новому порядку)
insert into public.categories (id, slug, name, description, image, sort, is_active) values
-- 1. АБС-пластики
('abs', 'abs', 'АБС-пластики', 'Широкий ассортимент АБС-пластиков для различных применений (автопром, приборостроение, медицина)', '/images/products/abs-plastic.jpg', 10, true),
-- 2. ПСВ и полистиролы
('polystyrene', 'polystyrene', 'Полистирол', 'Вспенивающийся и обычный полистирол различных марок для теплоизоляции и упаковки', '/images/products/polystyrene.jpg', 20, true),
-- 3. Стирол
('styrene', 'styrene', 'Стирол', 'Высококачественный стирол мономерный для производства полистирола и сополимеров', '/images/products/styrene.jpg', 30, true),
-- 4. ТПН (пропущено - требуется уточнение)
-- 5-6. Канистры и Ящики теперь являются подкатегориями ТНП (см. миграцию 029)
-- 7. Товары народного потребления
('hoztovary', 'hoztovary', 'Товары народного потребления', 'Качественные изделия из пластика для дома и быта', '/images/xoztov/П2701.jpg', 70, true),
-- 8. Остальные материалы
('dispersion', 'dispersion', 'Дисперсия стирол-акриловая', 'Новый продукт для производства водоэмульсионных красок и покрытий', '/images/products/dispersion.jpg', 80, true),
('machine-parts', 'machine-parts', 'Детали машиностроения', 'Широкий ассортимент пластиковых деталей для автомобильной промышленности и машиностроения', '/images/products/machine-parts.jpg', 90, true),
('pvc-modifier', 'pvc-modifier', 'Модификатор для композиций ПВХ', 'Модификатор для улучшения свойств ПВХ композиций', '/images/products/pvc-modifier.jpg', 100, true),
('kors', 'kors', 'КОРС (кубовый остаток ректификации стирола)', 'Побочный продукт производства стирола, используется как топливо или компонент в ЛКМ', '/images/products/kors.jpg', 110, true),
('custom-abs', 'custom-abs', 'Изготовление изделий из АБС пластика на заказ', 'Производство изделий из АБС-пластика по индивидуальным заказам клиентов', '/images/products/custom-abs.jpg', 120, true)
on conflict (id) do update
set slug = excluded.slug,
    name = excluded.name,
    description = excluded.description,
    image = excluded.image,
    sort = excluded.sort;

-- Подкатегории АБС
insert into public.subcategories (id, category_id, slug, name, description, sort, is_active) values
('abs-specs', 'abs', 'abs-specs', 'Технические характеристики АБС', 'Подробные технические характеристики всех марок АБС-пластиков', 10, true),
('abs-injection', 'abs', 'abs-injection', 'Литьевые марки', 'АБС-пластики для литья под давлением', 20, true),
('abs-extrusion', 'abs', 'abs-extrusion', 'Экструзионные марки', 'АБС-пластики для экструзии листов и профилей', 30, true),
('abs-custom', 'abs', 'abs-custom', 'Изготовление изделий из АБС пластика на заказ', 'Производство изделий из АБС-пластика по индивидуальным заказам', 40, true)
on conflict (id) do update
set category_id = excluded.category_id,
    slug = excluded.slug,
    name = excluded.name,
    description = excluded.description,
    sort = excluded.sort;

-- Подкатегории Полистирола
insert into public.subcategories (id, category_id, slug, name, description, sort, is_active) values
('ps-psv-s', 'polystyrene', 'ps-psv-s', 'Полистирол вспенивающийся ПСВ-С', 'Вспенивающийся полистирол самозатухающийся', 10, true),
('ps-psv-l', 'polystyrene', 'ps-psv-l', 'Полистирол вспенивающийся ПСВ-Л', 'Вспенивающийся полистирол литейный', 20, true),
('ps-pse', 'polystyrene', 'ps-pse-1', 'Полистирол ПСЭ-1', 'Полистирол эмульсионный общего назначения', 30, true)
on conflict (id) do update
set category_id = excluded.category_id,
    slug = excluded.slug,
    name = excluded.name,
    description = excluded.description,
    sort = excluded.sort;

-- Подкатегории Деталей машиностроения
insert into public.subcategories (id, category_id, slug, name, description, sort, is_active) values
('extrusion-parts', 'machine-parts', 'parts-extrusion', 'Экструзионные изделия', 'Профили, трубки, уплотнители', 10, true),
('injection-parts', 'machine-parts', 'parts-injection', 'Литьевые изделия', 'Накладки, вставки, защитные элементы', 20, true)
on conflict (id) do update
set category_id = excluded.category_id,
    slug = excluded.slug,
    name = excluded.name,
    description = excluded.description,
    sort = excluded.sort;

-- Подкатегории Товаров народного потребления (включая канистры и ящики)
-- Примечание: Основные подкатегории ТНП добавляются через миграцию 008_add_household_products.sql
-- Здесь добавляем только канистры и ящики, которые переносятся из отдельных категорий
insert into public.subcategories (id, category_id, slug, name, description, image, sort, is_active) values
('canisters', 'hoztovary', 'canisters', 'Канистры', 'Пластиковые канистры различного объема (3л, 5л, 10л, 20л, 30л) для хранения жидкостей', '/images/products/canisters.jpg', 80, true),
('boxes', 'hoztovary', 'boxes', 'Ящики', 'Пластиковые ящики для хранения и транспортировки (под заказ)', '/images/products/boxes.jpg', 90, true)
on conflict (id) do update
set category_id = excluded.category_id,
    slug = excluded.slug,
    name = excluded.name,
    description = excluded.description,
    image = excluded.image,
    sort = excluded.sort,
    is_active = excluded.is_active;

-- Готово! Теперь можно добавлять товары через Supabase UI
