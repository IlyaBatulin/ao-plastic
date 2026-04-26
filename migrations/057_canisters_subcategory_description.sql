-- Убрать перечисление литражей в описании подкатегории «Канистры» (согласовано с data/products.json)
UPDATE subcategories
SET description = 'Пластиковые канистры для хранения жидкостей'
WHERE slug = 'canisters';
