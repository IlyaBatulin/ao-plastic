-- ТЕСТ: Добавляем один продукт АБС Л-121
insert into public.products (id, slug, category_id, subcategory_id, name, description, is_active)
values ('abs-l-121', 'abs-l-121', 'abs', 'abs-injection', 'АБС Л-121', 'Литьевой АБС-пластик для автомобильных деталей', true)
on conflict (id) do nothing;

-- Проверка
select p.name, c.name as category from products p 
join categories c on p.category_id = c.id where p.id = 'abs-l-121';

