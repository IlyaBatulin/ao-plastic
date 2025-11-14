-- ============================================================
-- ТОВАРЫ ПСВ-С (7 МАРОК)
-- Используем изображение категории для всех товаров
-- ============================================================

-- Получаем изображение категории
DO $$
DECLARE
  v_category_image text;
BEGIN
  SELECT image INTO v_category_image
  FROM public.categories
  WHERE id = 'polystyrene';
  
  -- Если изображения нет, используем стандартное
  IF v_category_image IS NULL THEN
    v_category_image := '/images/polystyrene-warehouse.png';
  END IF;

  -- ПСВ-С марка 1
  INSERT INTO public.products (id, slug, category_id, subcategory_id, name, brand, type, description, image, specifications, is_active, sort)
  VALUES (
    'psv-s-1',
    'psv-s-1',
    'polystyrene',
    'ps-psv-s',
    'ПСВ-С марка 1',
    'ПСВ-С',
    'Гранулы',
    'Лёгкий вспенивающийся полистирол с крупной гранулой. Применяется для фасадного декора, упаковочных материалов и изделий, не требующих высокой плотности.',
    v_category_image,
    jsonb_build_object(
      'Фракция', '> 2,5 мм',
      'Фракция_мин', 2.5,
      'Фракция_макс', null,
      'Плотность_кг_м3', 10,
      'Плотность', 'до 10 кг/м³',
      'Разрушающее_напряжение_МПа', 0.14,
      'Разрушающее_напряжение', '0,14 МПа',
      'Кажущаяся_плотность_кг_м3', 20,
      'Кажущаяся_плотность', '20 кг/м³',
      'Порообразователь', '5,7 %',
      'Порообразователь_число', 5.7,
      'Остаточный_мономер', '0,2 %',
      'Потеря_массы_при_сушке', '0,8 %',
      'Применение', ARRAY['DIY-сегмент', 'розничные рынки', 'упаковка', 'декоративные формы'],
      'Применение_текст', 'DIY-сегмент, розничные рынки, упаковка, декоративные формы'
    ),
    true,
    10
  )
  ON CONFLICT (id) DO UPDATE SET
    slug = EXCLUDED.slug,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    specifications = EXCLUDED.specifications,
    sort = EXCLUDED.sort;

  -- ПСВ-С марка 2
  INSERT INTO public.products (id, slug, category_id, subcategory_id, name, brand, type, description, image, specifications, is_active, sort)
  VALUES (
    'psv-s-2',
    'psv-s-2',
    'polystyrene',
    'ps-psv-s',
    'ПСВ-С марка 2',
    'ПСВ-С',
    'Гранулы',
    'Универсальная марка для строительных и отделочных решений. Отличается стабильной структурой и равномерным распределением гранул.',
    v_category_image,
    jsonb_build_object(
      'Фракция', '1,6 – 2,8 мм',
      'Фракция_мин', 1.6,
      'Фракция_макс', 2.8,
      'Плотность_кг_м3_мин', 13,
      'Плотность_кг_м3_макс', 14,
      'Плотность', '13 – 14 кг/м³',
      'Разрушающее_напряжение_МПа', 0.14,
      'Разрушающее_напряжение', '0,14 МПа',
      'Кажущаяся_плотность_кг_м3', 20,
      'Кажущаяся_плотность', '20 кг/м³',
      'Порообразователь', '5,5 %',
      'Порообразователь_число', 5.5,
      'Остаточный_мономер', '0,2 %',
      'Потеря_массы_при_сушке', '0,8 %',
      'Применение', ARRAY['утепление стен', 'фасады', 'СИП-панели', 'розничные рынки'],
      'Применение_текст', 'утепление стен, фасады, СИП-панели, розничные рынки'
    ),
    true,
    20
  )
  ON CONFLICT (id) DO UPDATE SET
    slug = EXCLUDED.slug,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    specifications = EXCLUDED.specifications,
    sort = EXCLUDED.sort;

  -- ПСВ-С марка 3
  INSERT INTO public.products (id, slug, category_id, subcategory_id, name, brand, type, description, image, specifications, is_active, sort)
  VALUES (
    'psv-s-3',
    'psv-s-3',
    'polystyrene',
    'ps-psv-s',
    'ПСВ-С марка 3',
    'ПСВ-С',
    'Гранулы',
    'Марка средней плотности с отличной формоустойчивостью. Подходит для теплоизоляционных плит и фасадных систем.',
    v_category_image,
    jsonb_build_object(
      'Фракция', '1,0 – 1,6 мм',
      'Фракция_мин', 1.0,
      'Фракция_макс', 1.6,
      'Плотность_кг_м3', 15,
      'Плотность', '15 кг/м³',
      'Разрушающее_напряжение_МПа', 0.14,
      'Разрушающее_напряжение', '0,14 МПа',
      'Кажущаяся_плотность_кг_м3', 20,
      'Кажущаяся_плотность', '20 кг/м³',
      'Порообразователь', '5,3 %',
      'Порообразователь_число', 5.3,
      'Остаточный_мономер', '0,2 %',
      'Потеря_массы_при_сушке', '0,8 %',
      'Применение', ARRAY['СИП-панели', 'фасады', 'сэндвич-конструкции', 'утепление стен'],
      'Применение_текст', 'СИП-панели, фасады, сэндвич-конструкции, утепление стен'
    ),
    true,
    30
  )
  ON CONFLICT (id) DO UPDATE SET
    slug = EXCLUDED.slug,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    specifications = EXCLUDED.specifications,
    sort = EXCLUDED.sort;

  -- ПСВ-С марка 4
  INSERT INTO public.products (id, slug, category_id, subcategory_id, name, brand, type, description, image, specifications, is_active, sort)
  VALUES (
    'psv-s-4',
    'psv-s-4',
    'polystyrene',
    'ps-psv-s',
    'ПСВ-С марка 4',
    'ПСВ-С',
    'Гранулы',
    'Мелкозернистая структура, высокая прочность. Идеален для пресс-вспенивания и точной формовки.',
    v_category_image,
    jsonb_build_object(
      'Фракция', '0,6 – 1,0 мм',
      'Фракция_мин', 0.6,
      'Фракция_макс', 1.0,
      'Плотность_кг_м3_мин', 16,
      'Плотность_кг_м3_макс', 17,
      'Плотность', '16 – 17 кг/м³',
      'Разрушающее_напряжение_МПа', 0.28,
      'Разрушающее_напряжение', '0,28 МПа',
      'Кажущаяся_плотность_кг_м3', 40,
      'Кажущаяся_плотность', '40 кг/м³',
      'Порообразователь', '5,2 %',
      'Порообразователь_число', 5.2,
      'Остаточный_мономер', '0,2 %',
      'Потеря_массы_при_сушке', '1,0 %',
      'Применение', ARRAY['декоративные панели', 'упаковка', 'элементы отделки'],
      'Применение_текст', 'декоративные панели, упаковка, элементы отделки'
    ),
    true,
    40
  )
  ON CONFLICT (id) DO UPDATE SET
    slug = EXCLUDED.slug,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    specifications = EXCLUDED.specifications,
    sort = EXCLUDED.sort;

  -- ПСВ-С марка 5
  INSERT INTO public.products (id, slug, category_id, subcategory_id, name, brand, type, description, image, specifications, is_active, sort)
  VALUES (
    'psv-s-5',
    'psv-s-5',
    'polystyrene',
    'ps-psv-s',
    'ПСВ-С марка 5',
    'ПСВ-С',
    'Гранулы',
    'Плотный и прочный материал для несущих элементов и наружной теплоизоляции. Обеспечивает устойчивость к влаге и нагрузкам.',
    v_category_image,
    jsonb_build_object(
      'Фракция', '0,4 – 0,7 мм',
      'Фракция_мин', 0.4,
      'Фракция_макс', 0.7,
      'Плотность_кг_м3_мин', 18,
      'Плотность_кг_м3_макс', 20,
      'Плотность', '18 – 20 кг/м³',
      'Разрушающее_напряжение_МПа', null,
      'Разрушающее_напряжение', '—',
      'Кажущаяся_плотность_кг_м3_мин', 45,
      'Кажущаяся_плотность', '> 45 кг/м³',
      'Порообразователь', '4,5 %',
      'Порообразователь_число', 4.5,
      'Остаточный_мономер', '0,2 %',
      'Потеря_массы_при_сушке', '1,0 %',
      'Применение', ARRAY['АДЭ', 'фундаменты', 'утепление кровли'],
      'Применение_текст', 'АДЭ, фундаменты, утепление кровли'
    ),
    true,
    50
  )
  ON CONFLICT (id) DO UPDATE SET
    slug = EXCLUDED.slug,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    specifications = EXCLUDED.specifications,
    sort = EXCLUDED.sort;

  -- ПСВ-С марка 5М
  INSERT INTO public.products (id, slug, category_id, subcategory_id, name, brand, type, description, image, specifications, is_active, sort)
  VALUES (
    'psv-s-5m',
    'psv-s-5m',
    'polystyrene',
    'ps-psv-s',
    'ПСВ-С марка 5М',
    'ПСВ-С',
    'Гранулы',
    'Модифицированный вариант ПСВ-С 5 с антипиреном. Имеет улучшенную огнестойкость и повышенную плотность.',
    v_category_image,
    jsonb_build_object(
      'Фракция', '0,4 – 0,7 мм',
      'Фракция_мин', 0.4,
      'Фракция_макс', 0.7,
      'Плотность_кг_м3_мин', 20,
      'Плотность_кг_м3_макс', 22,
      'Плотность', '20 – 22 кг/м³',
      'Разрушающее_напряжение_МПа', 0.28,
      'Разрушающее_напряжение', '0,28 МПа',
      'Кажущаяся_плотность_кг_м3_мин', 45,
      'Кажущаяся_плотность', '> 45 кг/м³',
      'Порообразователь', '4,7 %',
      'Порообразователь_число', 4.7,
      'Остаточный_мономер', '0,2 %',
      'Потеря_массы_при_сушке', '1,0 %',
      'Применение', ARRAY['кровля', 'стяжки', 'промышленные утеплители'],
      'Применение_текст', 'кровля, стяжки, промышленные утеплители'
    ),
    true,
    55
  )
  ON CONFLICT (id) DO UPDATE SET
    slug = EXCLUDED.slug,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    specifications = EXCLUDED.specifications,
    sort = EXCLUDED.sort;

  -- ПСВ-С марка 6
  INSERT INTO public.products (id, slug, category_id, subcategory_id, name, brand, type, description, image, specifications, is_active, sort)
  VALUES (
    'psv-s-6',
    'psv-s-6',
    'polystyrene',
    'ps-psv-s',
    'ПСВ-С марка 6',
    'ПСВ-С',
    'Гранулы',
    'Самая плотная марка линейки. Применяется в строительстве и промышленной теплоизоляции, устойчива к механическим нагрузкам и деформации.',
    v_category_image,
    jsonb_build_object(
      'Фракция', '< 0,4 мм',
      'Фракция_мин', null,
      'Фракция_макс', 0.4,
      'Плотность_кг_м3_мин', 25,
      'Плотность_кг_м3_макс', 37,
      'Плотность', '25 – 37 кг/м³',
      'Разрушающее_напряжение_МПа', 0.14,
      'Разрушающее_напряжение', '0,14 МПа',
      'Кажущаяся_плотность_кг_м3', 22,
      'Кажущаяся_плотность', '22 кг/м³',
      'Порообразователь', '4,8 %',
      'Порообразователь_число', 4.8,
      'Остаточный_мономер', '0,2 %',
      'Потеря_массы_при_сушке', '1,5 %',
      'Применение', ARRAY['фундаменты', 'несущие блоки', 'технические изделия'],
      'Применение_текст', 'фундаменты, несущие блоки, технические изделия'
    ),
    true,
    60
  )
  ON CONFLICT (id) DO UPDATE SET
    slug = EXCLUDED.slug,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    specifications = EXCLUDED.specifications,
    sort = EXCLUDED.sort;

END $$;

-- Проверка: выводим добавленные товары
SELECT 
  p.id,
  p.name,
  p.slug,
  p.is_active,
  p.sort,
  (p.specifications->>'Плотность') as density,
  (p.specifications->>'Фракция') as fraction,
  (p.specifications->>'Применение_текст') as application
FROM public.products p
WHERE p.subcategory_id = 'ps-psv-s'
ORDER BY p.sort;

