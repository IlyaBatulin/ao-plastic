-- ============================================================
-- ПРОВЕРКА: Какие CHECK constraints на email существуют?
-- ============================================================

SELECT 
    con.constraint_name,
    con.table_name,
    col.column_name,
    pg_get_constraintdef(con.oid) as constraint_definition
FROM pg_constraint con
JOIN information_schema.table_constraints tc 
    ON con.constraint_name = tc.constraint_name
LEFT JOIN information_schema.key_column_usage col 
    ON con.constraint_name = col.constraint_name
WHERE con.contype = 'c'
  AND (con.constraint_name LIKE '%email%' OR col.column_name LIKE '%email%')
ORDER BY con.table_name, col.column_name;

