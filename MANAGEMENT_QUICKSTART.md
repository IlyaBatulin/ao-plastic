# Раздел "Руководство" - Быстрый старт

## ✅ Что сделано

1. **Создана таблица в БД** `management_team` с полями:
   - ФИО, должность, биография
   - Email, телефон
   - URL фотографии
   - Порядок отображения
   - Статус активности

2. **Добавлены реальные данные** о 10 руководителях с сайта http://oaoplastic.ru/about/leaders:
   - Кизимов Николай Владимирович - Генеральный директор
   - Кизимов Роман Николаевич - Зам. ген. директора по коммерции
   - Кондукторов Сергей Витальевич - Директор по производству
   - Иванищев Александр Геннадьевич - Зам. ген. директора по ГО и ЧС
   - Гречнев Николай Николаевич - Главный инженер
   - Халеева Ольга Алексеевна - Главный технолог
   - Куликова Надежда Владимировна - Начальник управления ОТ, ПБ и ООС
   - Степанов Вячеслав Дмитриевич - Директор по безопасности
   - Зайчик Владимир Владимирович - Зам. директора по безопасности
   - Макарова Юлия Николаевна - Начальник УТК

3. **Привязаны фотографии** из `public/images/bosses/`

4. **Создана страница** `/about/management`:
   - Серверный компонент для получения данных
   - Клиентский компонент с анимациями
   - Использует ChromaGrid для красивого отображения

5. **Созданы API endpoints** для административной панели:
   - `GET /api/admin/management` - список всех руководителей
   - `POST /api/admin/management` - добавить руководителя
   - `GET /api/admin/management/[id]` - получить одного
   - `PUT /api/admin/management/[id]` - обновить
   - `DELETE /api/admin/management/[id]` - удалить

6. **Настроена безопасность**:
   - Row Level Security (RLS)
   - Публичный доступ только для чтения активных
   - Административные операции требуют аутентификации

## 🚀 Применение миграции

### Через Supabase Dashboard

1. Откройте **Supabase Dashboard**
2. Перейдите в **SQL Editor**
3. Откройте файл `migrations/030_create_management_team_table.sql`
4. Скопируйте содержимое и вставьте в SQL Editor
5. Нажмите **Run** или `Ctrl+Enter`

### Через командную строку

```bash
psql -h your-host -U postgres -d your-database -f migrations/030_create_management_team_table.sql
```

## 📂 Структура файлов

```
├── migrations/
│   └── 030_create_management_team_table.sql  # SQL миграция
├── app/
│   ├── about/management/
│   │   ├── page.tsx                          # Серверная страница
│   │   └── management-client.tsx             # Клиентский компонент
│   └── api/admin/management/
│       ├── route.ts                          # GET список, POST создание
│       └── [id]/route.ts                     # GET/PUT/DELETE конкретный
├── types/
│   └── database.ts                           # TypeScript типы
├── public/images/bosses/                     # Фотографии руководителей
└── docs/
    └── MANAGEMENT_TEAM.md                    # Полная документация
```

## 🔍 Проверка работы

### 1. Проверьте страницу

Откройте в браузере:
```
http://localhost:3000/about/management
```

### 2. Проверьте API (требуется авторизация)

```bash
# Получить список руководителей
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:3000/api/admin/management

# Создать нового руководителя
curl -X POST \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"full_name":"Тестов Тест Тестович","position":"Тестовая должность","sort_order":999}' \
     http://localhost:3000/api/admin/management
```

## 📸 Добавление новых фотографий

1. Разместите фото в `public/images/bosses/`
2. Рекомендуемый формат: JPG, PNG, WebP
3. Рекомендуемый размер: 400x400px
4. Путь в БД: `/images/bosses/имя_файла.jpg`

## 🛠️ Редактирование через API

### Обновить руководителя

```javascript
const response = await fetch('/api/admin/management/{id}', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: JSON.stringify({
    full_name: 'Новое ФИО',
    position: 'Новая должность',
    bio: 'Новая биография',
    image_url: '/images/bosses/new_photo.jpg',
    sort_order: 15,
    is_active: true
  })
})
```

### Деактивировать руководителя

```javascript
await fetch('/api/admin/management/{id}', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: JSON.stringify({ is_active: false })
})
```

## 📖 Дополнительная информация

Полная документация: `docs/MANAGEMENT_TEAM.md`

## ⚠️ Важно

- Миграция добавляет 10 руководителей из официального сайта
- Все руководители по умолчанию активны (`is_active = true`)
- Сортировка по полю `sort_order` (10, 20, 30, ...)
- Для редактирования через админку требуется аутентификация

## 🎯 Следующие шаги

1. ✅ Применить миграцию
2. ✅ Проверить страницу http://localhost:3000/about/management
3. 📝 При необходимости обновить биографии через API
4. 🖼️ Заменить временные фотографии на качественные
5. 🔒 Настроить административную панель для редактирования

---

**Готово к использованию!** 🎉
