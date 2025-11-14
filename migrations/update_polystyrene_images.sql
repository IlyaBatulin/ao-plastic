-- Обновляем изображения полистирола в Supabase

update public.categories
set image = '/images/polystyrene-warehouse.png'
where id = 'polystyrene';

update public.products
set image = '/images/polystyrene-granules-1.png'
where id = 'psv-s';

update public.products
set image = '/images/polystyrene-granules-2.png'
where id = 'psv-l';

update public.products
set image = '/images/polystyrene-granules-3.jpeg'
where id = 'pse-1';

