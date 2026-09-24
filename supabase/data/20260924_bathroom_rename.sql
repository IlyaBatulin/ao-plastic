-- Keep the existing /sanuzel URL and product relations; change display name only.
update public.subcategories
set name = 'Для ванной комнаты'
where id = 'sanuzel' and name is distinct from 'Для ванной комнаты';
