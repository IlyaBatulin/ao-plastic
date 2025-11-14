# 📦 Миграции базы данных

Этот файл содержит инструкции по применению миграций базы данных для проекта АО «Пластик».

## 🚀 Порядок применения миграций

Примените миграции в следующем порядке через SQL Editor в Supabase:

### 0. ФИКС (если таблицы УЖЕ СУЩЕСТВУЮТ в БД)
```
000_fix_rls_policies.sql
```
**Примените ТОЛЬКО если вы уже создавали таблицы ранее без политик RLS!**

### 1. Базовая схема (обязательно)
```
001_initial_schema.sql
```
Создает все основные таблицы: `categories`, `subcategories`, `products`, `managers`, `routing_rules`, `orders`, `order_items`

### 2. Тестовые данные (обязательно)
```
002_insert_test_data.sql
```
Добавляет тестовых менеджеров и правила маршрутизации

### 3. Импорт категорий (обязательно)
```
import_categories.sql
```
Заполняет базу категориями и подкатегориями

### 4. Дополнительные колонки для товаров (обязательно)
```
add_products_columns.sql
```
Добавляет недостающие колонки в таблицу `products`

### 4.1. ФИКС phone/email constraints (если есть проблемы с заказами)
```
003_fix_email_constraints.sql
```
Убирает слишком строгие проверки email и phone

### 5. Товары полистирола (опционально)
```
add_polystyrene_products.sql
add_psv_s_products.sql
update_polystyrene_category_image.sql
update_polystyrene_images.sql
test_product_insert.sql
```

## 📝 Как применить миграции

### Способ 1: Через SQL Editor в Supabase

1. Откройте [Supabase Dashboard](https://app.supabase.com)
2. Перейдите в ваш проект
3. Откройте **SQL Editor** (левый бокбар)
4. Нажмите **New Query**
5. Скопируйте содержимое файла миграции
6. Вставьте в редактор
7. Нажмите **Run** или `Ctrl+Enter`
8. Повторите для всех миграций по порядку

### Способ 2: Через psql (если есть доступ к БД)

```bash
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres" -f migrations/001_initial_schema.sql
```

## ✅ Проверка успешного применения

После применения миграций проверьте:

1. **Таблицы созданы:**
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Должны быть:
- categories
- subcategories
- products
- managers
- routing_rules
- orders
- order_items

2. **RLS политики включены:**
```sql
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

3. **Категории заполнены:**
```sql
SELECT id, name FROM public.categories WHERE is_active = true;
```

## ⚠️ Важно

- **Не пропускайте миграции** — они должны применяться в указанном порядке
- **Делайте backup** перед применением миграций на production
- **Проверяйте логи** после каждого применения миграции

## 🐛 Решение проблем

### Ошибка "relation already exists"
Миграция уже была применена ранее. Это нормально, продолжайте со следующей миграции.

### Ошибка "permission denied"
Убедитесь, что вы используете SQL Editor в Supabase (не `psql` напрямую) или что у вас есть права администратора.

### Ошибка "column already exists"
Колонка уже добавлена в предыдущей миграции. Это нормально, продолжайте.

## 📞 Поддержка

Если возникли проблемы с миграциями:
1. Проверьте логи SQL Editor в Supabase
2. Убедитесь, что применяете миграции в правильном порядке
3. Проверьте, что `.env.local` настроен правильно

