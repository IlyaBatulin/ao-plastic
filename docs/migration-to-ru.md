# План переезда с Supabase на инфраструктуру в РФ

> Составлен 10.07.2026 по результатам полной инвентаризации кода и данных.

## Что показала инвентаризация

Связанность с Supabase — **низкая**. Из всех сервисов Supabase используется только
доступ к Postgres через PostgREST (`.from().select/insert/update/delete`):

| Не используется | Используется |
|---|---|
| Supabase Auth (своя HMAC-аутентификация в middleware) | PostgREST: 15 таблиц + 1 view |
| Supabase Storage (0 бакетов; файлы в `public/uploads`, ~816 КБ) | Реляционное встраивание в 2 роутах |
| Realtime / Edge Functions / RPC / upsert | `count: exact, head: true` в 4 роутах |

**Данные (всего ~430 строк):** products 128, order_items 95, extrusion_products 80,
orders 72, subcategories 18, categories 14, management_team 10, contact_messages 9,
managers 2, news 1, остальные пустые + view `v_categories_summary`.

**Точки привязки в коде:** 3 env-переменные (`NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`), `next.config.mjs`
(remotePatterns и CSP `*.supabase.co`), прямые REST-fetch в `app/sitemap.ts`.

**Мелкие долги, найденные при инвентаризации:**
- `utils/supabase/middleware.ts` — мёртвый код, можно удалить;
- таблица `manager_categories` в БД не существует (код тихо глотает 404) —
  при миграции создать или удалить обращение;
- `extrusion_products` читается кодом, хотя раздел с сайта убран.

---

## Вариант А (рекомендую): self-hosted Supabase на VPS в РФ

**Код не меняется вообще** (supabase-js совместим со self-hosted),
меняются 3 env-переменные и 2 строки next.config.mjs. Самый быстрый путь.

- Сайт (Docker, standalone-сборка уже настроена) + Supabase на одном VPS →
  задержка до БД ~0 мс вместо похода за границу.
- Что поднимается: официальный `supabase/docker-compose.yml`
  (Postgres 15 + PostgREST + Kong + Studio; GoTrue/Realtime/Storage можно выключить).
- Требования: VPS 4 vCPU / 8 ГБ / 80 ГБ NVMe — с запасом и под сайт, и под БД.

**Провайдеры РФ (порядок цен на такой VPS):**

| Провайдер | Ориентир цены | Примечание |
|---|---|---|
| Timeweb Cloud | ~1500–2500 ₽/мес | просто, быстро, панель удобная |
| Selectel | ~2000–3500 ₽/мес | надёжность, есть managed PG на будущее |
| Yandex Cloud | ~2500–4500 ₽/мес | дороже, но всё managed-экосистема рядом |
| VK Cloud / REG.RU | ~1500–3000 ₽/мес | альтернативы |

## Вариант Б: Managed PostgreSQL в РФ + PostgREST

Яндекс Managed Service for PostgreSQL / Selectel DBaaS (бэкапы, обновления,
отказоустойчивость «из коробки») + маленький контейнер PostgREST + nginx,
эмулирующий путь `/rest/v1` и заголовок apikey. Код тоже не меняется,
но настройка тоньше (JWT-роли PostgREST, ручная эмуляция Kong).
Дороже (~от 3000 ₽/мес за кластер) и дольше на настройку. Имеет смысл,
когда данных станет много и захочется managed-бэкапов.

## Вариант В (на будущее, не сейчас): отказ от supabase-js

Переписать слой данных на `pg`/Drizzle (~35 файлов с `.from()`), мега-меню
перевести на внутренний /api-роут — тогда БД вообще не торчит наружу.
Это «правильно», но это дни работы, а не вечер. Делать после переезда, не вместо.

---

## Пошаговый план (вариант А, всё за 1 день)

### Подготовка (без простоя, ~2–3 часа)
1. Купить VPS (Ubuntu 22.04+), докупить домен/поддомен для API если нужен
   (можно жить и на IP + том же домене сайта через nginx).
