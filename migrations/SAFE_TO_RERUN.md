# ✅ Миграции БЕЗОПАСНЫ для повторного запуска

Все миграции в этой папке написаны так, что их можно запускать несколько раз **без вреда** для базы данных.

## 🛡️ Защита от дублирования

### 1. **Таблицы**
```sql
CREATE TABLE IF NOT EXISTS public.orders (...)
```
- ✅ Если таблица уже существует — ничего не делает
- ✅ Если таблицы нет — создаёт
- ✅ Безопасно запускать множество раз

### 2. **Индексы**
```sql
CREATE INDEX IF NOT EXISTS idx_orders_manager ON public.orders(manager_id);
```
- ✅ Если индекс существует — пропускает
- ✅ Если нет — создаёт

### 3. **Функции и триггеры**
```sql
CREATE OR REPLACE FUNCTION public.assign_manager_to_order(...)
DROP TRIGGER IF EXISTS trg_order_items_insert ON public.order_items;
CREATE TRIGGER trg_order_items_insert ...
```
- ✅ Функция заменяется на новую версию
- ✅ Старый триггер удаляется, новый создаётся
- ✅ Безопасно обновлять логику

### 4. **RLS Политики**
```sql
DROP POLICY IF EXISTS "orders_insert_public" ON public.orders;
CREATE POLICY "orders_insert_public" ...
```
- ✅ Старая политика удаляется
- ✅ Новая политика создаётся
- ✅ Безопасно применять несколько раз

### 5. **Колонки**
```sql
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS description text;
```
- ✅ Если колонка существует — пропускает
- ✅ Если нет — добавляет

### 6. **Данные**
```sql
INSERT INTO public.categories (...) 
ON CONFLICT (id) DO UPDATE SET name = excluded.name, ...
```
- ✅ Если запись существует — обновляет
- ✅ Если нет — вставляет
- ✅ Безопасно синхронизировать данные

## 📋 Порядок применения (важен!)

```
000_fix_rls_policies.sql          ← Если таблицы уже есть, примените ПЕРВОЙ
001_initial_schema.sql             ← Создаёт все таблицы
002_insert_test_data.sql           ← Добавляет менеджеров и правила
import_categories.sql              ← Заполняет категории
add_products_columns.sql           ← Добавляет колонки в products
add_polystyrene_products.sql       ← Товары полистирола
add_psv_s_products.sql             ← Полистирол ПСВ-С
update_polystyrene_category_image.sql
update_polystyrene_images.sql
test_product_insert.sql            ← Тестовый товар
add_order_items_and_cart_logic.sql ← Дублирует функцию из 001 (безопасно!)
```

## ⚠️ Что НЕ безопасно повторять?

### ❌ Обычные `INSERT` без `ON CONFLICT`
```sql
-- ОПАСНО повторять:
INSERT INTO public.products VALUES ('test-1', 'Test');

-- БЕЗОПАСНО:
INSERT INTO public.products VALUES ('test-1', 'Test')
ON CONFLICT (id) DO NOTHING;
```

### ❌ `ALTER TABLE DROP COLUMN`
```sql
-- ОПАСНО повторять (второй раз выдаст ошибку):
ALTER TABLE public.products DROP COLUMN old_column;

-- БЕЗОПАСНО:
DO $$ BEGIN
    ALTER TABLE public.products DROP COLUMN IF EXISTS old_column;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
```

## 🧪 Проверка безопасности

### Попробуйте применить миграцию дважды:
1. Первый раз — создаёт объекты
2. Второй раз — пропускает или обновляет
3. БД должна остаться в нормальном состоянии

## 💡 Рекомендации

1. **Всегда применяйте миграции** через SQL Editor в Supabase
2. **Читайте логи** после применения — там могут быть предупреждения
3. **Делайте backup** перед массовыми изменениями
4. **Тестируйте** на test-окружении перед production

## ✅ Итог

**Все миграции в этой папке идемпотентны и безопасны!**

Можно смело:
- ✅ Применять несколько раз
- ✅ Комбинировать в любом порядке (кроме логической последовательности)
- ✅ Использовать для восстановления БД
- ✅ Переносить между проектами

Единственное условие — соблюдайте логический порядок (схема → данные).

