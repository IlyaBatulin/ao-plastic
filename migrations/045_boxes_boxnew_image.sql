-- Фото ящиков: public/images/xoztov/boxnew.jpeg → /images/xoztov/boxnew.jpeg
UPDATE public.products
SET image = '/images/xoztov/boxnew.jpeg'
WHERE subcategory_id = 'boxes';

UPDATE public.subcategories
SET image = '/images/xoztov/boxnew.jpeg'
WHERE id = 'boxes';
