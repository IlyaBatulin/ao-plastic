# Миграции для экструзионных изделий

## Порядок применения

### 1. Очистка (032_cleanup_extrusion_products.sql)
Удаляет таблицу `extrusion_products`, если она была создана вручную.

**Запустить в Supabase SQL Editor:**

```sql
-- Удаление таблицы extrusion_products
DROP TABLE IF EXISTS public.extrusion_products CASCADE;
```

### 2. Создание и заполнение (033_create_extrusion_products.sql)
Создает таблицу `extrusion_products` и заполняет её 52 записями из документа "Экструзионные изделия".

**Запустить в Supabase SQL Editor:**

Скопируйте и выполните весь файл `033_create_extrusion_products.sql`.

## Структура таблицы

```sql
extrusion_products:
- id (serial)
- type (text) - Тип изделия
- subtype (text, nullable) - Подтип (только для трубок)
- name (text) - Наименование товара
- size_raw (text, nullable) - Габаритные размеры как есть
- size_a_mm (numeric, nullable) - Первая размерность
- size_b_mm (numeric, nullable) - Вторая размерность
- size_note (text, nullable) - Примечания к размерам
- code (text) - Шифр изделия
- length_raw (text) - Длина изделия как есть
- length_kind (text) - coil | fixed
- length_mm (numeric, nullable) - Длина в мм
- length_tolerance_raw (text, nullable) - Допуск
- source_no (int, nullable) - Номер из документа
- is_active (boolean) - Активность записи
- created_at (timestamptz)
```

## Примеры запросов

### Все трубки
```sql
SELECT * FROM extrusion_products WHERE type = 'Трубка';
```

### Только поставка в бухтах
```sql
SELECT * FROM extrusion_products WHERE length_kind = 'coil';
```

### Поиск по шифру
```sql
SELECT * FROM extrusion_products WHERE code ILIKE '%Ф-1%';
```

### Фильтр по нескольким типам
```sql
SELECT * FROM extrusion_products 
WHERE type IN ('Трубка', 'Шланг')
ORDER BY name;
```

## RLS Политики

Таблица доступна для чтения всем пользователям (is_active = true).
Изменение данных доступно только через Dashboard Supabase или с правами сервиса.
