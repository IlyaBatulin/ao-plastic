-- ============================================================
-- ИСПРАВЛЕНИЕ СХЕМЫ audit_log ДЛЯ fn_audit()
-- Ошибка: column "table_name" of relation "audit_log" does not exist
-- Функция fn_audit() пишет в колонки: table_name, record_id, action,
-- old_data, new_data, user_id, created_at
-- ============================================================

-- Вариант 1: таблицы нет — создаём с нужной структурой
CREATE TABLE IF NOT EXISTS public.audit_log (
  id         BIGSERIAL PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_id  TEXT,
  action     TEXT NOT NULL,
  old_data   JSONB,
  new_data   JSONB,
  user_id    TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Вариант 2: таблица уже есть с другими колонками — добавляем недостающие
-- (выполняется после CREATE TABLE, поэтому если таблица только что создана — блок просто не добавит дубликаты)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'audit_log' AND column_name = 'table_name') THEN
    ALTER TABLE public.audit_log ADD COLUMN table_name TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'audit_log' AND column_name = 'record_id') THEN
    ALTER TABLE public.audit_log ADD COLUMN record_id TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'audit_log' AND column_name = 'action') THEN
    ALTER TABLE public.audit_log ADD COLUMN action TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'audit_log' AND column_name = 'old_data') THEN
    ALTER TABLE public.audit_log ADD COLUMN old_data JSONB;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'audit_log' AND column_name = 'new_data') THEN
    ALTER TABLE public.audit_log ADD COLUMN new_data JSONB;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'audit_log' AND column_name = 'user_id') THEN
    ALTER TABLE public.audit_log ADD COLUMN user_id TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'audit_log' AND column_name = 'created_at') THEN
    ALTER TABLE public.audit_log ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

COMMENT ON TABLE public.audit_log IS 'Журнал аудита изменений (триггер fn_audit)';
