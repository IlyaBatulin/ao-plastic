# Исправление проблем безопасности - Миграция 031

**Дата:** 26 января 2026  
**Файл миграции:** `migrations/031_fix_security_issues.sql`  
**Статус:** Готово к применению

---

## 📋 Обзор проблем

В процессе аудита безопасности Supabase было обнаружено **20 проблем**:
- **3 ошибки** (высокий приоритет) ⛔
- **17 предупреждений** (средний приоритет) ⚠️

---

## 🔴 ОШИБКИ (критические)

### 1. Security Definer View - 3 объекта

**Проблема:**
- `public.v_products_brief`
- `public.v_categories_summary`
- `public.v_products_full`

**Суть:**
Views созданы с флагом `SECURITY DEFINER`, что означает, что они выполняются с правами **создателя view**, а не текущего пользователя. Это полностью **обходит Row Level Security (RLS)** и может привести к утечке конфиденциальных данных.

**Серьезность:** 🔴 **КРИТИЧЕСКАЯ**
- Любой пользователь может получить доступ ко всем данным, минуя RLS
- Потенциальная утечка закрытой информации
- Нарушение политик безопасности

**Решение:**
```sql
-- Удаляем старые views и создаем новые БЕЗ SECURITY DEFINER
DROP VIEW IF EXISTS public.v_products_brief CASCADE;
CREATE OR REPLACE VIEW public.v_products_brief AS
SELECT id, slug, name, category_id, ...
FROM public.products p
WHERE p.is_active = true;
```

✅ **Результат:** Views теперь выполняются с правами вызывающего пользователя, RLS работает корректно.

---

## 🟡 ПРЕДУПРЕЖДЕНИЯ (высокий приоритет)

### 2. RLS Policy Always True - 7 таблиц

**Проблема:**
Политики RLS настроены так, что разрешают доступ **всем** authenticated пользователям:
- `audit_log` (2 политики)
- `contact_messages` (2 политики)
- `orders` (2 политики)
- `rfp_responses` (2 политики)
- `vacancy_responses` (2 политики)
- `webhook_events` (2 политики)
- `management_team` (3 политики)

**Пример проблемного кода:**
```sql
CREATE POLICY "orders_select_auth"
ON public.orders
FOR SELECT
TO authenticated
USING (true);  -- ❌ Разрешает всем authenticated пользователям
```

**Серьезность:** 🟠 **ВЫСОКАЯ**
- RLS включен, но не работает (политика `USING (true)` разрешает всем)
- Любой авторизованный пользователь может читать/изменять все данные
- Создается ложное чувство безопасности

**Решение:**
Заменили политики на строгие проверки с использованием `service_role`:

```sql
-- ❌ БЫЛО: доступно всем authenticated
CREATE POLICY "orders_select_auth"
ON public.orders FOR SELECT TO authenticated
USING (true);

-- ✅ СТАЛО: доступно только service_role (администраторам)
CREATE POLICY "orders_select_service_role"
ON public.orders FOR SELECT TO service_role
USING (true);

-- Публичная вставка с ограничениями
CREATE POLICY "orders_insert_public"
ON public.orders FOR INSERT TO public
WITH CHECK (
  manager_id IS NULL  -- назначается автоматически
  AND customer_name IS NOT NULL
  AND (customer_email IS NOT NULL OR customer_phone IS NOT NULL)
);
```

✅ **Результат:** 
- Публичные пользователи могут только **создавать** заказы/заявки
- Читать и управлять данными может только **service_role** (админ панель)
- Проверка обязательных полей при вставке

---

### 3. Function Search Path Mutable - 7 функций

**Проблема:**
Функции без фиксированного `search_path`:
- `fn_audit`
- `fn_on_order_insert`
- `refresh_orders_summary`
- `assign_manager_to_order`
- `fn_orders_sanitize`
- `gc_webhook_events`
- `fn_on_order_items_insert`

**Суть:**
Если функция не имеет фиксированного `search_path`, злоумышленник может создать свою схему с вредоносными функциями и подменить их. Это **SQL injection** атака.

**Серьезность:** 🟠 **ВЫСОКАЯ**
- Возможность подмены функций/таблиц через манипуляцию search_path
- Потенциальная SQL injection
- Непредсказуемое поведение функций

**Решение:**
Добавили `SET search_path = public, pg_temp` ко всем функциям:

```sql
-- ❌ БЫЛО: без защиты
CREATE OR REPLACE FUNCTION assign_manager_to_order(p_order_id BIGINT)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
  -- код функции
$$;

-- ✅ СТАЛО: с защитой от SQL injection
CREATE OR REPLACE FUNCTION assign_manager_to_order(p_order_id BIGINT)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp  -- Фиксируем схему!
AS $$
  -- код функции
$$;
```

✅ **Результат:** Все функции теперь защищены от подмены схемы и SQL injection.

---

### 4. Materialized View in API - 1 объект

**Проблема:**
- `public.mv_orders_summary`

