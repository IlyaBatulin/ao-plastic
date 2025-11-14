-- ============================================================
-- ПРОВЕРКА: Статус RLS и политик
-- ============================================================

-- Проверяем, включен ли RLS
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public' 
  AND tablename IN ('orders', 'order_items', 'audit_log', 'webhook_events')
ORDER BY tablename;

-- Проверяем существующие политики
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd as command,
    qual as using_expression,
    with_check
FROM pg_policies
WHERE schemaname = 'public' 
  AND tablename IN ('orders', 'order_items', 'audit_log', 'webhook_events')
ORDER BY tablename, policyname;

