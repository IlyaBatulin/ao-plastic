-- ============================================================
-- ИМПОРТ КАТЕГОРИЙ И ПОДКАТЕГОРИЙ из data/products.json
-- ============================================================

-- Категории
insert into public.categories (id, slug, name, description, image, sort, is_active) values
('styrene', 'styrene', 'Стирол', 'Высококачественный стирол мономерный для производства полистирола и сополимеров', '/images/products/styrene.jpg', 10, true),
('abs', 'abs', 'АБС-пластики', 'Широкий ассортимент АБС-пластиков для различных применений (автопром, приборостроение, медицина)', '/images/products/abs-plastic.jpg', 20, true),
('polystyrene', 'polystyrene', 'Полистирол', 'Вспенивающийся и обычный полистирол различных марок для теплоизоляции и упаковки', '/images/products/polystyrene.jpg', 30, true),
('dispersion', 'dispersion', 'Дисперсия стирол-акриловая', 'Новый продукт для производства водоэмульсионных красок и покрытий', '/images/products/dispersion.jpg', 40, true),
('machine-parts', 'machine-parts', 'Детали машиностроения', 'Широкий ассортимент пластиковых деталей для автомобильной промышленности и машиностроения', '/images/products/machine-parts.jpg', 50, true),
('household', 'household', 'Хозтовары', 'Пластиковые изделия для бытового использования', '/images/products/household.jpg', 60, true),
('canisters', 'canisters', 'Канистры', 'Пластиковые канистры различного объема для хранения жидкостей', '/images/products/canisters.jpg', 70, true),
('boxes', 'boxes', 'Ящики', 'Пластиковые ящики для хранения и транспортировки', '/images/products/boxes.jpg', 80, true),
('helmets', 'helmets', 'Каски защитные', 'Защитные каски для строительных и промышленных работ', '/images/products/helmets.jpg', 90, true),
('masks', 'masks', 'Маски медицинские', 'Одноразовые медицинские маски', '/images/products/masks.jpg', 100, true),
('pvc-modifier', 'pvc-modifier', 'Модификатор для композиций ПВХ', 'Модификатор для улучшения свойств ПВХ композиций', '/images/products/pvc-modifier.jpg', 110, true),
('kors', 'kors', 'КОРС (кубовый остаток ректификации стирола)', 'Побочный продукт производства стирола, используется как топливо или компонент в ЛКМ', '/images/products/kors.jpg', 120, true),
('custom-abs', 'custom-abs', 'Изготовление изделий из АБС пластика на заказ', 'Производство изделий из АБС-пластика по индивидуальным заказам клиентов', '/images/products/custom-abs.jpg', 130, true)
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

-- Готово! Теперь можно добавлять товары через Supabase UI
