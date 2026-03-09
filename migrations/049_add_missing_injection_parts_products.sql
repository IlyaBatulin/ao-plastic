-- ============================================================
-- Литьевые изделия ДМС — добавление товаров, которых не было в каталоге
-- ============================================================
-- По сверке с документами из ПРЕВЬЮ/литье в каталоге не было:
--   КА-134 — Шкала управления отоплением
--   КА-287А — Проставка
-- Добавляем с превью из той же папки.
-- ============================================================

INSERT INTO public.products (id, category_id, subcategory_id, slug, name, specifications, sort, is_active, image)
VALUES
  ('ka-134', 'machine-parts', 'injection-parts', 'ka-134', 'Шкала управления отоплением', '{"Артикул": "КА-134"}'::jsonb, 70, true, '/ПРЕВЬЮ/литье/СП КА-134_1.jpeg'),
  ('ka-287a', 'machine-parts', 'injection-parts', 'ka-287a', 'Проставка', '{"Артикул": "КА-287А"}'::jsonb, 71, true, '/ПРЕВЬЮ/литье/СП КА-287А_1.jpeg')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  specifications = EXCLUDED.specifications,
  sort = EXCLUDED.sort,
  subcategory_id = EXCLUDED.subcategory_id,
  image = EXCLUDED.image;
