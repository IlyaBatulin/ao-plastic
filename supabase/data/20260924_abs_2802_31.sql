-- ABS-2802-31 extrusion grade: specifications from the manufacturer-supplied table.
-- Repeatable insert; an existing product is not overwritten.
insert into public.products (
  id, category_id, subcategory_id, slug, name, brand, type,
  description, image, sort, specifications, is_active
)
select
  'abs-2802-31', 'abs', 'abs-extrusion', 'abs-2802-31',
  'АБС-2802-31', 'АБС-2802-31', 'Экструзионный',
  'Экструзионный АБС-пластик марки 2802-31 для производства листов и профилей методом экструзии',
  '/images/abs-custom/abs-colored-granules.png', 5,
  '{"Плотность, кг/м³":1040,"Усадка при литье под давлением, %, в пределах":"0,3-0,7","Показатель текучести расплава, г/10 мин":2.5,"Относительное удлинение при разрыве, %, не менее":35,"Ударная вязкость по Изоду, кДж/м², не менее":42,"Предел текучести при растяжении, кгс/см², не менее":400,"Температура размягчения по Вика, °C, не менее":100,"Термо- и светостабилизированная марка":"+","Морозостойкая марка":"+"}'::jsonb,
  true
where not exists (select 1 from public.products where id = 'abs-2802-31');
