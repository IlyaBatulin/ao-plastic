-- ========================================
-- Обновление изображений хозяйственных товаров
-- ========================================

-- Обновляем изображения и добавляем артикулы в specifications

-- Ведро BASE 9,5 л
UPDATE public.products 
SET 
  image = '/images/xoztov/П2701.jpg',
  specifications = jsonb_set(specifications, '{Артикул}', '"П2701"')
WHERE id = 'vedro-base-95l';

-- Совок BASE
UPDATE public.products 
SET 
  image = '/images/xoztov/П2703.jpg',
  specifications = jsonb_set(specifications, '{Артикул}', '"П2703"')
WHERE id = 'sovok-base';

-- Совок с резинкой BASE
UPDATE public.products 
SET 
  image = '/images/xoztov/П2704.jpg',
  specifications = jsonb_set(specifications, '{Артикул}', '"П2704"')
WHERE id = 'sovok-s-rezinkoy-base';

-- Совок
UPDATE public.products 
SET 
  image = '/images/xoztov/П2705.jpg',
  specifications = jsonb_set(specifications, '{Артикул}', '"П2705"')
WHERE id = 'sovok';

-- Совок с резинкой
UPDATE public.products 
SET 
  image = '/images/xoztov/П2706.jpg',
  specifications = jsonb_set(specifications, '{Артикул}', '"П2706"')
WHERE id = 'sovok-s-rezinkoy';

-- Совок ERGO
UPDATE public.products 
SET 
  image = '/images/xoztov/П2707.jpg',
  specifications = jsonb_set(specifications, '{Артикул}', '"П2707"')
WHERE id = 'sovok-ergo';

-- Совок с резинкой ERGO
UPDATE public.products 
SET 
  image = '/images/xoztov/П2708.jpg',
  specifications = jsonb_set(specifications, '{Артикул}', '"П2708"')
WHERE id = 'sovok-s-rezinkoy-ergo';

-- Набор, совок и щетка
UPDATE public.products 
SET 
  image = '/images/xoztov/П2709.jpg',
  specifications = jsonb_set(specifications, '{Артикул}', '"П2709"')
WHERE id = 'nabor-sovok-shchetka';

-- Набор, совок с резинкой и щетка
UPDATE public.products 
SET 
  image = '/images/xoztov/П2710.jpg',
  specifications = jsonb_set(specifications, '{Артикул}', '"П2710"')
WHERE id = 'nabor-sovok-s-rezinkoy-shchetka';

-- Щетка-сметка
UPDATE public.products 
SET 
  image = '/images/xoztov/П2711.jpg',
  specifications = jsonb_set(specifications, '{Артикул}', '"П2711"')
WHERE id = 'shchetka-smetka';

-- Пылевыбивалка
UPDATE public.products 
SET 
  image = '/images/xoztov/П2093.jpg',
  specifications = jsonb_set(specifications, '{Артикул}', '"П2093"')
WHERE id = 'pylevybivalka';

-- Стеклоочиститель с абразивом
UPDATE public.products 
SET 
  image = '/images/xoztov/П2713.jpg',
  specifications = jsonb_set(specifications, '{Артикул}', '"П2713"')
WHERE id = 'stekloochistitel-s-abrazivom';

-- Стеклоочиститель ERGO
UPDATE public.products 
SET 
  image = '/images/xoztov/П2714.jpg',
  specifications = jsonb_set(specifications, '{Артикул}', '"П2714"')
WHERE id = 'stekloochistitel-ergo';

-- Стеклоочиститель ERGO с черенком 60 см
UPDATE public.products 
SET 
  image = '/images/xoztov/П2715.jpg',
  specifications = jsonb_set(specifications, '{Артикул}', '"П2715"')
WHERE id = 'stekloochistitel-ergo-s-cherenkom';

-- Комплект для туалета Компакт
UPDATE public.products 
SET 
  image = '/images/xoztov/П2716.jpg',
  specifications = jsonb_set(specifications, '{Артикул}', '"П2716"')
WHERE id = 'komplekt-dlya-tualeta-kompakt';

-- Комплект для туалета
UPDATE public.products 
SET 
  image = '/images/xoztov/П2717.jpg',
  specifications = jsonb_set(specifications, '{Артикул}', '"П2717"')
WHERE id = 'komplekt-dlya-tualeta';

