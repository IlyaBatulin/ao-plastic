-- ============================================================
-- fn_audit() под реальную схему audit_log
-- В БД колонки: id, entity, entity_id, action, user_id, payload, created_at
-- (не table_name, record_id, old_data, new_data)
-- Данные в audit_log не трогаем.
-- ============================================================

CREATE OR REPLACE FUNCTION public.fn_audit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $func$
BEGIN
  INSERT INTO public.audit_log (
    entity,
    entity_id,
    action,
    user_id,
    payload,
    created_at
  ) VALUES (
    TG_TABLE_NAME,
    COALESCE(NEW.id::text, OLD.id::text),
    TG_OP,
    NULL,
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE to_jsonb(NEW) END,
    NOW()
  );
  RETURN COALESCE(NEW, OLD);
END;
$func$;

COMMENT ON FUNCTION public.fn_audit() IS 'Аудит: пишет в audit_log (entity, entity_id, action, payload)';
