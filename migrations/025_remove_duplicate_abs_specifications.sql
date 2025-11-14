-- ============================================================
-- Удаление дублирующихся характеристик в товарах АБС и полистироле
-- Оставляет только ключи с подчеркиваниями (для фильтрации)
-- Удаляет дубликаты с красивыми названиями
-- ============================================================

DO $$
DECLARE
  product_record RECORD;
  updated_specs JSONB;
  abs_keys_to_remove TEXT[] := ARRAY[
    'Плотность',
    'Усадка',
    'Показатель текучести расплава (MFR)',
    'Относительное удлинение при разрыве',
    'Ударная вязкость по Изоду',
    'Предел текучести при растяжении',
    'Температура размягчения по Вика',
    'Блеск'
  ];
  polystyrene_keys_to_remove TEXT[] := ARRAY[
    'Плотность',
    'Разрушающее напряжение',
    'Кажущаяся плотность',
    'Применение_текст'
  ];
  key_to_remove TEXT;
BEGIN
  -- Обрабатываем все товары категории АБС
  FOR product_record IN 
    SELECT id, specifications, category_id
    FROM public.products
    WHERE category_id IN ('abs', 'polystyrene')
    AND specifications IS NOT NULL
  LOOP
    updated_specs := product_record.specifications;
    
    -- Удаляем дубликаты в зависимости от категории
    IF product_record.category_id = 'abs' THEN
      FOREACH key_to_remove IN ARRAY abs_keys_to_remove
      LOOP
        updated_specs := updated_specs - key_to_remove;
      END LOOP;
    ELSIF product_record.category_id = 'polystyrene' THEN
      FOREACH key_to_remove IN ARRAY polystyrene_keys_to_remove
      LOOP
        updated_specs := updated_specs - key_to_remove;
      END LOOP;
    END IF;
    
    -- Обновляем товар с очищенными характеристиками
    UPDATE public.products
    SET specifications = updated_specs,
        updated_at = NOW()
    WHERE id = product_record.id;
  END LOOP;
END $$;

-- Проверка: выводим обновленные характеристики для АБС-1515-31
SELECT 
  id,
  name,
  jsonb_object_keys(specifications) as spec_key
FROM public.products
WHERE category_id = 'abs'
AND id = 'abs-1515-31'
ORDER BY spec_key;

-- Проверка: выводим обновленные характеристики для ПСВ-С марка 1
SELECT 
  id,
  name,
  jsonb_object_keys(specifications) as spec_key
FROM public.products
WHERE category_id = 'polystyrene'
AND id = 'psv-s-1'
ORDER BY spec_key;

