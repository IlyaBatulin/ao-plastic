# 🚀 Быстрый старт - Экструзионные изделия ДМС

## 3 простых шага

### Шаг 1: Откройте Supabase SQL Editor
1. Зайдите на https://supabase.com/dashboard
2. Выберите ваш проект
3. Перейдите в **SQL Editor**

### Шаг 2: Выполните 3 миграции

**Миграция 1 - Очистка (если нужно):**
```sql
DROP TABLE IF EXISTS public.extrusion_products CASCADE;
```

**Миграция 2 - Создание таблицы + 52 записи:**
- Откройте файл `migrations/033_create_extrusion_products.sql`
- Скопируйте **весь** файл
- Вставьте в SQL Editor
- Нажмите **Run**

**Миграция 3 - Категория и подкатегория:**
- Откройте файл `migrations/034_add_machine_parts_extrusion_category.sql`
- Скопируйте **весь** файл
- Вставьте в SQL Editor
- Нажмите **Run**

### Шаг 3: Проверьте результат

```bash
npm run dev
```

Откройте: http://localhost:3000/products/machine-parts/parts-extrusion

## ✅ Готово!

Вы должны увидеть:
- Таблицу с 52 экструзионными изделиями
- Поиск по названию и шифру
- Фильтры по типу изделия
- Фильтры по длине (в бухтах / фиксированная)
- Сортировки

---

📖 Подробная документация: `EXTRUSION_FINAL.md`
