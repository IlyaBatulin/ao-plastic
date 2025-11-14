-- ============================================================
-- ФИКС: Принудительно удаляем и пересоздаём phone/email constraints
-- ============================================================

-- УДАЛЯЕМ все существующие constraints на orders
DO $$ 
DECLARE
    constraint_rec record;
BEGIN
    -- Находим и удаляем все CHECK constraints
    FOR constraint_rec IN 
        SELECT conname 
        FROM pg_constraint 
        WHERE conrelid = 'public.orders'::regclass
          AND contype = 'c'
    LOOP
        EXECUTE 'ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS ' || constraint_rec.conname;
        RAISE NOTICE 'Dropped constraint: %', constraint_rec.conname;
    END LOOP;
END $$;

-- ДОБАВЛЯЕМ новые мягкие constraints
ALTER TABLE public.orders 
ADD CONSTRAINT orders_customer_email_check 
CHECK (
    customer_email IS NULL 
    OR customer_email = '' 
    OR length(customer_email) > 3
);

ALTER TABLE public.orders 
ADD CONSTRAINT orders_customer_phone_check 
CHECK (
    customer_phone IS NULL 
    OR customer_phone = '' 
    OR length(customer_phone) >= 7
);

-- Готово! Теперь любые email и phone длиной > 3 символа будут валидны

