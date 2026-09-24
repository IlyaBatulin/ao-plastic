-- Run only after the new studio images have been deployed to public/images/xoztov/.
-- Local code also maps these five product IDs to the new assets, so this is
-- optional catalogue synchronization, not required for the site to display them.
with photos(id, image_path) as (
  values
    ('veshalka-plechiki-36-38', '/images/xoztov/hanger-36-38-studio.webp'),
    ('veshalka-plechiki-48-50', '/images/xoztov/hanger-48-50-studio.webp'),
    ('veshalka-plechiki-52-54', '/images/xoztov/hanger-52-54-studio.webp'),
    ('veshalka-plechiki-povorotnyy-44-46', '/images/xoztov/hanger-swivel-44-46-studio.webp'),
    ('veshalka-plechiki-povorotnyy-48-50', '/images/xoztov/hanger-swivel-48-50-studio.webp')
)
update public.products as product
set image = photos.image_path, updated_at = now()
from photos
where product.id = photos.id and product.image is distinct from photos.image_path;

update public.subcategories
set image = '/images/xoztov/hanger-36-38-studio.webp'
where id = 'veshalki'
  and image is distinct from '/images/xoztov/hanger-36-38-studio.webp';
