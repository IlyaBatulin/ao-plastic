-- ============================================================
-- Экструзионные изделия ДМС — переключение изображений на /images/extrusion
-- ============================================================
-- Источник файлов: public/images/extrusion
-- Для товаров без персонального файла ставим /images/extrusion/logo123.jpg
-- ============================================================

UPDATE public.extrusion_products SET image = '/images/extrusion/СП Ф-29В_1.jpg' WHERE code = 'Ф-29В';
UPDATE public.extrusion_products SET image = '/images/extrusion/СП Ф-08Б_1.jpg' WHERE code = 'Ф-08Б';
UPDATE public.extrusion_products SET image = '/images/extrusion/СП Ф-10Б_1.jpg' WHERE code = 'Ф-10Б';
UPDATE public.extrusion_products SET image = '/images/extrusion/СП 2321-01_1.jpg' WHERE code = '2321-01';
UPDATE public.extrusion_products SET image = '/images/extrusion/СП Ф-11_1.jpg' WHERE code = 'Ф-11';
UPDATE public.extrusion_products SET image = '/images/extrusion/СП Ф-11_1.jpg' WHERE code = 'Ф-11Б';
UPDATE public.extrusion_products SET image = '/images/extrusion/СП 2321-04_1.jpg' WHERE code = '2321-04';
UPDATE public.extrusion_products SET image = '/images/extrusion/СП Г-03_1.jpg' WHERE code = 'Г-03';
UPDATE public.extrusion_products SET image = '/images/extrusion/СП 2321-01_1.jpg' WHERE code = '2321';
UPDATE public.extrusion_products SET image = '/images/extrusion/СП 2488_1.jpg' WHERE code = '2488';
UPDATE public.extrusion_products SET image = '/images/extrusion/СП 2158_1.jpg' WHERE code = '2158';
UPDATE public.extrusion_products SET image = '/images/extrusion/СП 2158-02_1.jpg' WHERE code = '2158-02';
UPDATE public.extrusion_products SET image = '/images/extrusion/СП Ф-23_1.jpg' WHERE code = 'Ф-23';
UPDATE public.extrusion_products SET image = '/images/extrusion/СП Ф-30_1.jpg' WHERE code = 'Ф-30';
UPDATE public.extrusion_products SET image = '/images/extrusion/СП Ф-31_1.jpg' WHERE code = 'Ф-31';
UPDATE public.extrusion_products SET image = '/images/extrusion/СП Ф-124Л, Ф-124К_1.jpg' WHERE code IN ('Ф-124Л', 'Ф-124К');
UPDATE public.extrusion_products SET image = '/images/extrusion/СП Ф-138, 142_1.jpg' WHERE code IN ('Ф-138', 'Ф-142');
UPDATE public.extrusion_products SET image = '/images/extrusion/СП Ф-154И_1.jpg' WHERE code = 'Ф-154';
UPDATE public.extrusion_products SET image = '/images/extrusion/СП Ф-181_1.jpg' WHERE code = 'Ф-181';
UPDATE public.extrusion_products SET image = '/images/extrusion/СП 2320_1.jpg' WHERE code = '2320';
UPDATE public.extrusion_products SET image = '/images/extrusion/СП Ф-182_1.jpg' WHERE code = 'Ф-182';
UPDATE public.extrusion_products SET image = '/images/extrusion/СП 2320-01_1.jpg' WHERE code = '2320-01';
UPDATE public.extrusion_products SET image = '/images/extrusion/СП Ф-183_1.jpg' WHERE code = 'Ф-183';
UPDATE public.extrusion_products SET image = '/images/extrusion/СП 2320-02_1.jpg' WHERE code = '2320-02';
UPDATE public.extrusion_products SET image = '/images/extrusion/СП Ф-184_1.jpg' WHERE code = 'Ф-184';
UPDATE public.extrusion_products SET image = '/images/extrusion/СП 2320-03_1.jpg' WHERE code = '2320-03';
UPDATE public.extrusion_products SET image = '/images/extrusion/СП Ф-185_1.jpg' WHERE code = 'Ф-185';
UPDATE public.extrusion_products SET image = '/images/extrusion/СП 2320-04_1.jpg' WHERE code = '2320-04';
UPDATE public.extrusion_products SET image = '/images/extrusion/СП Ф-186_1.jpg' WHERE code = 'Ф-186';
UPDATE public.extrusion_products SET image = '/images/extrusion/СП 2320-05_1.jpg' WHERE code = '2320-05';
UPDATE public.extrusion_products SET image = '/images/extrusion/СП Ф-187_1.jpg' WHERE code = 'Ф-187';
UPDATE public.extrusion_products SET image = '/images/extrusion/СП 2320-06_1.jpg' WHERE code = '2320-06';
UPDATE public.extrusion_products SET image = '/images/extrusion/СП 2320-07_1.jpg' WHERE code = '2320-07';
UPDATE public.extrusion_products SET image = '/images/extrusion/СП 2320-09_1.jpg' WHERE code = '2320-09';
UPDATE public.extrusion_products SET image = '/images/extrusion/СП КА-30_1.jpg' WHERE code = 'КА-30';
UPDATE public.extrusion_products SET image = '/images/extrusion/СП ИМ-03_1.jpg' WHERE code = 'ИМ-03';
UPDATE public.extrusion_products SET image = '/images/extrusion/СП 2321-02_1.jpg' WHERE code = '2321-02';
UPDATE public.extrusion_products SET image = '/images/extrusion/СП АЗЛК -248_1.jpg' WHERE code = 'АЗЛК-248';
UPDATE public.extrusion_products SET image = '/images/extrusion/СП УАЗ-02_1.jpg' WHERE code = 'УАЗ-02';
UPDATE public.extrusion_products SET image = '/images/extrusion/СП КА-523_1.jpg' WHERE code = 'КА-523';
UPDATE public.extrusion_products SET image = '/images/extrusion/СП КА-524_1.jpg' WHERE code = 'КА-524';
UPDATE public.extrusion_products SET image = '/images/extrusion/СП 2147-04,06_1.jpg' WHERE code IN ('2147-04', '2147-06');
UPDATE public.extrusion_products SET image = '/images/extrusion/СП 2148-03_1.jpg' WHERE code IN ('2148-02', '2148-03');
UPDATE public.extrusion_products SET image = '/images/extrusion/СП 2516_1.jpg' WHERE code = '2516';
UPDATE public.extrusion_products SET image = '/images/extrusion/СП 2187_1.jpg' WHERE code = '2187';

