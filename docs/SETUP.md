# 🚀 Инструкция по настройке проекта

## 1. Создание файла .env.local

Создайте файл `.env.local` в корне проекта со следующим содержимым:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
# Service Role Key (для серверных операций - НЕ ПУБЛИКУЙТЕ!)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_SITE_URL=https://your-site-domain.ru  # опционально, для ссылок в Bitrix24

# Security - Пароли для доступа (ОБЯЗАТЕЛЬНО измените на свои!)
SITE_PASSWORD=your-secure-site-password-here
ADMIN_PASSWORD=your-secure-admin-password-here

# Telegram Bot Configuration
TG_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TG_DEFAULT_CHAT_ID=123456789

# Bitrix24 Webhook (optional)
BITRIX_WEBHOOK_URL=https://your-domain.bitrix24.ru/rest/1/webhook-code/
BITRIX_DEFAULT_ASSIGNED_ID=1  # опционально, ID ответственного менеджера в Bitrix24
```

## 2. Настройка Supabase

1. Создайте проект на [supabase.com](https://supabase.com)
2. Скопируйте URL и Anon Key из настроек проекта
3. **Важно:** Получите Service Role Key:
   - Откройте **Settings** → **API** в Supabase Dashboard
   - Найдите секцию **Project API keys**
   - Скопируйте **`service_role`** key (НЕ `anon` key!)
   - Добавьте его в `.env.local` как `SUPABASE_SERVICE_ROLE_KEY`
   - ⚠️ **НИКОГДА не публикуйте этот ключ!** Он обходит все RLS политики
4. (Опционально) Определите ID ответственного менеджера в Bitrix24:
   - Откройте карточку нужного сотрудника (раздел «Сотрудники»)
   - Посмотрите ID в адресной строке, используйте его в `BITRIX_DEFAULT_ASSIGNED_ID`
4. Примените миграции из папки `migrations/`:
   
   **Важно:** Применяйте миграции строго в следующем порядке:
   
   1. `001_initial_schema.sql` - базовая схема (все таблицы)
   2. `import_categories.sql` - категории и подкатегории
   3. `add_products_columns.sql` - дополнительные колонки для товаров
   4. Остальные миграции по необходимости
   
   **Как применить:**
   - Откройте SQL Editor в Supabase Dashboard
   - Создайте новый запрос (New Query)
   - Скопируйте содержимое файла миграции
   - Нажмите Run или `Ctrl+Enter`
   - Повторите для всех миграций
   
   Подробные инструкции: [`migrations/README.md`](../migrations/README.md)

## 3. Настройка Telegram Bot

### Шаг 1: Создание бота
1. Найдите [@BotFather](https://t.me/BotFather) в Telegram
2. Отправьте команду `/newbot`
3. Следуйте инструкциям и получите токен бота
4. Добавьте токен в `.env.local` как `TG_BOT_TOKEN`

### Шаг 2: Получение Chat ID

**Вариант A: Через готовый скрипт**
```bash
npm run get-chat-id
```

**Вариант B: Вручную**
1. Найдите своего бота в Telegram
2. Начните диалог (отправьте любое сообщение)
3. Откройте в браузере: `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates`
4. Найдите `"chat":{"id":123456789}` в ответе
5. Добавьте этот ID в `.env.local` как `TG_DEFAULT_CHAT_ID`

### Шаг 3: Тестирование
Отправьте тестовый заказ на сайте — должно прийти уведомление в Telegram.

## 4. Настройка Bitrix24 (опционально)

### Шаг 1: Создание входящего вебхука
1. Войдите в ваш Bitrix24
2. Откройте **Настройки** → **Разработчикам** → **Другое** → **Входящий вебхук**
3. Нажмите "Добавить вебхук"
4. Разрешите права:
   - ✅ `crm` — Работа с CRM
   - ✅ `user` — Информация о пользователях
5. Выберите пользователя для авторизации запросов (рекомендуется: администратор)
6. Скопируйте URL вебхука (например: `https://your-domain.bitrix24.ru/rest/1/abc123def456/`)
7. Добавьте URL в `.env.local` как `BITRIX_WEBHOOK_URL`

### Шаг 2: Настройка приема данных в Bitrix24

Bitrix24 будет получать данные в формате:
```json
{
  "event": "order_created",
  "order_id": 123,
  "manager_id": 1,
  "customer_name": "Иван Иванов",
  "customer_phone": "+7 999 123-45-67",
  "customer_email": "ivan@example.com",
  "order_date": "2024-01-15T10:30:00Z",
  "items": [
    {"name": "ПСВ-С марка 1", "quantity": 10},
    {"name": "ПСВ-С марка 2", "quantity": 5}
  ]
}
```

**Примечание:** Для создания сделок в Bitrix24 потребуется дополнительный обработчик на стороне Bitrix24 или настройка автоматических правил через Смарт-процессы.

## 5. База данных менеджеров

Не забудьте добавить менеджеров в таблицу `managers` в Supabase:

```sql
-- Пример добавления менеджера
INSERT INTO public.managers (id, name, tg_chat_id, email, phone)
VALUES (1, 'Иван Иванов', '123456789', 'ivan@example.com', '+7 999 123-45-67');
```

## 6. Правила маршрутизации заказов

Добавьте правила в таблицу `routing_rules`:

```sql
-- Пример: все заказы по категории "polystyrene" → менеджер #1
INSERT INTO public.routing_rules (category_id, manager_id, priority, is_active)
VALUES ('polystyrene', 1, 1, true);

-- Пример: по умолчанию → менеджер #2
INSERT INTO public.routing_rules (manager_id, priority, is_active)
VALUES (2, 100, true);
```

## 7. Запуск проекта

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000)

## 📝 Примечания

- **Безопасность**: Никогда не публикуйте `.env.local` в git!
- **Тестирование**: Проверьте работу всех интеграций перед публикацией
- **Логи**: Смотрите логи в консоли браузера и сервера для отладки