2. Установить Docker + docker compose; настроить firewall (открыты 80/443, 22).
3. Склонировать `supabase/docker` (официальный self-host), в `.env` задать:
   свои `POSTGRES_PASSWORD`, `JWT_SECRET` и сгенерировать пары `ANON_KEY` /
   `SERVICE_ROLE_KEY` (генератор в доках Supabase self-hosting). Отключить
   ненужные сервисы (GoTrue, Realtime, Storage) в compose.
4. Поднять стек, проверить `curl http://localhost:8000/rest/v1/` c новым anon-ключом.
5. nginx + certbot: `https://db.ваш-домен.ru` → Kong (8000).

### Перенос данных (~30 минут)
6. Дамп из Supabase (Dashboard → Settings → Database → Connection string):
   `pg_dump "postgresql://postgres:...@db.ohkjgjvsuppbwcnvoquq.supabase.co:5432/postgres" --schema=public --no-owner --no-privileges -f dump.sql`
7. Восстановить в новый Postgres: `psql -h localhost -U postgres -d postgres -f dump.sql`
   (view `v_categories_summary` приедет в дампе; проверить, что приехал).
8. Создать недостающую таблицу `manager_categories` (или вычистить обращение
   в `app/api/admin/managers/route.ts`).
9. Выдать права ролям PostgREST (`anon`, `service_role`) как в Supabase
   (в self-hosted дампе роли уже настроены init-скриптами compose).
10. Смоук-тест по чек-листу ниже прямо на новом URL.

### Переключение (окно простоя 10–15 минут)
11. Единственные «живые» пишущиеся данные — заказы и заявки с форм.
    На время переключения включить `SITE_PASSWORD` (сайт закрыт заглушкой) —
    новые заказы не потеряются, потому что их просто не оформят.
12. Повторить пункт 6–7 (свежий дамп → рестор) — данные актуальны на минуту переключения.
13. Поменять env на сервере сайта:
    `NEXT_PUBLIC_SUPABASE_URL=https://db.ваш-домен.ru`,
    новые `ANON_KEY`/`SERVICE_ROLE_KEY`; в `next.config.mjs` заменить
    `*.supabase.co` на свой домен в remotePatterns и CSP (wss можно удалить),
    пересобрать/перезапустить контейнер сайта.
14. Снять `SITE_PASSWORD`, прогнать чек-лист. Старый Supabase-проект
    НЕ удалять 2 недели — это мгновенный откат (вернуть 3 env).

### Чек-лист смоук-теста
- [ ] `/products` и мега-меню каталога (браузерный клиент → новый URL)
- [ ] карточка товара, `/sitemap.xml` (сырые fetch)
- [ ] оформление тестового заказа из корзины + письмо/Telegram
- [ ] формы: контакты, отклик на вакансию, ответ на РФП
- [ ] админка: дашборд (stats/count), заказы (встраивание `categories:category_id`),
      CRUD товара, загрузка картинки (пишется в `public/uploads` — нужен
      volume: `-v /srv/uploads:/app/public/uploads` в docker run сайта)
- [ ] новости: создание в админке → появление на главной

### Сайт тоже в РФ
Dockerfile готов (standalone включён). На том же VPS: контейнер сайта + nginx
(80/443 → 3000) + volume для `public/uploads` + certbot. DNS домена → IP VPS.
TTL DNS заранее снизить до 300 сек, тогда переключение почти мгновенное.

### Бэкапы после переезда (обязательно)
- cron: ночной `pg_dump | gzip` + копия `public/uploads` на второй сервер/S3-совместимое
  хранилище в РФ (Selectel S3, Yandex Object Storage);
- хранить 14 суточных + 4 недельных копии; раз в месяц проверять рестор.

## Что мне понадобится от тебя
1. Выбор провайдера и оплаченный VPS (могу помочь с выбором тарифа).
2. Доступ по SSH (или выполняешь команды по моей инструкции).
3. Доступ к DNS-панели домена.
4. Пароль от Supabase Dashboard (для connection string дампа).
