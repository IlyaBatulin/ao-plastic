-- ============================================================
-- Экструзионные изделия ДМС — подстановка фото из ПРЕВЬЮ/трубки
-- ============================================================
-- Фото: public/ПРЕВЬЮ/трубки/; имена вида "СП 2321-01_1.jpeg", "СП Ф-08Б_1.jpeg".
-- Совпадение по полю code. Один файл может относиться к нескольким шифрам (тогда один путь на несколько строк).
-- ============================================================

-- Колонка image может отсутствовать, если миграция 050 не выполнялась
ALTER TABLE public.extrusion_products
  ADD COLUMN IF NOT EXISTS image TEXT;

UPDATE public.extrusion_products SET image = '/ПРЕВЬЮ/трубки/СП Ф-29В_1.jpeg'        WHERE code = 'Ф-29В';
UPDATE public.extrusion_products SET image = '/ПРЕВЬЮ/трубки/СП Ф-08Б_1.jpeg'        WHERE code = 'Ф-08Б';
UPDATE public.extrusion_products SET image = '/ПРЕВЬЮ/трубки/СП Ф-10Б_1.jpeg'        WHERE code = 'Ф-10Б';
UPDATE public.extrusion_products SET image = '/ПРЕВЬЮ/трубки/СП 2321-01_1.jpeg'      WHERE code = '2321-01';
UPDATE public.extrusion_products SET image = '/ПРЕВЬЮ/трубки/СП Ф-11_1.jpeg'          WHERE code = 'Ф-11';
UPDATE public.extrusion_products SET image = '/ПРЕВЬЮ/трубки/СП Ф-11_1.jpeg'          WHERE code = 'Ф-11Б';
UPDATE public.extrusion_products SET image = '/ПРЕВЬЮ/трубки/СП 2321-04_1.jpeg'      WHERE code = '2321-04';
UPDATE public.extrusion_products SET image = '/ПРЕВЬЮ/трубки/СП Г-03_1.jpeg'          WHERE code = 'Г-03';
UPDATE public.extrusion_products SET image = '/ПРЕВЬЮ/трубки/СП 2321-01_1.jpeg'      WHERE code = '2321';
UPDATE public.extrusion_products SET image = '/ПРЕВЬЮ/трубки/СП 2488_1.jpeg'          WHERE code = '2488';
UPDATE public.extrusion_products SET image = '/ПРЕВЬЮ/трубки/СП 2158_1.jpeg'          WHERE code = '2158';
UPDATE public.extrusion_products SET image = '/ПРЕВЬЮ/трубки/СП 2158-02_1.jpeg'       WHERE code = '2158-02';
UPDATE public.extrusion_products SET image = '/ПРЕВЬЮ/трубки/СП Ф-23_1.jpeg'          WHERE code = 'Ф-23';
UPDATE public.extrusion_products SET image = '/ПРЕВЬЮ/трубки/СП Ф-30_1.jpeg'          WHERE code = 'Ф-30';
UPDATE public.extrusion_products SET image = '/ПРЕВЬЮ/трубки/СП Ф-31_1.jpeg'          WHERE code = 'Ф-31';
UPDATE public.extrusion_products SET image = '/ПРЕВЬЮ/трубки/СП Ф-124Л, Ф-124К_1.jpeg' WHERE code IN ('Ф-124Л', 'Ф-124К');
UPDATE public.extrusion_products SET image = '/ПРЕВЬЮ/трубки/СП Ф-138, 142_1.jpeg'      WHERE code IN ('Ф-138', 'Ф-142');
UPDATE public.extrusion_products SET image = '/ПРЕВЬЮ/трубки/СП Ф-154И_1.jpeg'        WHERE code = 'Ф-154';
UPDATE public.extrusion_products SET image = '/ПРЕВЬЮ/трубки/СП Ф-181_1.jpeg'        WHERE code = 'Ф-181';
UPDATE public.extrusion_products SET image = '/ПРЕВЬЮ/трубки/СП 2320_1.jpeg'          WHERE code = '2320';
UPDATE public.extrusion_products SET image = '/ПРЕВЬЮ/трубки/СП Ф-182_1.jpeg'        WHERE code = 'Ф-182';
UPDATE public.extrusion_products SET image = '/ПРЕВЬЮ/трубки/СП 2320-01_1.jpeg'       WHERE code = '2320-01';
UPDATE public.extrusion_products SET image = '/ПРЕВЬЮ/трубки/СП Ф-183_1.jpeg'        WHERE code = 'Ф-183';
UPDATE public.extrusion_products SET image = '/ПРЕВЬЮ/трубки/СП 2320-02_1.jpeg'       WHERE code = '2320-02';
UPDATE public.extrusion_products SET image = '/ПРЕВЬЮ/трубки/СП Ф-184_1.jpeg'        WHERE code = 'Ф-184';
UPDATE public.extrusion_products SET image = '/ПРЕВЬЮ/трубки/СП 2320-03_1.jpeg'       WHERE code = '2320-03';
UPDATE public.extrusion_products SET image = '/ПРЕВЬЮ/трубки/СП Ф-185_1.jpeg'        WHERE code = 'Ф-185';
UPDATE public.extrusion_products SET image = '/ПРЕВЬЮ/трубки/СП 2320-04_1.jpeg'       WHERE code = '2320-04';
UPDATE public.extrusion_products SET image = '/ПРЕВЬЮ/трубки/СП Ф-186_1.jpeg'        WHERE code = 'Ф-186';
UPDATE public.extrusion_products SET image = '/ПРЕВЬЮ/трубки/СП 2320-05_1.jpeg'       WHERE code = '2320-05';
UPDATE public.extrusion_products SET image = '/ПРЕВЬЮ/трубки/СП Ф-187_1.jpeg'        WHERE code = 'Ф-187';
UPDATE public.extrusion_products SET image = '/ПРЕВЬЮ/трубки/СП 2320-06_1.jpeg'       WHERE code = '2320-06';
UPDATE public.extrusion_products SET image = '/ПРЕВЬЮ/трубки/СП 2320-07_1.jpeg'       WHERE code = '2320-07';
UPDATE public.extrusion_products SET image = '/ПРЕВЬЮ/трубки/СП 2320-09_1.jpeg'       WHERE code = '2320-09';
UPDATE public.extrusion_products SET image = '/ПРЕВЬЮ/трубки/СП КА-30_1.jpeg'         WHERE code = 'КА-30';
UPDATE public.extrusion_products SET image = '/ПРЕВЬЮ/трубки/СП ИМ-03_1.jpeg'         WHERE code = 'ИМ-03';
UPDATE public.extrusion_products SET image = '/ПРЕВЬЮ/трубки/СП 2321-02_1.jpeg'      WHERE code = '2321-02';
UPDATE public.extrusion_products SET image = '/ПРЕВЬЮ/трубки/СП АЗЛК -248_1.jpeg'    WHERE code = 'АЗЛК-248';
UPDATE public.extrusion_products SET image = '/ПРЕВЬЮ/трубки/СП УАЗ-02_1.jpeg'       WHERE code = 'УАЗ-02';
UPDATE public.extrusion_products SET image = '/ПРЕВЬЮ/трубки/СП КА-523_1.jpeg'       WHERE code = 'КА-523';
UPDATE public.extrusion_products SET image = '/ПРЕВЬЮ/трубки/СП КА-524_1.jpeg'       WHERE code = 'КА-524';
UPDATE public.extrusion_products SET image = '/ПРЕВЬЮ/трубки/СП 2147-04,06_1.jpeg'     WHERE code IN ('2147-04', '2147-06');
UPDATE public.extrusion_products SET image = '/ПРЕВЬЮ/трубки/СП 2148-03_1.jpeg'      WHERE code = '2148-02';
UPDATE public.extrusion_products SET image = '/ПРЕВЬЮ/трубки/СП 2148-03_1.jpeg'      WHERE code = '2148-03';
UPDATE public.extrusion_products SET image = '/ПРЕВЬЮ/трубки/СП 2516_1.jpeg'          WHERE code = '2516';
UPDATE public.extrusion_products SET image = '/ПРЕВЬЮ/трубки/СП 2187_1.jpeg'          WHERE code = '2187';

