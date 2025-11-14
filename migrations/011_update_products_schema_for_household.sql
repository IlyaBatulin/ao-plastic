-- ========================================
-- Обновление схемы для хозяйственных товаров
-- Добавляет display_order для сортировки и поля для детальной информации
-- ========================================

-- ВАЖНО: Эта миграция должна быть применена ПЕРВОЙ (перед 008, 009, 010)
-- Она добавляет необходимые колонки для сортировки во всех таблицах

-- 1. Добавляем display_order для сортировки категорий
ALTER TABLE public.categories 
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- 2. Добавляем display_order для сортировки подкатегорий
ALTER TABLE public.subcategories 
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- 3. Добавляем display_order для сортировки товаров
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- 4. Добавляем новые поля для хозяйственных товаров
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS barcode VARCHAR(50),
ADD COLUMN IF NOT EXISTS package_quantity INTEGER,
ADD COLUMN IF NOT EXISTS weight DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS dimensions TEXT,
ADD COLUMN IF NOT EXISTS material TEXT;

-- 5. Создаем индексы для быстрого поиска и сортировки
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON public.categories(display_order);
CREATE INDEX IF NOT EXISTS idx_subcategories_display_order ON public.subcategories(display_order);
CREATE INDEX IF NOT EXISTS idx_products_display_order ON public.products(display_order);
CREATE INDEX IF NOT EXISTS idx_products_barcode ON public.products(barcode);
CREATE INDEX IF NOT EXISTS idx_products_material ON public.products(material);
CREATE INDEX IF NOT EXISTS idx_products_package_quantity ON public.products(package_quantity);

-- 6. Комментарии к полям
COMMENT ON COLUMN public.categories.display_order IS 'Порядок отображения категории (чем меньше, тем выше)';
COMMENT ON COLUMN public.subcategories.display_order IS 'Порядок отображения подкатегории (чем меньше, тем выше)';
COMMENT ON COLUMN public.products.display_order IS 'Порядок отображения товара (чем меньше, тем выше)';
COMMENT ON COLUMN public.products.barcode IS 'Штрихкод товара для учета';
COMMENT ON COLUMN public.products.package_quantity IS 'Количество штук в упаковке/коробке';
COMMENT ON COLUMN public.products.weight IS 'Вес изделия в граммах';
COMMENT ON COLUMN public.products.dimensions IS 'Размеры изделия (текстовое описание)';
COMMENT ON COLUMN public.products.material IS 'Материал изделия (Полипропилен, ПЭНД и т.д.)';

-- Успешное завершение миграции
SELECT 'Схема обновлена: добавлены display_order и поля для хозяйственных товаров' AS status;
