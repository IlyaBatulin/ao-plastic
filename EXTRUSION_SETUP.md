# Настройка раздела "Экструзионные изделия ДМС"

## Шаг 1: Удаление старых данных из Supabase

Если вы уже применяли миграцию вручную, нужно удалить таблицу.

1. Откройте Supabase Dashboard: https://supabase.com/dashboard
2. Выберите ваш проект
3. Перейдите в **SQL Editor**
4. Создайте новый запрос и выполните:

```sql
-- Удаление таблицы extrusion_products
DROP TABLE IF EXISTS public.extrusion_products CASCADE;
```

5. Нажмите **Run** (или Ctrl+Enter)

## Шаг 2: Применение миграций

### Миграция 1: Создание таблицы extrusion_products

1. В том же **SQL Editor** создайте новый запрос
2. Откройте файл `migrations/033_create_extrusion_products.sql`
3. Скопируйте **весь** его содержимый
4. Вставьте в SQL Editor
5. Нажмите **Run** (или Ctrl+Enter)

Должно появиться сообщение об успешном выполнении. Таблица будет создана и заполнена 52 записями.

### Миграция 2: Добавление категории и подкатегории

1. Создайте новый запрос в **SQL Editor**
2. Откройте файл `migrations/034_add_machine_parts_extrusion_category.sql`
3. Скопируйте **весь** его содержимый
4. Вставьте в SQL Editor
5. Нажмите **Run** (или Ctrl+Enter)

Будут созданы:
- Категория "Детали машин" (machine-parts)
- Подкатегория "Экструзионные изделия ДМС" (parts-extrusion)

## Шаг 3: Проверка данных

Выполните в SQL Editor:

```sql
-- Проверка количества записей
SELECT COUNT(*) FROM extrusion_products;
-- Должно быть 52

-- Просмотр первых 10 записей
SELECT * FROM extrusion_products ORDER BY source_no LIMIT 10;

-- Проверка по типам
SELECT type, COUNT(*) as count 
FROM extrusion_products 
GROUP BY type 
ORDER BY count DESC;
```

## Шаг 4: Проверка страницы

1. Запустите dev-сервер:
```bash
npm run dev
```

2. Откройте в браузере:
```
http://localhost:3000/products/machine-parts/parts-extrusion
```

Вы должны увидеть:
- Таблицу с 52 экструзионными изделиями
- Фильтры (тип изделия, поиск, длина)
- Сортировки
- Дизайн в стиле остальных разделов сайта

## Структура файлов

### Миграции
- `migrations/032_cleanup_extrusion_products.sql` - очистка (опционально)
- `migrations/033_create_extrusion_products.sql` - основная миграция
- `migrations/README_EXTRUSION.md` - документация

### Код приложения
- `lib/extrusionParsers.ts` - утилиты парсинга размеров/длины (для будущего использования)
- `app/products/_components/parts-extrusion-info.tsx` - компонент страницы с фильтрами и таблицей
- `app/products/[categoryId]/[subcategoryId]/page.tsx` - обновлён для поддержки экструзионных изделий
- `types/database.ts` - TypeScript типы

## Фильтры на странице

### Тип изделия (multi-select)
- Сепаратор
- Трубка
- Шланг
- Окантовка
- Профиль
- Втулка
- Прокладка
- Облицовка
- Накладка
- Молдинг

### Поиск
Ищет по названию и шифру изделия

### Длина изделия
- Только в бухтах (checkbox)
- Тип длины: все / фиксированная / в бухтах (radio)

### Сортировка
- По названию
- По шифру
- По размерам (A)
- По длине

## Примеры SQL запросов

### Все защитные трубки
```sql
SELECT * FROM extrusion_products 
WHERE type = 'Трубка' AND subtype = 'защитная';
```

### Изделия с фиксированной длиной 600-700 мм
```sql
SELECT * FROM extrusion_products 
WHERE length_kind = 'fixed' 
  AND length_mm BETWEEN 600 AND 700
ORDER BY length_mm;
```

### Поиск по шифру (начинается с "Ф-")
```sql
SELECT * FROM extrusion_products 
WHERE code LIKE 'Ф-%'
ORDER BY code;
```

### Группировка по типу
```sql
SELECT type, COUNT(*) as count, 
       SUM(CASE WHEN length_kind = 'coil' THEN 1 ELSE 0 END) as coil_count,
       SUM(CASE WHEN length_kind = 'fixed' THEN 1 ELSE 0 END) as fixed_count
FROM extrusion_products
GROUP BY type
ORDER BY count DESC;
```

## Troubleshooting

### Ошибка "relation does not exist"
Миграция не была применена. Вернитесь к Шагу 2.

### Ошибка "relation already exists"
Таблица уже существует. Выполните Шаг 1 (удаление).

### Пустая страница / нет данных
1. Проверьте, что записи существуют в БД
2. Проверьте `.env.local` - должны быть `NEXT_PUBLIC_SUPABASE_URL` и `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Проверьте RLS политики в Supabase

### Ошибка RLS
Убедитесь, что политика `extrusion_products_select_public` создана:
```sql
SELECT * FROM pg_policies WHERE tablename = 'extrusion_products';
```

## Готово!

После выполнения всех шагов раздел "Экструзионные изделия" будет полностью настроен и готов к использованию.
