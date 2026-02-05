-- ============================================================
-- ЭКСТРУЗИОННЫЕ ИЗДЕЛИЯ ДМС
-- Создание таблицы и seed данных из документа "Экструзионные изделия"
-- ============================================================

-- Создание таблицы extrusion_products
CREATE TABLE IF NOT EXISTS public.extrusion_products (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL CHECK (
    type IN (
      'Сепаратор',
      'Трубка',
      'Шланг',
      'Окантовка',
      'Профиль',
      'Втулка',
      'Прокладка',
      'Облицовка',
      'Накладка',
      'Молдинг'
    )
  ),
  subtype TEXT NULL,
  name TEXT NOT NULL,
  size_raw TEXT NULL,
  size_a_mm NUMERIC NULL,
  size_b_mm NUMERIC NULL,
  size_note TEXT NULL,
  code TEXT NOT NULL,
  length_raw TEXT NOT NULL,
  length_kind TEXT NOT NULL CHECK (length_kind IN ('coil', 'fixed')),
  length_mm NUMERIC NULL,
  length_tolerance_raw TEXT NULL,
  source_no INTEGER NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Индексы для оптимизации фильтрации
CREATE INDEX IF NOT EXISTS idx_extrusion_products_type ON public.extrusion_products(type);
CREATE INDEX IF NOT EXISTS idx_extrusion_products_code ON public.extrusion_products(code);
CREATE INDEX IF NOT EXISTS idx_extrusion_products_length_kind ON public.extrusion_products(length_kind);
CREATE INDEX IF NOT EXISTS idx_extrusion_products_source_no ON public.extrusion_products(source_no);
CREATE INDEX IF NOT EXISTS idx_extrusion_products_active ON public.extrusion_products(is_active);

-- RLS политики
ALTER TABLE public.extrusion_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "extrusion_products_select_public" ON public.extrusion_products;
CREATE POLICY "extrusion_products_select_public"
ON public.extrusion_products
FOR SELECT
TO public
USING (is_active = true);

COMMENT ON TABLE public.extrusion_products IS 'Экструзионные изделия ДМС';

-- ============================================================
-- SEED ДАННЫХ ИЗ ДОКУМЕНТА (52 строки)
-- ============================================================

INSERT INTO public.extrusion_products (
  type,
  subtype,
  name,
  size_raw,
  size_a_mm,
  size_b_mm,
  size_note,
  code,
  length_raw,
  length_kind,
  length_mm,
  length_tolerance_raw,
  source_no
) VALUES
  -- 1
  ('Сепаратор', NULL,
   'Сепаратор шариков салазок переднего сиденья',
   '5,3х2,3 мм', 5.3, 2.3, NULL,
   'Ф-29В',
   '155-2 мм', 'fixed', 155, '-2',
   1),

  -- 2
  ('Трубка', NULL,
   'Трубка от тройника к правому жиклеру фар',
   '3,8х2,0 мм', 3.8, 2.0, NULL,
   'Ф-08Б',
   'поставка в бухтах', 'coil', NULL, NULL,
   2),

  -- 3
  ('Трубка', NULL,
   'Трубка от насоса к тройнику омывателя ветрового окна',
   '6,0х4,0 мм', 6.0, 4.0, NULL,
   'Ф-10Б',
   'поставка в бухтах', 'coil', NULL, NULL,
   3),

  -- 4 (source_no = 5)
  ('Трубка', NULL,
   'Трубка',
   '6,0х4,0 мм', 6.0, 4.0, NULL,
   '2321-01',
   'поставка в бухтах', 'coil', NULL, NULL,
   5),

  -- 5 (source_no = 6)
  ('Шланг', NULL,
   'Шланг воздушный трубки топливного бака',
   '9,0х5,0 мм (с развальцовкой)', 9.0, 5.0, '(с развальцовкой)',
   'Ф-11',
   '1400+20 мм', 'fixed', 1400, '+20',
   6),

  -- 6 (source_no = 7)
  ('Шланг', NULL,
   'Шланг соединения сепаратора и паровой трубы',
   '9,0х5,0 мм', 9.0, 5.0, NULL,
   'Ф-11Б',
   'поставка в бухтах', 'coil', NULL, NULL,
   7),

  -- 7 (source_no = 8)
  ('Трубка', NULL,
   'Трубка',
   '9,0х5,0 мм', 9.0, 5.0, NULL,
   '2321-04',
   'поставка в бухтах', 'coil', NULL, NULL,
   8),

  -- 8 (source_no = 9)
  ('Трубка', NULL,
   'Трубка соединительная от расширительного бачка к радиатору',
   '20,0х13,0 мм', 20.0, 13.0, NULL,
   'Г-03',
   'поставка в бухтах', 'coil', NULL, NULL,
   9),

  -- 9 (source_no = 10)
  ('Трубка', NULL,
   'Трубка',
   '20,0х13,0 мм', 20.0, 13.0, NULL,
   '2321',
   'поставка в бухтах', 'coil', NULL, NULL,
   10),

  -- 10 (source_no = 11)
  ('Трубка', NULL,
   'Трубка',
   '20,0х13,0 мм', 20.0, 13.0, NULL,
   '2488',
   '660±5 мм', 'fixed', 660, '±5',
   11),

  -- 11 (source_no = 13)
  ('Окантовка', NULL,
   'Окантовка уплотнителя ветрового окна',
   '', NULL, NULL, NULL,
   '2158',
   'поставка в бухтах', 'coil', NULL, NULL,
   13),

  -- 12 (source_no = 15)
  ('Окантовка', NULL,
   'Окантовка уплотнителя ветрового окна',
   '', NULL, NULL, NULL,
   '2158-02',
   'поставка в бухтах', 'coil', NULL, NULL,
   15),

  -- 13 (source_no = 17)
  ('Профиль', NULL,
   'Профиль упора кожуха вентилятора',
   '6,5х4,4 мм', 6.5, 4.4, NULL,
   'Ф-23',
   'поставка в бухтах', 'coil', NULL, NULL,
   17),

  -- 14 (source_no = 19)
  ('Втулка', NULL,
   'Втулка кронштейна троса привода ручного тормоза',
   'ø 25х29', 25, 29, 'ø',
   'Ф-30',
   '35±2 мм', 'fixed', 35, '±2',
   19),

  -- 15 (source_no = 20)
  ('Трубка', NULL,
   'Трубка',
   '8,0х5,5 мм', 8.0, 5.5, NULL,
   'Ф-31',
   'поставка в бухтах', 'coil', NULL, NULL,
   20),

  -- 16 (source_no = 28)
  ('Шланг', NULL,
   'Шланг соединительный воздушных патрубков топливного бака и наливной трубы',
   '22,0х14,0 мм', 22.0, 14.0, NULL,
   'Ф-124Л',
   '1520+10 мм', 'fixed', 1520, '+10',
   28),

  -- 17 (source_no = 29)
  ('Шланг', NULL,
   'Шланг соединительный воздушных патрубков топливного бака и наливной трубы',
   '22,0х14,0 мм', 22.0, 14.0, NULL,
   'Ф-124К',
   'поставка в бухтах', 'coil', NULL, NULL,
   29),

  -- 18 (source_no = 30)
  ('Трубка', 'защитная',
   'Трубка защитная',
   '5х4 мм', 5, 4, NULL,
   'Ф-138',
   'поставка в бухтах', 'coil', NULL, NULL,
   30),

  -- 19 (source_no = 31)
  ('Трубка', 'защитная',
   'Трубка защитная',
   '5х4 мм', 5, 4, NULL,
   'Ф-142',
   'поставка в бухтах', 'coil', NULL, NULL,
   31),

  -- 20 (source_no = 32)
  ('Трубка', NULL,
   'Трубка',
   '7х5 мм', 7, 5, NULL,
   'Ф-154',
   'поставка в бухтах', 'coil', NULL, NULL,
   32),

  -- 21 (source_no = 33)
  ('Трубка', NULL,
   'Трубка',
   '12х8 мм', 12, 8, NULL,
   'Ф-181',
   'поставка в бухтах', 'coil', NULL, NULL,
   33),

  -- 22 (source_no = 34)
  ('Трубка', NULL,
   'Трубка',
   '12х8 мм', 12, 8, NULL,
   '2320',
   'поставка в бухтах', 'coil', NULL, NULL,
   34),

  -- 23 (source_no = 35)
  ('Трубка', NULL,
   'Трубка',
   '13х9 мм', 13, 9, NULL,
   'Ф-182',
   'поставка в бухтах', 'coil', NULL, NULL,
   35),

  -- 24 (source_no = 36)
  ('Трубка', NULL,
   'Трубка',
   '13х9 мм', 13, 9, NULL,
   '2320-01',
   'поставка в бухтах', 'coil', NULL, NULL,
   36),

  -- 25 (source_no = 37)
  ('Трубка', NULL,
   'Трубка',
   '14х10 мм', 14, 10, NULL,
   'Ф-183',
   'поставка в бухтах', 'coil', NULL, NULL,
   37),

  -- 26 (source_no = 38)
  ('Трубка', NULL,
   'Трубка',
   '14х10 мм', 14, 10, NULL,
   '2320-02',
   'поставка в бухтах', 'coil', NULL, NULL,
   38),

  -- 27 (source_no = 39)
  ('Трубка', NULL,
   'Трубка',
   '16х12 мм', 16, 12, NULL,
   'Ф-184',
   'поставка в бухтах', 'coil', NULL, NULL,
   39),

  -- 28 (source_no = 40)
  ('Трубка', NULL,
   'Трубка',
   '16х12 мм', 16, 12, NULL,
   '2320-03',
   'поставка в бухтах', 'coil', NULL, NULL,
   40),

  -- 29 (source_no = 42)
  ('Трубка', NULL,
   'Трубка',
   '18х14 мм', 18, 14, NULL,
   'Ф-185',
   'поставка в бухтах', 'coil', NULL, NULL,
   42),

  -- 30 (source_no = 43)
  ('Трубка', NULL,
   'Трубка',
   '18х14 мм', 18, 14, NULL,
   '2320-04',
   'поставка в бухтах', 'coil', NULL, NULL,
   43),

  -- 31 (source_no = 44)
  ('Трубка', NULL,
   'Трубка',
   '21х16 мм', 21, 16, NULL,
   'Ф-186',
   'поставка в бухтах', 'coil', NULL, NULL,
   44),

  -- 32 (source_no = 45)
  ('Трубка', NULL,
   'Трубка',
   '21х16 мм', 21, 16, NULL,
   '2320-05',
   'поставка в бухтах', 'coil', NULL, NULL,
   45),

  -- 33 (source_no = 46)
  ('Трубка', NULL,
   'Трубка',
   '26х20 мм', 26, 20, NULL,
   'Ф-187',
   'поставка в бухтах', 'coil', NULL, NULL,
   46),

  -- 34 (source_no = 47)
  ('Трубка', NULL,
   'Трубка',
   '26х20 мм', 26, 20, NULL,
   '2320-06',
   'поставка в бухтах', 'coil', NULL, NULL,
   47),

  -- 35 (source_no = 48)
  ('Трубка', NULL,
   'Трубка',
   '30х24 мм', 30, 24, NULL,
   'Ф-188',
   'поставка в бухтах', 'coil', NULL, NULL,
   48),

  -- 36 (source_no = 49)
  ('Трубка', NULL,
   'Трубка',
   '30х24 мм', 30, 24, NULL,
   '2320-07',
   'поставка в бухтах', 'coil', NULL, NULL,
   49),

  -- 37 (source_no = 50)
  ('Трубка', NULL,
   'Трубка',
   '36х30 мм', 36, 30, NULL,
   '2320-09',
   'поставка в бухтах', 'coil', NULL, NULL,
   50),

  -- 38 (source_no = 51)
  ('Трубка', NULL,
   'Трубка',
   '', NULL, NULL, NULL,
   'Ф-191',
   'поставка в бухтах', 'coil', NULL, NULL,
   51),

  -- 39 (source_no = 52)
  ('Прокладка', NULL,
   'Прокладка защитная пучка проводов (заготовка)',
   '', NULL, NULL, NULL,
   'КА-30',
   'поставка в бухтах', 'coil', NULL, NULL,
   52),

  -- 40 (source_no = 53)
  ('Профиль', NULL,
   'Профиль буфера педали',
   '8х5,5 мм', 8, 5.5, NULL,
   'АЗЛК-253',
   'поставка в бухтах', 'coil', NULL, NULL,
   53),

  -- 41 (source_no = 54)
  ('Профиль', NULL,
   'Профиль шланга',
   '9х6 мм', 9, 6, NULL,
   'ИМ-03',
   'поставка в бухтах', 'coil', NULL, NULL,
   54),

  -- 42 (source_no = 55)
  ('Трубка', NULL,
   'Трубка',
   '9х6 мм', 9, 6, NULL,
   '2321-02',
   'поставка в бухтах', 'coil', NULL, NULL,
   55),

  -- 43 (source_no = 58)
  ('Профиль', NULL,
   'Профиль трубки эконометра',
   '5х3 мм', 5, 3, NULL,
   'АЗЛК-248',
   'поставка в бухтах', 'coil', NULL, NULL,
   58),

  -- 44 (source_no = 59)
  ('Профиль', NULL,
   'Профиль защитный',
   '', NULL, NULL, NULL,
   'УАЗ-02',
   'поставка в бухтах', 'coil', NULL, NULL,
   59),

  -- 45 (source_no = 60)
  ('Окантовка', NULL,
   'Окантовка ручки',
   '', NULL, NULL, NULL,
   'КА-523',
   '385±5 мм', 'fixed', 385, '±5',
   60),

  -- 46 (source_no = 61)
  ('Окантовка', NULL,
   'Окантовка поручня',
   '', NULL, NULL, NULL,
   'КА-524',
   '220±5 мм', 'fixed', 220, '±5',
   61),

  -- 47 (source_no = 67)
  ('Облицовка', NULL,
   'Облицовка сточного жёлоба крыши',
   '', NULL, NULL, NULL,
   '2147-04',
   '2120±5 мм', 'fixed', 2120, '±5',
   67),

  -- 48 (source_no = 68)
  ('Облицовка', NULL,
   'Облицовка сточного жёлоба крыши',
   '', NULL, NULL, NULL,
   '2147-06',
   '2067±5 мм', 'fixed', 2067, '±5',
   68),

  -- 49 (source_no = 69)
  ('Накладка', NULL,
   'Накладка облицовочная сточного жёлоба крыши',
   '', NULL, NULL, NULL,
   '2148-02',
   '2210±5 мм', 'fixed', 2210, '±5',
   69),

  -- 50 (source_no = 70)
  ('Накладка', NULL,
   'Накладка облицовочная сточного жёлоба крыши',
   '', NULL, NULL, NULL,
   '2148-03',
   '2910±5 мм', 'fixed', 2910, '±5',
   70),

  -- 51 (source_no = 71)
  ('Трубка', 'перфорированная',
   'Трубка перфорированная',
   '20х13 мм', 20, 13, NULL,
   '2516',
   'поставка в бухтах', 'coil', NULL, NULL,
   71),

  -- 52 (source_no = 73)
  ('Молдинг', NULL,
   'Молдинг боковины нижний',
   '41х10,5 мм', 41, 10.5, NULL,
   '2187',
   '1566-4(+5) мм', 'fixed', 1566, '-4(+5)',
   73);

-- Готово!
