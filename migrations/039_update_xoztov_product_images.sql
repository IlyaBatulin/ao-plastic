-- Обновление фото товаров: названия фото совпадают с id продукта
-- Путь: /images/xoztov/{id}.jpeg

UPDATE public.products SET image = '/images/xoztov/taz-10l.jpeg'        WHERE id = 'taz-10l';
UPDATE public.products SET image = '/images/xoztov/vedro-5l.jpeg'      WHERE id = 'vedro-5l';
UPDATE public.products SET image = '/images/xoztov/vedro-7l.jpeg'      WHERE id = 'vedro-7l';
UPDATE public.products SET image = '/images/xoztov/vedro-10l.jpeg'     WHERE id = 'vedro-10l';
UPDATE public.products SET image = '/images/xoztov/vedro-25l.jpeg'      WHERE id = 'vedro-25l';
UPDATE public.products SET image = '/images/xoztov/vedro-base-95l.jpeg' WHERE id = 'vedro-base-95l';
