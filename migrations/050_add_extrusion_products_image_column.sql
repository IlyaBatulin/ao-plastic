-- ============================================================
-- Экструзионные изделия ДМС — колонка для фото из ПРЕВЬЮ/трубки
-- ============================================================

ALTER TABLE public.extrusion_products
  ADD COLUMN IF NOT EXISTS image TEXT;

COMMENT ON COLUMN public.extrusion_products.image IS 'Путь к превью: /ПРЕВЬЮ/трубки/СП {шифр}_1.jpeg';
