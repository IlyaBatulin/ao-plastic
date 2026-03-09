-- ============================================================
-- ДМС: для всех товаров без фото подставить логотип
-- ============================================================
-- Литьевые изделия (products) и экструзионные (extrusion_products)
-- без заполненного image получают /images/logo123.png
-- ============================================================

-- Литьевые изделия ДМС без фото
UPDATE public.products
SET image = '/images/logo123.png'
WHERE category_id = 'machine-parts'
  AND (image IS NULL OR image = '');

-- Экструзионные изделия ДМС без фото
UPDATE public.extrusion_products
SET image = '/images/logo123.png'
WHERE image IS NULL OR image = '';
