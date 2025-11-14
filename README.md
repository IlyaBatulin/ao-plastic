# 🏭 АО «Пластик» — Корпоративный сайт с интеграцией Telegram и Bitrix24

Корпоративный сайт компании АО «Пластик» с полным каталогом продукции, корзиной покупок, автоматической отправкой уведомлений в Telegram и интеграцией с Bitrix24.

## ✨ Основные возможности

### 🛍️ Каталог продукции
- **Категории и подкатегории** с изображениями и видео
- **Детальные страницы товаров** с характеристиками
- **Умная система фильтрации** (плотность, фракция, применение)
- **Таблица с рекомендованным применением** по маркам

### 🛒 Корзина покупок
- **Добавление товаров** в корзину с localStorage
- **Управление количеством** и удаление позиций
- **Форма оформления заказа** с валидацией
- **Красивые уведомления** при добавлении/удалении

### 📱 Telegram уведомления
- **Автоматические уведомления** при каждом заказе
- **Распределение по менеджерам** по категориям товаров
- **Информативные сообщения** с данными клиента и товаров
- **Асинхронная отправка** (не блокирует сайт)

### 🔗 Bitrix24 интеграция
- **Отправка заказов** в Bitrix24 через webhook
- **Полная информация** о клиенте и товарах
- **Гибкая настройка** обработчиков на стороне Bitrix24

## 🚀 Быстрый старт

### 1. Установка зависимостей

```bash
npm install
```

### 2. Настройка окружения

Создайте файл `.env.local` в корне проекта:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Telegram (обязательно)
TG_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TG_DEFAULT_CHAT_ID=123456789

# Bitrix24 (опционально)
BITRIX_WEBHOOK_URL=https://your-domain.bitrix24.ru/rest/1/webhook-code/
```

### 3. Настройка Базы данных

**ВАЖНО:** Сначала создайте проект в [Supabase](https://supabase.com) и скопируйте URL + Anon Key в `.env.local`

Затем примените миграции в SQL Editor (строго по порядку):
- `001_initial_schema.sql` — базовая схема (таблицы)
- `002_insert_test_data.sql` — тестовые менеджеры
- `import_categories.sql` — категории товаров
- `add_products_columns.sql` — дополнительные поля
- Остальные миграции по необходимости

📖 Подробная инструкция: [migrations/README.md](migrations/README.md)

### 4. Настройка Telegram

```bash
# Получить Chat ID
npm run get-chat-id

# Протестировать отправку
npm run test-tg
```

Подробная инструкция: [docs/TELEGRAM_SETUP.md](docs/TELEGRAM_SETUP.md)

### 5. Запуск

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000)

## 📚 Документация

- [Общая настройка](docs/SETUP.md) — полная инструкция по настройке
- [Деплой на Vercel](docs/VERCEL_DEPLOY.md) — инструкция по развертыванию через GitHub
- [Telegram Bot](docs/TELEGRAM_SETUP.md) — настройка Telegram уведомлений
- [Bitrix24](docs/BITRIX24_SETUP.md) — интеграция с Bitrix24
- [Итоговый отчет](docs/INTEGRATION_SUMMARY.md) — что было реализовано
- [Видео на страницах](README-VIDEO.md) — инструкция по добавлению видео

## 🏗️ Технологии

- **Framework**: Next.js 16 с App Router
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS 4
- **UI**: Radix UI
- **Animations**: Framer Motion, GSAP
- **Integrations**: Telegram Bot API, Bitrix24 REST API
- **State**: React Context API
- **i18n**: Custom i18n system

## 📁 Структура проекта

```
plasticWEB1/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   └── order/            # Endpoint для заказов
│   ├── products/             # Каталог продукции
│   ├── cart/                 # Корзина
│   └── ...
├── components/               # React компоненты
├── contexts/                 # React Context
│   ├── cart-context.tsx      # Управление корзиной
│   └── language-context.tsx  # Языковой переключатель
├── docs/                     # Документация
├── migrations/               # SQL миграции
├── public/                   # Статические файлы
├── scripts/                  # Утилиты
│   ├── get-chat-id.ts        # Получение Chat ID
│   └── test-telegram.ts      # Тестирование Telegram
└── utils/                    # Утилиты
    └── supabase/             # Supabase клиенты
```

## 🎯 Особенности реализации

### Каталог продукции
- SSG для основных страниц
- ISR для обновления контента
- Fallback на JSON при недоступности Supabase
- Красивые анимации появления карточек

### Корзина
- localStorage для сохранения состояния
- Toast уведомления
- Счетчик товаров в header
- Валидация формы заказа

### Telegram
- Маршрутизация менеджеров по категориям
- Разные уведомления для главного и позиционных менеджеров
- Форматирование Markdown
- Обработка ошибок без сбоя сайта

### Bitrix24
- Отправка данных о товарах и клиентах
- Асинхронная обработка
- Логирование всех операций

## 🔒 Безопасность

- ✅ Row Level Security (RLS) в Supabase
- ✅ Только публичные данные в клиентской части
- ✅ Валидация всех входных данных
- ✅ Обработка ошибок без утечки данных
- ✅ `.env.local` в `.gitignore`

## 📊 База данных

### Основные таблицы
- `categories` — категории товаров
- `subcategories` — подкатегории
- `products` — товары с характеристиками
- `orders` — заказы
- `order_items` — позиции заказов (корзина)
- `managers` — менеджеры
- `routing_rules` — правила назначения менеджеров

### Автоматические функции
- `assign_manager_to_order()` — назначение менеджеров
- `fn_on_order_items_insert()` — триггер при добавлении позиций

## 🧪 Тестирование

```bash
# Тестирование Telegram
npm run test-tg

# Локальный запуск
npm run dev

# Сборка для продакшена
npm run build
```

## 📦 Скрипты

```bash
npm run dev          # Запуск dev сервера
npm run build        # Сборка для продакшена
npm run start        # Запуск продакшен сервера
npm run lint         # Проверка кода
npm run get-chat-id  # Получение Chat ID для Telegram
npm run test-tg      # Тестирование Telegram бота
```

## 🤝 Поддержка

При возникновении проблем:
1. Проверьте логи в консоли
2. Убедитесь что все переменные в `.env.local` заполнены
3. Проверьте подключение к Supabase
4. Смотрите подробную документацию в папке `docs/`

## 📝 Лицензия

Proprietary — АО «Пластик»

