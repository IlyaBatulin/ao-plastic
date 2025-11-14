# 🚀 Деплой на Vercel через GitHub

## 📋 Пошаговая инструкция

### Шаг 1: Подготовка GitHub репозитория

1. **Создайте репозиторий на GitHub:**
   - Перейдите на https://github.com/new
   - Введите имя репозитория (например: `plastic-web`)
   - Выберите приватный или публичный репозиторий
   - **НЕ добавляйте** README, .gitignore или лицензию (они уже есть)
   - Нажмите "Create repository"

2. **Загрузите код в GitHub:**

   Если у вас еще нет git репозитория:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/ваш-username/plastic-web.git
   git push -u origin main
   ```

   Если репозиторий уже есть:
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push
   ```

### Шаг 2: Создание проекта на Vercel

1. **Зарегистрируйтесь на Vercel:**
   - Перейдите на https://vercel.com
   - Нажмите "Sign Up"
   - Войдите через GitHub (рекомендуется)

2. **Создайте новый проект:**
   - Нажмите "Add New..." → "Project"
   - Найдите ваш репозиторий в списке
   - Нажмите "Import"

3. **Настройте проект:**
   - **Framework Preset:** Next.js (должен определиться автоматически)
   - **Root Directory:** `./` (по умолчанию)
   - **Build Command:** `npm run build` (по умолчанию)
   - **Output Directory:** `.next` (по умолчанию)
   - **Install Command:** `npm install` (по умолчанию)

### Шаг 3: Настройка переменных окружения

**⚠️ ВАЖНО:** В Vercel нужно добавить все переменные из `.env.local`

1. **В настройках проекта нажмите "Environment Variables"**

2. **Добавьте каждую переменную:**

   **Supabase (обязательно):**
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   ```

   **Telegram (обязательно):**
   ```
   TG_BOT_TOKEN
   TG_DEFAULT_CHAT_ID
   ```

   **Bitrix24 (опционально):**
   ```
   BITRIX_WEBHOOK_URL
   BITRIX_DEFAULT_ASSIGNED_ID
   ```

   **Опционально:**
   ```
   NEXT_PUBLIC_SITE_URL (URL вашего сайта на Vercel)
   ```

3. **Выберите окружения:**
   - ✅ Production
   - ✅ Preview (если нужны тестовые деплои)
   - ✅ Development (если используете локально через Vercel CLI)

4. **Нажмите "Save"** для каждой переменной

### Шаг 4: Деплой

1. **Нажмите "Deploy"**
   - Vercel автоматически запустит сборку
   - Процесс займет 2-5 минут

2. **Дождитесь завершения:**
   - Вы увидите прогресс в реальном времени
   - При успехе появится зеленый индикатор ✅

3. **Получите URL:**
   - Vercel выдаст URL типа: `https://your-project.vercel.app`
   - Этот URL можно использовать для доступа к сайту

### Шаг 5: Настройка домена (опционально)

Если хотите использовать свой домен:

1. В настройках проекта перейдите в "Domains"
2. Добавьте свой домен (например: `plastic.ru`)
3. Следуйте инструкциям Vercel для настройки DNS
4. Подождите несколько минут для применения

### Шаг 6: Обновление NEXT_PUBLIC_SITE_URL

После получения URL от Vercel:

1. Обновите переменную окружения `NEXT_PUBLIC_SITE_URL` в Vercel:
   ```
   NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
   ```
   Или свой домен, если настроили:
   ```
   NEXT_PUBLIC_SITE_URL=https://plastic.ru
   ```

2. **Пересоберите проект:**
   - Перейдите в "Deployments"
   - Нажмите "Redeploy" на последнем деплое

## 🔄 Автоматический деплой

После настройки:
- ✅ Каждый push в `main` ветку → автоматический деплой в Production
- ✅ Каждый push в другие ветки → Preview деплой
- ✅ Pull Request → Preview деплой с уникальным URL

## 🔍 Проверка деплоя

1. **Откройте ваш сайт:**
   ```
   https://your-project.vercel.app
   ```

2. **Проверьте логи:**
   - В Vercel Dashboard перейдите в "Deployments"
   - Выберите нужный деплой
   - Нажмите "View Function Logs"

3. **Проверьте работу функций:**
   - Откройте консоль браузера (F12)
   - Проверьте на ошибки
   - Протестируйте формы и API

## ⚙️ Настройка Supabase для продакшена

Убедитесь, что в Supabase:

1. **Добавлен домен в разрешенные:**
   - Supabase Dashboard → Settings → API
   - В "Site URL" добавьте URL вашего сайта на Vercel

2. **Проверьте CORS настройки** (если нужны)

3. **Проверьте RLS политики** для продакшен данных

## 🔒 Безопасность

⚠️ **ВАЖНО:**
- ✅ Никогда не коммитьте `.env.local` в git
- ✅ Все секреты должны быть в Vercel Environment Variables
- ✅ `SUPABASE_SERVICE_ROLE_KEY` - особенно чувствительный ключ, храните безопасно
- ✅ Используйте разные ключи для разработки и продакшена (если нужно)

## 🐛 Решение проблем

### Ошибка сборки

**Проблема:** Build fails

**Решение:**
1. Проверьте логи в Vercel Dashboard
2. Убедитесь, что все зависимости в `package.json`
3. Проверьте, что все переменные окружения добавлены

### Ошибка API

**Проблема:** API routes не работают

**Решение:**
1. Проверьте переменные окружения в Vercel
2. Проверьте логи функций в Vercel Dashboard
3. Убедитесь, что Supabase URL и ключи правильные

### Ошибка подключения к Supabase

**Проблема:** Cannot connect to Supabase

**Решение:**
1. Проверьте `NEXT_PUBLIC_SUPABASE_URL` и `NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. Убедитесь, что домен добавлен в Supabase Dashboard
3. Проверьте RLS политики в Supabase

## 📚 Полезные ссылки

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/concepts/next.js/overview)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

## ✅ Чеклист перед деплоем

- [ ] Код загружен в GitHub
- [ ] Проект создан на Vercel
- [ ] Все переменные окружения добавлены
- [ ] `NEXT_PUBLIC_SITE_URL` обновлен после деплоя
- [ ] Supabase настроен для продакшена
- [ ] Протестирована работа сайта

Удачи! 🚀

