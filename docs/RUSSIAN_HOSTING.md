# 🚀 Деплой на российские хостинги

Быстрые варианты для деплоя в России с хорошей скоростью работы.

## 🏆 Рекомендуемые варианты (от быстрого к более сложному)

### 1. **Yandex Cloud** ⭐ ЛУЧШИЙ ВЫБОР
**Почему:** Российский, быстрый, отлично работает в РФ, бесплатный тариф есть

**Способ:** Serverless Containers или Cloud Run

**Плюсы:**
- ✅ Бесплатный тариф: 1 млн запросов/месяц
- ✅ Автоматическое масштабирование
- ✅ CDN встроен
- ✅ Быстрая работа в России
- ✅ Поддержка Next.js из коробки

**Домены:**
- ❌ Нет бесплатного домена
- ✅ Дают бесплатный поддомен: `ваш-проект.website.yandexcloud.net`
- ✅ Можно подключить свой домен (покупать отдельно, от 99₽/год)

**Как деплоить:**
1. Зарегистрируйтесь на https://cloud.yandex.ru
2. Создайте Serverless Container
3. Используйте Dockerfile (см. ниже)
4. Настройте домен

**Время деплоя:** 10-15 минут

---

### 2. **Timeweb** ⭐ ПРОСТОЙ ВАРИАНТ
**Почему:** Российский, простой интерфейс, хорошая поддержка

**Способ:** VPS или хостинг с Node.js

**Плюсы:**
- ✅ Простая панель управления
- ✅ Хорошая поддержка на русском
- ✅ От 200₽/месяц
- ✅ Быстрая работа в России

**Домены:**
- ✅ **БЕСПЛАТНЫЙ домен** при покупке хостинга на год (`.ru`, `.рф`, `.com` и др.)
- ✅ Или используйте поддомен: `ваш-проект.timeweb.ru`
- ✅ Можно подключить свой домен (покупать отдельно, от 99₽/год)

**Как деплоить:**
1. Зарегистрируйтесь на https://timeweb.com
2. Закажите VPS или хостинг с Node.js
3. Получите бесплатный домен (при покупке на год)
4. Загрузите проект через SSH
5. Установите зависимости и запустите

**Время деплоя:** 20-30 минут

---

### 3. **Selectel** ⭐ ДЛЯ ПРОДВИНУТЫХ
**Почему:** Российский, высокая производительность, хорошие цены

**Способ:** VPS или Cloud Platform

**Плюсы:**
- ✅ Высокая производительность
- ✅ Хорошие цены
- ✅ Отличная документация
- ✅ Быстрая работа в России

**Домены:**
- ❌ Нет бесплатного домена
- ✅ Можно подключить свой домен (покупать отдельно, от 99₽/год)

**Время деплоя:** 30-40 минут

---

### 4. **Beget**
**Почему:** Российский, популярный, простой

**Способ:** VPS или хостинг

**Плюсы:**
- ✅ Популярный в России
- ✅ Простая панель
- ✅ От 200₽/месяц

**Домены:**
- ✅ **БЕСПЛАТНЫЙ домен** при покупке хостинга на год (`.ru`, `.рф`, `.com` и др.)
- ✅ Или используйте поддомен: `ваш-проект.beget.app`
- ✅ Можно подключить свой домен (покупать отдельно, от 99₽/год)

**Время деплоя:** 20-30 минут

---

## 🐳 Dockerfile для деплоя

Создайте файл `Dockerfile` в корне проекта:

```dockerfile
FROM node:20-alpine AS base

# Установка зависимостей
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Сборка приложения
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Продакшен образ
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

**Важно:** Добавьте в `next.config.mjs`:

```js
const nextConfig = {
  output: 'standalone', // для Docker
  // ... остальные настройки
}
```

---

## 📋 Быстрая инструкция для Timeweb (самый простой вариант)

### Шаг 1: Подготовка
1. Зарегистрируйтесь на https://timeweb.com
2. Закажите VPS (от 200₽/месяц) или хостинг с Node.js

### Шаг 2: Подключение
1. Получите доступы по SSH
2. Подключитесь через SSH клиент (PuTTY, Terminal)

### Шаг 3: Установка Node.js
```bash
# Для Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Проверка
node -v
npm -v
```

### Шаг 4: Загрузка проекта
```bash
# Создайте директорию
mkdir -p ~/plastic-web
cd ~/plastic-web

# Загрузите файлы через:
# 1. Git (если есть репозиторий)
git clone https://github.com/ваш-username/plastic-web.git .

# 2. Или через FTP/SFTP (FileZilla)
# Загрузите все файлы проекта
```

### Шаг 5: Установка зависимостей
```bash
npm install
```

### Шаг 6: Настройка переменных окружения
```bash
# Создайте .env.local
nano .env.local