-- Без подходящего _1 в папке трубки: Ф-188, Ф-191, АЗЛК-253 — image не меняем.

-- ============================================================
-- Добавление позиций, которых не было в каталоге (есть фото _1 в трубки)
-- size_raw = «Превью по документу» — чтобы на карточке была характеристика как у других (с фото).
-- ============================================================

INSERT INTO public.extrusion_products (
  type, subtype, name, size_raw, size_a_mm, size_b_mm, size_note,
  code, length_raw, length_kind, length_mm, length_tolerance_raw, source_no, image
) VALUES
  ('Трубка', NULL, 'По документу (шифр МКП-01)', 'Превью по документу', NULL, NULL, NULL, 'МКП-01', 'поставка в бухтах', 'coil', NULL, NULL, 74, '/ПРЕВЬЮ/трубки/СП МКП-01_1.jpeg'),
  ('Трубка', NULL, 'По документу (шифр РЛ-232)', 'Превью по документу', NULL, NULL, NULL, 'РЛ-232', 'поставка в бухтах', 'coil', NULL, NULL, 75, '/ПРЕВЬЮ/трубки/СП РЛ-232_1.jpeg'),
  ('Трубка', NULL, 'По документу (шифр РУС-02А)', 'Превью по документу', NULL, NULL, NULL, 'РУС-02А', 'поставка в бухтах', 'coil', NULL, NULL, 76, '/ПРЕВЬЮ/трубки/СП РУС-02А, 02Б_1.jpeg'),
  ('Трубка', NULL, 'По документу (шифр РУС-02Б)', 'Превью по документу', NULL, NULL, NULL, 'РУС-02Б', 'поставка в бухтах', 'coil', NULL, NULL, 77, '/ПРЕВЬЮ/трубки/СП РУС-02А, 02Б_1.jpeg'),
  ('Трубка', NULL, 'По документу (шифр РУС-03)', 'Превью по документу', NULL, NULL, NULL, 'РУС-03', 'поставка в бухтах', 'coil', NULL, NULL, 78, '/ПРЕВЬЮ/трубки/СП РУС-03_1.jpeg'),
  ('Трубка', NULL, 'По документу (шифр РУС-03-2А)', 'Превью по документу', NULL, NULL, NULL, 'РУС-03-2А', 'поставка в бухтах', 'coil', NULL, NULL, 79, '/ПРЕВЬЮ/трубки/СП РУС-03-2(А, 2(Б_1.jpeg'),
  ('Трубка', NULL, 'По документу (шифр РУС-03-2Б)', 'Превью по документу', NULL, NULL, NULL, 'РУС-03-2Б', 'поставка в бухтах', 'coil', NULL, NULL, 80, '/ПРЕВЬЮ/трубки/СП РУС-03-2(А, 2(Б_1.jpeg'),
  ('Трубка', NULL, 'По документу (шифр РУС-04А)', 'Превью по документу', NULL, NULL, NULL, 'РУС-04А', 'поставка в бухтах', 'coil', NULL, NULL, 81, '/ПРЕВЬЮ/трубки/СП РУС-04А, 04Б_1.jpeg'),
  ('Трубка', NULL, 'По документу (шифр РУС-04Б)', 'Превью по документу', NULL, NULL, NULL, 'РУС-04Б', 'поставка в бухтах', 'coil', NULL, NULL, 82, '/ПРЕВЬЮ/трубки/СП РУС-04А, 04Б_1.jpeg'),
  ('Трубка', NULL, 'По документу (шифр РУС-108)', 'Превью по документу', NULL, NULL, NULL, 'РУС-108', 'поставка в бухтах', 'coil', NULL, NULL, 83, '/ПРЕВЬЮ/трубки/СП РУС-108_1.jpeg'),
  ('Трубка', NULL, 'По документу (шифр РУС-12)', 'Превью по документу', NULL, NULL, NULL, 'РУС-12', 'поставка в бухтах', 'coil', NULL, NULL, 84, '/ПРЕВЬЮ/трубки/СП РУС-12_1.jpeg'),
  ('Трубка', NULL, 'По документу (шифр РУС-24)', 'Превью по документу', NULL, NULL, NULL, 'РУС-24', 'поставка в бухтах', 'coil', NULL, NULL, 85, '/ПРЕВЬЮ/трубки/СП РУС-24_1.jpeg'),
  ('Трубка', NULL, 'По документу (шифр РУС-31)', 'Превью по документу', NULL, NULL, NULL, 'РУС-31', 'поставка в бухтах', 'coil', NULL, NULL, 86, '/ПРЕВЬЮ/трубки/СП РУС-31, 31А, 31Б, 31В_1.jpeg'),
  ('Трубка', NULL, 'По документу (шифр РУС-31А)', 'Превью по документу', NULL, NULL, NULL, 'РУС-31А', 'поставка в бухтах', 'coil', NULL, NULL, 87, '/ПРЕВЬЮ/трубки/СП РУС-31, 31А, 31Б, 31В_1.jpeg'),
  ('Трубка', NULL, 'По документу (шифр РУС-31Б)', 'Превью по документу', NULL, NULL, NULL, 'РУС-31Б', 'поставка в бухтах', 'coil', NULL, NULL, 88, '/ПРЕВЬЮ/трубки/СП РУС-31, 31А, 31Б, 31В_1.jpeg'),
  ('Трубка', NULL, 'По документу (шифр РУС-31В)', 'Превью по документу', NULL, NULL, NULL, 'РУС-31В', 'поставка в бухтах', 'coil', NULL, NULL, 89, '/ПРЕВЬЮ/трубки/СП РУС-31, 31А, 31Б, 31В_1.jpeg'),
  ('Трубка', NULL, 'По документу (шифр РУС-33)', 'Превью по документу', NULL, NULL, NULL, 'РУС-33', 'поставка в бухтах', 'coil', NULL, NULL, 90, '/ПРЕВЬЮ/трубки/СП РУС-33_1.jpeg'),
  ('Трубка', NULL, 'По документу (шифр РУС-42)', 'Превью по документу', NULL, NULL, NULL, 'РУС-42', 'поставка в бухтах', 'coil', NULL, NULL, 91, '/ПРЕВЬЮ/трубки/СП РУС-42_1.jpeg'),
  ('Трубка', NULL, 'По документу (шифр Г-08)', 'Превью по документу', NULL, NULL, NULL, 'Г-08', 'поставка в бухтах', 'coil', NULL, NULL, 92, '/ПРЕВЬЮ/трубки/СП Г-08_1.jpeg'),
  ('Трубка', NULL, 'По документу (шифр ГЛ-860)', 'Превью по документу', NULL, NULL, NULL, 'ГЛ-860', 'поставка в бухтах', 'coil', NULL, NULL, 93, '/ПРЕВЬЮ/трубки/СП ГЛ-860,860А,860Б,860В_1.jpeg'),
  ('Трубка', NULL, 'По документу (шифр ГЛ-860А)', 'Превью по документу', NULL, NULL, NULL, 'ГЛ-860А', 'поставка в бухтах', 'coil', NULL, NULL, 94, '/ПРЕВЬЮ/трубки/СП ГЛ-860,860А,860Б,860В_1.jpeg'),
  ('Трубка', NULL, 'По документу (шифр ГЛ-860Б)', 'Превью по документу', NULL, NULL, NULL, 'ГЛ-860Б', 'поставка в бухтах', 'coil', NULL, NULL, 95, '/ПРЕВЬЮ/трубки/СП ГЛ-860,860А,860Б,860В_1.jpeg'),
  ('Трубка', NULL, 'По документу (шифр ГЛ-860В)', 'Превью по документу', NULL, NULL, NULL, 'ГЛ-860В', 'поставка в бухтах', 'coil', NULL, NULL, 96, '/ПРЕВЬЮ/трубки/СП ГЛ-860,860А,860Б,860В_1.jpeg'),
  ('Трубка', NULL, 'По документу (шифр 2900)', 'Превью по документу', NULL, NULL, NULL, '2900', 'поставка в бухтах', 'coil', NULL, NULL, 97, '/ПРЕВЬЮ/трубки/СП 2900_1.jpeg'),
  ('Трубка', NULL, 'По документу (шифр 2974)', 'Превью по документу', NULL, NULL, NULL, '2974', 'поставка в бухтах', 'coil', NULL, NULL, 98, '/ПРЕВЬЮ/трубки/СП 2974_1.jpeg'),
  ('Трубка', NULL, 'По документу (шифр Ф-22)', 'Превью по документу', NULL, NULL, NULL, 'Ф-22', 'поставка в бухтах', 'coil', NULL, NULL, 99, '/ПРЕВЬЮ/трубки/СП Ф-22_1.jpeg'),
  ('Трубка', NULL, 'По документу (шифр Ф-225)', 'Превью по документу', NULL, NULL, NULL, 'Ф-225', 'поставка в бухтах', 'coil', NULL, NULL, 100, '/ПРЕВЬЮ/трубки/СП Ф-225_1.jpeg'),
  ('Трубка', NULL, 'По документу (шифр Ф-190)', 'Превью по документу', NULL, NULL, NULL, 'Ф-190', 'поставка в бухтах', 'coil', NULL, NULL, 101, '/ПРЕВЬЮ/трубки/СП Ф-190_1.jpeg');

-- Миграцию выполнять один раз. Наименования и размеры при сверке с документами можно обновить вручную.
