-- ========================================
-- Обновление изображений для категории "Хозяйственные товары"
-- ========================================

-- 1. Главное изображение категории
UPDATE public.categories
SET image = '/images/xoztov/П2701.jpg'
WHERE id = 'hoztovary';

-- 2. Изображения подкатегорий
UPDATE public.subcategories
SET image = '/images/xoztov/П2171.jpg'
WHERE id = 'vedra-tazy';

UPDATE public.subcategories
SET image = '/images/xoztov/П2709.jpg'
WHERE id = 'uborka';

UPDATE public.subcategories
SET image = '/images/xoztov/П2714.jpg'
WHERE id = 'steklo';

UPDATE public.subcategories
SET image = '/images/xoztov/П2717.jpg'
WHERE id = 'sanuzel';

UPDATE public.subcategories
SET image = '/images/xoztov/П2040.jpg'
WHERE id = 'kuhnya';

UPDATE public.subcategories
SET image = '/images/xoztov/П1896.jpg'
WHERE id = 'veshalki';

UPDATE public.subcategories
SET image = '/images/xoztov/П2721.jpg'
WHERE id = 'otdyh';