# Добавьте все переменные из вашего локального .env.local
# Сохраните: Ctrl+O, Enter, Ctrl+X
```

### Шаг 7: Сборка и запуск
```bash
# Сборка
npm run build

# Запуск (временно для теста)
npm start

# Для постоянной работы используйте PM2
npm install -g pm2
pm2 start npm --name "plastic-web" -- start
pm2 save
pm2 startup
```

### Шаг 8: Настройка домена
1. В панели Timeweb добавьте домен
2. Настройте A-запись на IP вашего VPS
3. Настройте Nginx (если нужен)

---

## 🔧 Настройка Nginx (опционально)

Создайте файл `/etc/nginx/sites-available/plastic-web`:

```nginx
server {
    listen 80;
    server_name ваш-домен.ru;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Активируйте:
```bash
sudo ln -s /etc/nginx/sites-available/plastic-web /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## ⚡ Быстрый деплой через Yandex Cloud (рекомендуется)

### Шаг 1: Регистрация
1. Зайдите на https://cloud.yandex.ru
2. Создайте аккаунт (есть бесплатный тариф)

### Шаг 2: Создание Container Registry
1. Cloud → Container Registry
2. Создайте реестр

### Шаг 3: Сборка и загрузка образа
```bash
# Установите Yandex Cloud CLI
# https://cloud.yandex.ru/docs/cli/quickstart

# Авторизация
yc init

# Сборка образа
docker build -t cr.yandex/ваш-реестр/plastic-web:latest .

# Загрузка в реестр
docker push cr.yandex/ваш-реестр/plastic-web:latest
```

### Шаг 4: Создание Serverless Container
1. Cloud → Serverless Containers
2. Создайте контейнер
3. Выберите образ из реестра
4. Настройте переменные окружения
5. Запустите

**Готово!** Сайт будет доступен по URL от Yandex Cloud.

---

## 🔒 Настройка переменных окружения

**ВАЖНО:** На всех хостингах нужно добавить переменные из `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
TG_BOT_TOKEN=...
TG_DEFAULT_CHAT_ID=...
BITRIX_WEBHOOK_URL=...
NEXT_PUBLIC_SITE_URL=https://ваш-домен.ru
```

---

## 📊 Сравнение вариантов

| Хостинг | Сложность | Цена/месяц | Бесплатный домен | Скорость в РФ | Время деплоя |
|---------|-----------|------------|------------------|---------------|--------------|
| **Yandex Cloud** | Средняя | Бесплатно* | ❌ (только поддомен) | ⭐⭐⭐⭐⭐ | 15 мин |
| **Timeweb** | Простая | От 200₽ | ✅ (при оплате на год) | ⭐⭐⭐⭐ | 30 мин |
| **Selectel** | Средняя | От 300₽ | ❌ | ⭐⭐⭐⭐⭐ | 40 мин |
| **Beget** | Простая | От 200₽ | ✅ (при оплате на год) | ⭐⭐⭐⭐ | 30 мин |

*Бесплатно до 1 млн запросов/месяц

## 🌐 Информация о доменах

### Где есть бесплатные домены:
- ✅ **Timeweb** — бесплатный домен при покупке хостинга на год (`.ru`, `.рф`, `.com`, `.net` и др.)
- ✅ **Beget** — бесплатный домен при покупке хостинга на год
- ✅ **REG.RU** — часто дают бесплатный домен при покупке хостинга

### Где нет бесплатных доменов:
- ❌ **Yandex Cloud** — только бесплатный поддомен `*.website.yandexcloud.net`
- ❌ **Selectel** — нужно покупать отдельно

### Где купить домен дешево:
- **REG.RU** — от 99₽/год для `.ru`
- **Timeweb** — от 99₽/год для `.ru`
- **Beget** — от 99₽/год для `.ru`
- **Яндекс.Домены** — от 149₽/год для `.ru`

### Временное решение (для теста):
Можно использовать бесплатный поддомен от хостинга:
- Timeweb: `ваш-проект.timeweb.ru`
- Beget: `ваш-проект.beget.app`
- Yandex Cloud: `ваш-проект.website.yandexcloud.net`

---

## ✅ Рекомендация

**Для быстрого деплоя:** Используйте **Timeweb VPS** - самый простой вариант
**Для лучшей производительности:** Используйте **Yandex Cloud** - бесплатно и быстро

---

## 🆘 Нужна помощь?

Если возникнут проблемы:
1. Проверьте логи: `pm2 logs` или в панели хостинга
2. Убедитесь, что все переменные окружения установлены
3. Проверьте, что порт 3000 открыт в firewall

