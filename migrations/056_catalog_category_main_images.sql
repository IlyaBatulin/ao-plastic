-- ============================================================
-- Главные фото категорий в каталоге (обложки карточек на /products)
-- Файлы в public: absiplast_main.png, polist_main.png, stirol_main.png, kors_bentol_main.png, hoztov_main.png, machine_main.png
-- ============================================================

UPDATE public.categories
SET image = '/images/absiplast_main.png'
WHERE id = 'abs';

UPDATE public.categories
SET image = '/images/polist_main.png'
WHERE id = 'polystyrene';

UPDATE public.categories
SET image = '/stirol_main.png'
WHERE id = 'styrene';

UPDATE public.categories
SET image = '/images/kors_bentol_main.png'
WHERE id = 'kors';

UPDATE public.categories
SET image = '/images/hoztov_main.png'
WHERE id = 'hoztovary';

UPDATE public.categories
SET image = '/images/machine_main.png'
WHERE id = 'machine-parts';