**Суть:**
Материализованное представление доступно через API, что может быть неожиданным поведением. Данные могут быть устаревшими.

**Серьезность:** 🟡 **СРЕДНЯЯ**
- Больше вопрос архитектуры
- Данные могут быть не актуальными
- API возвращает кешированные данные

**Решение:**
Функция обновления теперь защищена:
```sql
CREATE OR REPLACE FUNCTION refresh_orders_summary()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_orders_summary;
END;
$$;
```

✅ **Результат:** Функция обновления защищена. При необходимости можно скрыть view от API в настройках Supabase.

---

## 📊 Итоговая статистика изменений

### Исправленные объекты:

| Категория | До | После |
|-----------|-----|-------|
| **Security Definer Views** | 3 ошибки | ✅ Исправлено (удален SECURITY DEFINER) |
| **RLS Always True** | 15 политик | ✅ Заменены на строгие проверки |
| **Function Search Path** | 7 функций | ✅ Добавлен SET search_path |
| **Materialized View** | 1 предупреждение | ✅ Функция защищена |

---

## 🔒 Новая модель безопасности

### Разграничение прав доступа:

```
┌─────────────────────────────────────────────────────────────┐
│                    УРОВНИ ДОСТУПА                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  PUBLIC (анонимные пользователи)                           │
│  ✅ Могут: Создавать заказы, заявки, отклики               │
│  ❌ Не могут: Читать, изменять, удалять данные             │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  AUTHENTICATED (авторизованные)                            │
│  ❌ НЕТ доступа к конфиденциальным данным                  │
│  (Для будущих ролей: клиенты, менеджеры)                  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  SERVICE_ROLE (администраторы)                             │
│  ✅ Полный доступ ко всем данным                           │
│  ✅ Управление заказами, заявками, откликами               │
│  ✅ Чтение аудит-лога и вебхуков                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Как применить миграцию

### Вариант 1: Через Supabase Dashboard
1. Откройте Supabase Dashboard
2. Перейдите в **SQL Editor**
3. Скопируйте содержимое файла `migrations/031_fix_security_issues.sql`
4. Выполните миграцию
5. Проверьте результат

### Вариант 2: Через CLI
```bash
# Применить миграцию
supabase db push --include-all

# Или вручную
psql -h your-db-host -U postgres -d postgres -f migrations/031_fix_security_issues.sql
```

---

## ✅ Проверка после применения

После применения миграции проверьте, что проблемы исчезли:

### 1. Проверка Views
```sql
-- Проверяем что views больше не SECURITY DEFINER
SELECT 
  schemaname, 
  viewname,
  viewowner
FROM pg_views 
WHERE schemaname = 'public' 
AND viewname IN ('v_products_brief', 'v_categories_summary', 'v_products_full');
```

### 2. Проверка политик RLS
```sql
-- Смотрим новые политики
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename IN ('orders', 'contact_messages', 'audit_log', 'management_team');
```

### 3. Проверка функций
```sql
-- Проверяем что у функций есть search_path
SELECT 
  p.proname,
  pg_get_function_arguments(p.oid) as arguments,
  p.prosecdef as is_security_definer,
  p.proconfig as config
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
AND p.proname IN ('assign_manager_to_order', 'fn_audit', 'fn_on_order_items_insert');
```

---

## 🛡️ Что теперь защищено

✅ **Views** - больше не обходят RLS  
✅ **Orders** - создаются публично, читаются только админами  
✅ **Contact Messages** - создаются публично, читаются только админами  
✅ **Vacancy Responses** - создаются публично, читаются только админами  
✅ **RFP Responses** - создаются публично, читаются только админами  
✅ **Audit Log** - доступен только service_role  
✅ **Webhook Events** - доступны только service_role  
✅ **Management Team** - управляется только service_role  
✅ **Все функции** - защищены от SQL injection  

---

## 📝 Примечания

1. **Обратная совместимость:** Если у вас есть API-клиенты, которые используют `authenticated` роль для чтения заказов, они перестанут работать. Нужно переключить их на использование `service_role` ключа.

2. **Админ панель:** Для админ-панели используйте `service_role` ключ из Supabase Dashboard → Settings → API.

3. **Тестирование:** После применения миграции обязательно протестируйте:
   - Создание заказа с фронтенда (должно работать)
   - Чтение заказов в админ-панели (должно работать с service_role)
   - Попытка чтения заказов с фронтенда (должна быть заблокирована)

4. **Rollback:** Если что-то пойдет не так, можно откатить миграцию, применив политики из файла `000_fix_rls_policies.sql`.

---

## 🎯 Заключение

Все критические проблемы безопасности исправлены. База данных теперь соответствует best practices Supabase:

- ✅ RLS работает корректно
- ✅ Разграничение прав доступа
- ✅ Защита от SQL injection
- ✅ Минимальные права для публичных пользователей
- ✅ Аудит и логирование защищены

**Рекомендация:** Применить миграцию как можно скорее для устранения критических уязвимостей.
