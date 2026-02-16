-- ============================================================
-- Фото канистр и категории — одно фото kanistra
-- ============================================================
-- Все канистры и карточка подкатегории: /images/xoztov/kanistra.jpeg

UPDATE public.products
SET image = '/images/xoztov/kanistra.jpeg'
WHERE subcategory_id = 'canisters';

UPDATE public.subcategories
SET image = '/images/xoztov/kanistra.jpeg'
WHERE id = 'canisters';
