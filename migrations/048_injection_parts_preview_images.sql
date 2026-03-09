-- ============================================================
-- Литьевые изделия ДМС — подстановка фото из ПРЕВЬЮ/литье
-- ============================================================
-- Фото лежат в public/ПРЕВЬЮ/литье/; имена вида "СП КА-02_1.jpeg", "СП КА-02_1.jpeg" и т.д.
-- Для карточки товара ставим основное превью: _0, если нет _0 — _1.
-- Путь в БД: /ПРЕВЬЮ/литье/{имя файла} (файлы отдаются из public).
-- Обновляем только товары категории machine-parts, подкатегории injection-parts.
-- ============================================================

UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-02_1.jpeg'           WHERE id = 'ka-02' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-10А_1.jpeg'           WHERE id = 'ka-10a' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-19_1.jpeg'          WHERE id = 'ka-19' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-23_1.jpeg'          WHERE id = 'ka-23' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-25Б_1.jpeg'          WHERE id = 'ka-25b' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-27Б_1.jpeg'          WHERE id = 'ka-27b' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-28Б_1.jpeg'          WHERE id = 'ka-28b' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-37,38_1.jpeg'        WHERE id = 'ka-37-ka-38' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-39А_1.jpeg'          WHERE id = 'ka-39a' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-43_1.jpeg'            WHERE id = 'ka-43' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-44_1.jpeg'           WHERE id = 'ka-44' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-46А_1.jpeg'          WHERE id = 'ka-46a' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-50А_1.jpeg'          WHERE id = 'ka-50a' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-51_1.jpeg'           WHERE id = 'ka-51' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-53_1.jpeg'           WHERE id = 'ka-53' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-54А_1.jpeg'          WHERE id = 'ka-54a' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-55_1.jpeg'            WHERE id = 'ka-55' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-56Р_1.jpeg'           WHERE id = 'ka-56r' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-62А_1.jpeg'          WHERE id = 'ka-62a' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-65_1.jpeg'           WHERE id = 'ka-65' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-70_1.jpeg'           WHERE id = 'ka-70' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-80_1.jpeg'            WHERE id = 'ka-80' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-83А_1.jpeg'          WHERE id = 'ka-83a' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-89_1.jpeg'            WHERE id = 'ka-89' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-96_1.jpeg'           WHERE id = 'ka-96' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-122_1.jpeg'          WHERE id = 'ka-122' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-123_1.jpeg'          WHERE id = 'ka-123' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-124_1.jpeg'          WHERE id = 'ka-124' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-128_1.jpeg'           WHERE id = 'ka-128' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-132_1.jpeg'          WHERE id = 'ka-132' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-133А_1.jpeg'         WHERE id = 'ka-133a' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-280А_1.jpeg'         WHERE id = 'ka-280a' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-281А_1.jpeg'         WHERE id = 'ka-281a' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-282А_1.jpeg'         WHERE id = 'ka-282a' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП  КА-283_1.jpeg'         WHERE id = 'ka-283' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-284_1.jpeg'          WHERE id = 'ka-284' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-285_1.jpeg'          WHERE id = 'ka-285' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-286А_1.jpeg'         WHERE id = 'ka-286a' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-287А_1.jpeg'         WHERE id = 'ka-287a' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП  КА-288А_1.jpeg'        WHERE id = 'ka-288a' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-343А_1.jpeg'         WHERE id = 'ka-343a' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-345А_1.jpeg'         WHERE id = 'ka-345a' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-346_1.jpeg'         WHERE id = 'ka-346' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-551Б_1.jpeg'         WHERE id = 'ka-551b' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-552_1.jpeg'          WHERE id = 'ka-552' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-553_1.jpeg'           WHERE id = 'ka-553' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-554А_1.jpeg'         WHERE id = 'ka-554a' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-555_1.jpeg'           WHERE id = 'ka-555' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-560_1.jpeg'          WHERE id = 'ka-560' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-561_1.jpeg'          WHERE id = 'ka-561' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-562_1.jpeg'          WHERE id = 'ka-562' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП  КА-564_1.jpeg'         WHERE id = 'ka-564' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП  КА-565_1.jpeg'         WHERE id = 'ka-565' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-568_1.jpeg'         WHERE id = 'ka-568' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-568А_1.jpeg'         WHERE id = 'ka-568a' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-572_1.jpeg'           WHERE id = 'ka-572' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-572А_1.jpeg'         WHERE id = 'ka-572a' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-583_1.jpeg'          WHERE id = 'ka-583' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-585_1.jpeg'           WHERE id = 'ka-585' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-586_1.jpeg'           WHERE id = 'ka-586' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-586А_1.jpeg'         WHERE id = 'ka-586a' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-587_1.jpeg'           WHERE id = 'ka-587' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-589_1.jpeg'          WHERE id = 'ka-589' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-590_1.jpeg'           WHERE id = 'ka-590' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП КА-603_1.jpeg'           WHERE id = 'ka-603' AND subcategory_id = 'injection-parts';
UPDATE public.products SET image = '/ПРЕВЬЮ/литье/СП ММЗ-10_1.jpeg'          WHERE id = 'mmz-10' AND subcategory_id = 'injection-parts';

-- Товары без фото _0/_1 в папке литье: ka-41a, ka-114, ka-510, f-226-1, f-226-2 — image не меняем.
-- При добавлении КА-134 (Шкала управления отоплением) или КА-287А (Проставка): image = '/ПРЕВЬЮ/литье/СП КА-134_1.jpeg' или '/ПРЕВЬЮ/литье/СП КА-287А_1.jpeg'.
