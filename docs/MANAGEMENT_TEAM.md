# Раздел "Руководство" - Документация

## Обзор

Раздел "Руководство" отображает информацию о руководителях АО "Пластик". Данные хранятся в базе данных Supabase и могут редактироваться через административную панель.

## Структура базы данных

### Таблица `management_team`

```sql
CREATE TABLE public.management_team (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,              -- ФИО руководителя
  position TEXT NOT NULL,                -- Должность
  bio TEXT,                              -- Биография
  email TEXT,                            -- Email
  phone TEXT,                            -- Телефон
  image_url TEXT,                        -- URL фотографии
  sort_order INTEGER NOT NULL DEFAULT 0, -- Порядок отображения
  is_active BOOLEAN DEFAULT true,        -- Статус активности
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Индексы

- `idx_management_team_sort_order` - для быстрой сортировки
- `idx_management_team_is_active` - для фильтрации активных записей
- `idx_management_team_active_sorted` - составной индекс для оптимизации запросов

### Row Level Security (RLS)

Таблица защищена политиками RLS:
- **Чтение (SELECT)**: Доступно всем (включая анонимных) только для активных записей
- **Вставка (INSERT)**: Только для аутентифицированных администраторов
- **Обновление (UPDATE)**: Только для аутентифицированных администраторов
- **Удаление (DELETE)**: Только для аутентифицированных администраторов

## Структура файлов

### Frontend

```
app/about/management/
├── page.tsx                  # Серверный компонент (получает данные из БД)
└── management-client.tsx     # Клиентский компонент (отображение с анимациями)
```

### API Endpoints

```
app/api/admin/management/
├── route.ts                  # GET (список), POST (создание)
└── [id]/route.ts            # GET (один), PUT (обновление), DELETE (удаление)
```

### Типы

```typescript
// types/database.ts
export interface ManagementTeamMember {
  id: string
  full_name: string
  position: string
  bio: string | null
  email: string | null
  phone: string | null
  image_url: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ManagementTeamMemberPublic {
  id: string
  full_name: string
  position: string
  bio: string | null
  email: string | null
  phone: string | null
  image_url: string | null
  sort_order: number
}
```

## API Endpoints

### Получение списка руководителей (для админки)

```http
GET /api/admin/management
Authorization: Required
```

**Ответ:**
```json
[
  {
    "id": "uuid",
    "full_name": "Кизимов Николай Владимирович",
    "position": "Генеральный директор",
    "bio": "Опыт работы...",
    "email": null,
    "phone": null,
    "image_url": "/images/bosses/Кизимов_Николай_Владимирович.jpg",
    "sort_order": 10,
    "is_active": true,
    "created_at": "2026-01-26T...",
    "updated_at": "2026-01-26T..."
  }
]
```

### Создание руководителя

```http
POST /api/admin/management
Authorization: Required
Content-Type: application/json
```

**Тело запроса:**
```json
{
  "full_name": "Иванов Иван Иванович",
  "position": "Заместитель директора",
  "bio": "Биография...",
  "email": "ivanov@oaplastic.ru",
  "phone": "+7 (48731) 6-12-40",
  "image_url": "/images/bosses/ivanov.jpg",
  "sort_order": 110,
  "is_active": true
}
```

### Получение одного руководителя

```http
GET /api/admin/management/{id}
Authorization: Required
```

### Обновление руководителя

```http
PUT /api/admin/management/{id}
Authorization: Required
Content-Type: application/json
```

**Тело запроса:** (как при создании)

### Удаление руководителя

```http
DELETE /api/admin/management/{id}
Authorization: Required
```

## Фотографии руководителей

Фотографии хранятся в директории:
```
public/images/bosses/
```

### Текущие фотографии:

1. `Кизимов_Николай_Владимирович.jpg` - Генеральный директор
2. `KizimovRN_2.jpg` - Зам. ген. директора по коммерческим вопросам
3. `konduktorov.jpg` - Директор по производству
4. `IvanishhevAG.jpg` - Зам. ген. директора по ГО и ЧС
5. `grechnev.jpg` - Главный инженер
6. `Снимок-экрана-2014-12-24-в-18.03.591.png` - Главный технолог
7. `Куликова-150x150.jpg` - Начальник управления охраны труда
8. `Stepanov.jpg` - Директор по безопасности
9. `Снимок-экрана-2014-12-24-в-18.00.18.png` - Зам. директора по безопасности
10. `Makarova.jpeg` - Начальник Управления технического контроля

### Рекомендации по фотографиям:

- **Формат**: JPG, PNG, WebP
- **Размер**: рекомендуется 400x400px (квадрат)
- **Качество**: среднее-высокое (80-90%)
- **Размер файла**: < 500 KB

## Применение миграции

```bash
# Подключитесь к базе данных
psql -h <host> -U <user> -d <database>

# Выполните миграцию
\i migrations/030_create_management_team_table.sql
```

Или через Supabase SQL Editor:
1. Откройте Supabase Dashboard
2. Перейдите в SQL Editor
3. Вставьте содержимое файла `030_create_management_team_table.sql`
4. Нажмите "Run"

## Использование в коде

### Получение данных на сервере (Next.js Server Component)

```typescript
import { createClient } from "@/utils/supabase/server"

async function getManagementTeam() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from("management_team")
    .select("id, full_name, position, bio, email, phone, image_url, sort_order")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
  
  if (error) {
    console.error("Ошибка при получении руководства:", error)
    return []
  }
  
  return data || []
}
```

### Получение данных на клиенте

```typescript
import { createClient } from "@/utils/supabase/client"

async function fetchManagementTeam() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from("management_team")
    .select("id, full_name, position, bio, email, phone, image_url, sort_order")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
  
  if (error) throw error
  return data
}
```

## Функции базы данных

### `get_active_management_team()`

Возвращает список активных руководителей, отсортированных по `sort_order`.

```sql
SELECT * FROM get_active_management_team();
```

## Безопасность

1. **Аутентификация**: Все административные операции требуют аутентификации
2. **RLS**: Row Level Security защищает данные на уровне базы данных
3. **Service Client**: Используется только в API routes для обхода RLS
4. **Валидация**: Все входные данные должны валидироваться на уровне API

## Тестирование

### Проверка доступа к данным

```bash
# Публичный доступ (чтение активных)
curl http://localhost:3000/about/management

# Административный доступ (CRUD)
curl -H "Authorization: Bearer <token>" \
     http://localhost:3000/api/admin/management
```

## Troubleshooting

### Не отображаются руководители

1. Проверьте, что миграция применена
2. Проверьте, что записи имеют `is_active = true`
3. Проверьте RLS политики
4. Проверьте подключение к Supabase

### Ошибки при загрузке фотографий

1. Проверьте, что файлы существуют в `public/images/bosses/`
2. Проверьте правильность путей в `image_url`
3. Проверьте расширения файлов

### Ошибки доступа в админке

1. Проверьте аутентификацию
2. Проверьте роль пользователя
3. Проверьте RLS политики

## Источник данных

Информация о руководителях взята с официального сайта:
**http://oaoplastic.ru/about/leaders**

---

**Дата создания**: 2026-01-26  
**Автор**: Система управления контентом АО "Пластик"  
**Версия**: 1.0