-- Позиции, добавленные в каталог отдельной миграцией.
UPDATE public.extrusion_products SET image = '/images/extrusion/СП МКП-01_1.jpg' WHERE code = 'МКП-01';
UPDATE public.extrusion_products SET image = '/images/extrusion/СП РЛ-232_1.jpg' WHERE code = 'РЛ-232';
UPDATE public.extrusion_products SET image = '/images/extrusion/СП РУС-02А, 02Б_1.jpg' WHERE code IN ('РУС-02А', 'РУС-02Б');
UPDATE public.extrusion_products SET image = '/images/extrusion/СП РУС-03_1.jpg' WHERE code = 'РУС-03';
UPDATE public.extrusion_products SET image = '/images/extrusion/СП РУС-03-2(А, 2(Б_1.jpg' WHERE code IN ('РУС-03-2А', 'РУС-03-2Б');
UPDATE public.extrusion_products SET image = '/images/extrusion/СП РУС-04А, 04Б_1.jpg' WHERE code IN ('РУС-04А', 'РУС-04Б');
UPDATE public.extrusion_products SET image = '/images/extrusion/СП РУС-108_1.jpg' WHERE code = 'РУС-108';
UPDATE public.extrusion_products SET image = '/images/extrusion/СП РУС-12_1.jpg' WHERE code = 'РУС-12';
UPDATE public.extrusion_products SET image = '/images/extrusion/СП РУС-24_1.jpg' WHERE code = 'РУС-24';
UPDATE public.extrusion_products SET image = '/images/extrusion/СП РУС-31, 31А, 31Б, 31В_1.jpg' WHERE code IN ('РУС-31', 'РУС-31А', 'РУС-31Б', 'РУС-31В');
UPDATE public.extrusion_products SET image = '/images/extrusion/СП РУС-33_1.jpg' WHERE code = 'РУС-33';
UPDATE public.extrusion_products SET image = '/images/extrusion/СП РУС-42_1.jpg' WHERE code = 'РУС-42';
UPDATE public.extrusion_products SET image = '/images/extrusion/СП Г-08_1.jpg' WHERE code = 'Г-08';
UPDATE public.extrusion_products SET image = '/images/extrusion/СП ГЛ-860,860А,860Б,860В_1.jpg' WHERE code IN ('ГЛ-860', 'ГЛ-860А', 'ГЛ-860Б', 'ГЛ-860В');
UPDATE public.extrusion_products SET image = '/images/extrusion/СП 2900_1.jpg' WHERE code = '2900';
UPDATE public.extrusion_products SET image = '/images/extrusion/СП 2974_1.jpg' WHERE code = '2974';
UPDATE public.extrusion_products SET image = '/images/extrusion/СП Ф-22_1.jpg' WHERE code = 'Ф-22';
UPDATE public.extrusion_products SET image = '/images/extrusion/СП Ф-225_1.jpg' WHERE code = 'Ф-225';
UPDATE public.extrusion_products SET image = '/images/extrusion/СП Ф-190_1.jpg' WHERE code = 'Ф-190';

-- Дополнительные файлы, присутствующие в папке extrusion.
UPDATE public.extrusion_products SET image = '/images/extrusion/СП Ф-104_1.jpg' WHERE code = 'Ф-104';
UPDATE public.extrusion_products SET image = '/images/extrusion/СП Ф-123_1.jpg' WHERE code = 'Ф-123';
UPDATE public.extrusion_products SET image = '/images/extrusion/СП 2321-03_1.jpg' WHERE code = '2321-03';

-- Для товаров без персонального фото в папке extrusion.
UPDATE public.extrusion_products
SET image = '/images/extrusion/logo123.jpg'
WHERE image IS NULL OR image = '' OR image NOT LIKE '/images/extrusion/%';
