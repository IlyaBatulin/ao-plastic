-- ============================================================
-- ФИКС: Убираем слишком строгие email constraints (если есть)
-- ============================================================

-- Удаляем старые констрейнты на email (если они есть)
DO $$ 
BEGIN
    -- Удаляем constraint на customer_email в orders
    IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'chk_ord_email_format' 
        AND conrelid = 'public.orders'::regclass
    ) THEN
        ALTER TABLE public.orders DROP CONSTRAINT chk_ord_email_format;
    END IF;
    
    -- Удаляем любые другие email constraints в orders
    IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname LIKE '%email%' 
        AND conrelid = 'public.orders'::regclass
    ) THEN
        EXECUTE (
            SELECT 'ALTER TABLE public.orders DROP CONSTRAINT ' || conname
            FROM pg_constraint
            WHERE conname LIKE '%email%' 
              AND conrelid = 'public.orders'::regclass
            LIMIT 1
        );
    END IF;
    
    -- Удаляем constraint на phone в orders
    IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'chk_ord_phone_format' 
        AND conrelid = 'public.orders'::regclass
    ) THEN
        ALTER TABLE public.orders DROP CONSTRAINT chk_ord_phone_format;
    END IF;
    
    -- Удаляем любые другие phone constraints в orders
    IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname LIKE '%phone%' 
        AND conrelid = 'public.orders'::regclass
    ) THEN
        EXECUTE (
            SELECT 'ALTER TABLE public.orders DROP CONSTRAINT ' || conname
            FROM pg_constraint
            WHERE conname LIKE '%phone%' 
              AND conrelid = 'public.orders'::regclass
            LIMIT 1
        );
    END IF;
END $$;

-- Добавляем более мягкие проверки (только если email не пустой, то проверяем)
ALTER TABLE public.orders 
DROP CONSTRAINT IF EXISTS orders_customer_email_check;

ALTER TABLE public.orders 
ADD CONSTRAINT orders_customer_email_check 
CHECK (
    customer_email IS NULL 
    OR customer_email = '' 
    OR customer_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
);

-- Аналогично для phone - удаляем ВСЕ существующие
DO $$ 
DECLARE
    constraint_name text;
BEGIN
    -- Находим все phone constraints
    FOR constraint_name IN 
        SELECT conname 
        FROM pg_constraint 
        WHERE conrelid = 'public.orders'::regclass
          AND contype = 'c'
          AND (pg_get_constraintdef(oid) LIKE '%customer_phone%' 
               OR pg_get_constraintdef(oid) LIKE '%phone%')
    LOOP
        EXECUTE 'ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS ' || constraint_name;
    END LOOP;
END $$;

-- Добавляем более мягкую проверку для phone
ALTER TABLE public.orders 
ADD CONSTRAINT orders_customer_phone_check 
CHECK (
    customer_phone IS NULL 
    OR customer_phone = '' 
    OR customer_phone ~* '^[+]?[0-9\-\(\)\s]{7,}$'
);

-- Готово!