-- Комплект для туалета ERGO
UPDATE public.products 
SET 
  image = '/images/xoztov/П2718.jpg',
  specifications = jsonb_set(specifications, '{Артикул}', '"П2718"')
WHERE id = 'komplekt-dlya-tualeta-ergo';

-- Мыльница
UPDATE public.products 
SET 
  image = '/images/xoztov/П1611.jpg',
  specifications = jsonb_set(specifications, '{Артикул}', '"П1611"')
WHERE id = 'mylnitsa';

-- Фильтр-сеточка для раковины
UPDATE public.products 
SET 
  image = '/images/xoztov/П1802.jpg',
  specifications = jsonb_set(specifications, '{Артикул}', '"П1802"')
WHERE id = 'filtr-setochka';

-- Воронка d=120 мм
UPDATE public.products 
SET 
  image = '/images/xoztov/П2040.jpg',
  specifications = jsonb_set(specifications, '{Артикул}', '"П2040"')
WHERE id = 'voronka-120mm';

-- Кружка 0,2 л (артикул П1834, оставляем placeholder)
UPDATE public.products 
SET 
  image = '/images/xoztov/П1834.jpg',
  specifications = jsonb_set(specifications, '{Артикул}', '"П1834"')
WHERE id = 'kruzhka-02l';

-- Вешалка-плечики р.36-38
UPDATE public.products 
SET 
  image = '/images/xoztov/П1896.jpg',
  specifications = jsonb_set(specifications, '{Артикул}', '"П1896"')
WHERE id = 'veshalka-plechiki-36-38';

-- Вешалка-плечики р.48-50
UPDATE public.products 
SET 
  image = '/images/xoztov/П1881.jpg',
  specifications = jsonb_set(specifications, '{Артикул}', '"П1881"')
WHERE id = 'veshalka-plechiki-48-50';

-- Вешалка-плечики р.52-54
UPDATE public.products 
SET 
  image = '/images/xoztov/П1889.jpg',
  specifications = jsonb_set(specifications, '{Артикул}', '"П1889"')
WHERE id = 'veshalka-plechiki-52-54';

-- Вешалка-плечики с поворотным крюком, р.44-46
UPDATE public.products 
SET 
  image = '/images/xoztov/П2154.jpg',
  specifications = jsonb_set(specifications, '{Артикул}', '"П2154"')
WHERE id = 'veshalka-plechiki-povorotnyy-44-46';

-- Вешалка-плечики с поворотным крючком, р.48-50
UPDATE public.products 
SET 
  image = '/images/xoztov/П2720.jpg',
  specifications = jsonb_set(specifications, '{Артикул}', '"П2720"')
WHERE id = 'veshalka-plechiki-povorotnyy-48-50';

-- Веер для раздува огня
UPDATE public.products 
SET 
  image = '/images/xoztov/П2721.jpg',
  specifications = jsonb_set(specifications, '{Артикул}', '"П2721"')
WHERE id = 'veer-dlya-razduva-ognya';

UPDATE public.products 
SET 
  image = '/images/xoztov/П494.jpg',
  specifications = jsonb_set(specifications, '{Артикул}', '"П494"')
WHERE id = 'sovok-dlya-musora';

-- Ведро 2,5 л
UPDATE public.products 
SET 
  image = '/images/xoztov/П2049.jpg',
  specifications = jsonb_set(specifications, '{Артикул}', '"П2049"')
WHERE id = 'vedro-25l';

UPDATE public.products 
SET 
  image = '/images/xoztov/П1916.jpg',
  specifications = jsonb_set(specifications, '{Артикул}', '"П1916"')
WHERE id = 'vedro-5l';

UPDATE public.products 
SET 
  image = '/images/xoztov/П2168.jpg',
  specifications = jsonb_set(specifications, '{Артикул}', '"П2168"')
WHERE id = 'vedro-7l';

UPDATE public.products 
SET 
  image = '/images/xoztov/П2172.jpg',
  specifications = jsonb_set(specifications, '{Артикул}', '"П2172"')
WHERE id = 'vedro-10l';

-- Таз 10 л
UPDATE public.products 
SET 
  image = '/images/xoztov/П2171.jpg',
  specifications = jsonb_set(specifications, '{Артикул}', '"П2171"')
WHERE id = 'taz-10l';

UPDATE public.products 
SET 
  image = '/images/xoztov/П2061.jpg',
  specifications = jsonb_set(specifications, '{Артикул}', '"П2061"')
WHERE id = 'taz-15l';

