-- ============================================================
-- Литьевые изделия ДМС — добавление товаров в products
-- ============================================================
-- Категория: machine-parts, подкатегория: injection-parts (Литьевые изделия)
-- ID и наименование из перечня; slug = id в нижнем регистре, / → -, кириллица → латиница
--
-- Про архитектуру: литьевые изделия хранятся в products (как и остальной каталог).
-- Экструзионные изделия пока в отдельной таблице extrusion_products из-за своей
-- структуры (type, code, length_kind, source_no и т.д.). Объединять или нет — см. README_EXTRUSION.md.

INSERT INTO public.products (id, category_id, subcategory_id, slug, name, specifications, sort, is_active)
VALUES
  ('ka-02', 'machine-parts', 'injection-parts', 'ka-02', 'Скрепка', '{"Артикул": "КА-02"}'::jsonb, 1, true),
  ('ka-10a', 'machine-parts', 'injection-parts', 'ka-10a', 'Пробка транспортная', '{"Артикул": "КА-10А"}'::jsonb, 2, true),
  ('ka-19', 'machine-parts', 'injection-parts', 'ka-19', 'Втулка', '{"Артикул": "КА-19"}'::jsonb, 3, true),
  ('ka-23', 'machine-parts', 'injection-parts', 'ka-23', 'Втулка', '{"Артикул": "КА-23"}'::jsonb, 4, true),
  ('ka-25b', 'machine-parts', 'injection-parts', 'ka-25b', 'Крышка верхняя рулевого колеса', '{"Артикул": "КА-25Б"}'::jsonb, 5, true),
  ('ka-27b', 'machine-parts', 'injection-parts', 'ka-27b', 'Крышка нижняя рулевого колеса', '{"Артикул": "КА-27Б"}'::jsonb, 6, true),
  ('ka-28b', 'machine-parts', 'injection-parts', 'ka-28b', 'Рамка выключателей', '{"Артикул": "КА-28Б"}'::jsonb, 7, true),
  ('ka-37-ka-38', 'machine-parts', 'injection-parts', 'ka-37-ka-38', 'Накладка панели', '{"Артикул": "КА-37/КА-38"}'::jsonb, 8, true),
  ('ka-39a', 'machine-parts', 'injection-parts', 'ka-39a', 'Штабик крыши', '{"Артикул": "КА-39А"}'::jsonb, 9, true),
  ('ka-41a', 'machine-parts', 'injection-parts', 'ka-41a', 'Заглушка отверстия внутренней панели двери', '{"Артикул": "КА-41А"}'::jsonb, 10, true),
  ('ka-43', 'machine-parts', 'injection-parts', 'ka-43', 'Колпачок', '{"Артикул": "КА-43"}'::jsonb, 11, true),
  ('ka-44', 'machine-parts', 'injection-parts', 'ka-44', 'Заглушка отверстия Ø20,5', '{"Артикул": "КА-44"}'::jsonb, 12, true),
  ('ka-46a', 'machine-parts', 'injection-parts', 'ka-46a', 'Розетка ручки', '{"Артикул": "КА-46А"}'::jsonb, 13, true),
  ('ka-50a', 'machine-parts', 'injection-parts', 'ka-50a', 'Ролик шарнира подвески сиденья водителя', '{"Артикул": "КА-50А"}'::jsonb, 14, true),
  ('ka-51', 'machine-parts', 'injection-parts', 'ka-51', 'Окантовка трубы торсиона подвески сиденья водителя', '{"Артикул": "КА-51"}'::jsonb, 15, true),
  ('ka-53', 'machine-parts', 'injection-parts', 'ka-53', 'Втулка оси шарниров подвески сиденья водителя', '{"Артикул": "КА-53"}'::jsonb, 16, true),
  ('ka-54a', 'machine-parts', 'injection-parts', 'ka-54a', 'Облицовка ручки регулирования торсиона подвески сиденья водителя', '{"Артикул": "КА-54А"}'::jsonb, 17, true),
  ('ka-55', 'machine-parts', 'injection-parts', 'ka-55', 'Ограничитель винта регулирования подвески сиденья водителя', '{"Артикул": "КА-55"}'::jsonb, 18, true),
  ('ka-56r', 'machine-parts', 'injection-parts', 'ka-56r', 'Упор пружины ручки регулирования торсиона', '{"Артикул": "КА-56Р"}'::jsonb, 19, true),
  ('ka-62a', 'machine-parts', 'injection-parts', 'ka-62a', 'Распределитель воздуха', '{"Артикул": "КА-62А"}'::jsonb, 20, true),
  ('ka-65', 'machine-parts', 'injection-parts', 'ka-65', 'Фланец крепления распределителя воздуха', '{"Артикул": "КА-65"}'::jsonb, 21, true),
  ('ka-70', 'machine-parts', 'injection-parts', 'ka-70', 'Крючок для одежды', '{"Артикул": "КА-70"}'::jsonb, 22, true),
  ('ka-80', 'machine-parts', 'injection-parts', 'ka-80', 'Скрепка', '{"Артикул": "КА-80"}'::jsonb, 23, true),
  ('ka-83a', 'machine-parts', 'injection-parts', 'ka-83a', 'Петля шторы спального места', '{"Артикул": "КА-83А"}'::jsonb, 24, true),
  ('ka-89', 'machine-parts', 'injection-parts', 'ka-89', 'Проставка крыла', '{"Артикул": "КА-89"}'::jsonb, 25, true),
  ('ka-96', 'machine-parts', 'injection-parts', 'ka-96', 'Скрепка', '{"Артикул": "КА-96"}'::jsonb, 26, true),
  ('ka-114', 'machine-parts', 'injection-parts', 'ka-114', 'Кружка емкостью 1 л.', '{"Артикул": "КА-114"}'::jsonb, 27, true),
  ('ka-122', 'machine-parts', 'injection-parts', 'ka-122', 'Пробка', '{"Артикул": "КА-122"}'::jsonb, 28, true),
  ('ka-123', 'machine-parts', 'injection-parts', 'ka-123', 'Пробка транспортная', '{"Артикул": "КА-123"}'::jsonb, 29, true),
  ('ka-124', 'machine-parts', 'injection-parts', 'ka-124', 'Пробка транспортная', '{"Артикул": "КА-124"}'::jsonb, 30, true),
  ('ka-128', 'machine-parts', 'injection-parts', 'ka-128', 'Патрубок подводящий распределителя воздуха', '{"Артикул": "КА-128"}'::jsonb, 31, true),
  ('ka-132', 'machine-parts', 'injection-parts', 'ka-132', 'Колодка фиксатора', '{"Артикул": "КА-132"}'::jsonb, 32, true),
  ('ka-133a', 'machine-parts', 'injection-parts', 'ka-133a', 'Ручка управления', '{"Артикул": "КА-133А"}'::jsonb, 33, true),
  ('ka-280a', 'machine-parts', 'injection-parts', 'ka-280a', 'Чистильщик', '{"Артикул": "КА-280А"}'::jsonb, 34, true),
  ('ka-281a', 'machine-parts', 'injection-parts', 'ka-281a', 'Чистильщик', '{"Артикул": "КА-281А"}'::jsonb, 35, true),
  ('ka-282a', 'machine-parts', 'injection-parts', 'ka-282a', 'Чистильщик', '{"Артикул": "КА-282А"}'::jsonb, 36, true),
  ('ka-283', 'machine-parts', 'injection-parts', 'ka-283', 'Кольцо защитное', '{"Артикул": "КА-283"}'::jsonb, 37, true),
  ('ka-284', 'machine-parts', 'injection-parts', 'ka-284', 'Кольцо защитное', '{"Артикул": "КА-284"}'::jsonb, 38, true),
  ('ka-285', 'machine-parts', 'injection-parts', 'ka-285', 'Кольцо защитное', '{"Артикул": "КА-285"}'::jsonb, 39, true),
  ('ka-286a', 'machine-parts', 'injection-parts', 'ka-286a', 'Проставка', '{"Артикул": "КА-286А"}'::jsonb, 40, true),
  ('ka-288a', 'machine-parts', 'injection-parts', 'ka-288a', 'Проставка', '{"Артикул": "КА-288А"}'::jsonb, 41, true),
  ('ka-343a', 'machine-parts', 'injection-parts', 'ka-343a', 'Направляющий диск', '{"Артикул": "КА-343А"}'::jsonb, 42, true),
  ('ka-345a', 'machine-parts', 'injection-parts', 'ka-345a', 'Поршень', '{"Артикул": "КА-345А"}'::jsonb, 43, true),
  ('ka-346', 'machine-parts', 'injection-parts', 'ka-346', 'Мембранный диск', '{"Артикул": "КА-346"}'::jsonb, 44, true),
  ('ka-510', 'machine-parts', 'injection-parts', 'ka-510', 'Хомут крепления тормозов', '{"Артикул": "КА-510"}'::jsonb, 45, true),
  ('ka-551b', 'machine-parts', 'injection-parts', 'ka-551b', 'Гайка-барашек', '{"Артикул": "КА-551Б"}'::jsonb, 46, true),
  ('ka-552', 'machine-parts', 'injection-parts', 'ka-552', 'Лента', '{"Артикул": "КА-552"}'::jsonb, 47, true),
  ('ka-553', 'machine-parts', 'injection-parts', 'ka-553', 'Кольцо опорное', '{"Артикул": "КА-553"}'::jsonb, 48, true),
  ('ka-554a', 'machine-parts', 'injection-parts', 'ka-554a', 'Тарелка пружины', '{"Артикул": "КА-554А"}'::jsonb, 49, true),
  ('ka-555', 'machine-parts', 'injection-parts', 'ka-555', 'Втулка', '{"Артикул": "КА-555"}'::jsonb, 50, true),
  ('ka-560', 'machine-parts', 'injection-parts', 'ka-560', 'Корпус клапана', '{"Артикул": "КА-560"}'::jsonb, 51, true),
  ('ka-561', 'machine-parts', 'injection-parts', 'ka-561', 'Поршень', '{"Артикул": "КА-561"}'::jsonb, 52, true),
  ('ka-562', 'machine-parts', 'injection-parts', 'ka-562', 'Кольцо направляющее', '{"Артикул": "КА-562"}'::jsonb, 53, true),
  ('ka-564', 'machine-parts', 'injection-parts', 'ka-564', 'Кольцо направляющее', '{"Артикул": "КА-564"}'::jsonb, 54, true),
  ('ka-565', 'machine-parts', 'injection-parts', 'ka-565', 'Кольцо направляющее', '{"Артикул": "КА-565"}'::jsonb, 55, true),
  ('ka-568', 'machine-parts', 'injection-parts', 'ka-568', 'Крышка', '{"Артикул": "КА-568"}'::jsonb, 56, true),
  ('ka-568a', 'machine-parts', 'injection-parts', 'ka-568a', 'Крышка', '{"Артикул": "КА-568а"}'::jsonb, 57, true),
  ('ka-572', 'machine-parts', 'injection-parts', 'ka-572', 'Крышка', '{"Артикул": "КА-572"}'::jsonb, 58, true),
  ('ka-572a', 'machine-parts', 'injection-parts', 'ka-572a', 'Крышка', '{"Артикул": "КА-572А"}'::jsonb, 59, true),
  ('ka-583', 'machine-parts', 'injection-parts', 'ka-583', 'Пробка', '{"Артикул": "КА-583"}'::jsonb, 60, true),
  ('ka-585', 'machine-parts', 'injection-parts', 'ka-585', 'Колпачок направляющий', '{"Артикул": "КА-585"}'::jsonb, 61, true),
  ('ka-586', 'machine-parts', 'injection-parts', 'ka-586', 'Поршень', '{"Артикул": "КА-586"}'::jsonb, 62, true),
  ('ka-587', 'machine-parts', 'injection-parts', 'ka-587', 'Ролик', '{"Артикул": "КА-587"}'::jsonb, 63, true),
  ('ka-589', 'machine-parts', 'injection-parts', 'ka-589', 'Втулка', '{"Артикул": "КА-589"}'::jsonb, 64, true),
  ('ka-590', 'machine-parts', 'injection-parts', 'ka-590', 'Направляющая', '{"Артикул": "КА-590"}'::jsonb, 65, true),
  ('ka-603', 'machine-parts', 'injection-parts', 'ka-603', 'Крышка', '{"Артикул": "КА-603"}'::jsonb, 66, true),
  ('mmz-10', 'machine-parts', 'injection-parts', 'mmz-10', 'Заготовка втулки', '{"Артикул": "ММЗ-10"}'::jsonb, 67, true),
  ('f-226-1', 'machine-parts', 'injection-parts', 'f-226-1', 'Облицовка нижнего молдинга боковины левая', '{"Артикул": "Ф-226/I"}'::jsonb, 68, true),
  ('f-226-2', 'machine-parts', 'injection-parts', 'f-226-2', 'Облицовка нижнего молдинга боковины правая', '{"Артикул": "Ф-226/II"}'::jsonb, 69, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  specifications = EXCLUDED.specifications,
  sort = EXCLUDED.sort,
  subcategory_id = EXCLUDED.subcategory_id;

-- Готово!
