-- ============================================================
-- ТЕСТОВЫЕ ДАННЫЕ: Менеджеры и правила маршрутизации
-- ============================================================

-- ========== ДОБАВЛЕНИЕ МЕНЕДЖЕРОВ ==========
insert into public.managers (id, name, tg_chat_id, email, phone, is_active)
values
  (1, 'Главный менеджер', null, 'manager@plastic.ru', '+7 999 123-45-67', true),
  (2, 'Менеджер по полистиролу', null, 'polystyrene@plastic.ru', '+7 999 123-45-68', true),
  (3, 'Менеджер по АБС', null, 'abs@plastic.ru', '+7 999 123-45-69', true)
on conflict (id) do update
set name = excluded.name,
    tg_chat_id = excluded.tg_chat_id,
    email = excluded.email,
    phone = excluded.phone,
    is_active = excluded.is_active;

comment on table public.managers is 'Менеджеры - добавьте ваших менеджеров с реальными Telegram Chat ID';

-- ========== ПРАВИЛА МАРШРУТИЗАЦИИ ==========
insert into public.routing_rules (category_id, manager_id, priority, is_active)
values
  -- Полистирол → Менеджер #2
  ('polystyrene', 2, 10, true),
  -- АБС → Менеджер #3
  ('abs', 3, 10, true),
  -- По умолчанию → Главный менеджер
  (null, 1, 100, true)
on conflict do nothing;

comment on table public.routing_rules is 'Правила маршрутизации заказов между менеджерами';

-- ========== ИНСТРУКЦИЯ ПО НАСТРОЙКЕ ==========
comment on table public.managers is '
ВАЖНО: После добавления менеджеров обновите их Telegram Chat ID!

1. Получите Chat ID каждого менеджера:
   - Отправьте сообщение боту в Telegram
   - Запустите: npm run get-chat-id
   - Скопируйте нужный Chat ID

2. Обновите менеджеров:
   UPDATE managers 
   SET tg_chat_id = ''123456789'' 
   WHERE id = 1;

3. Или добавьте нового менеджера:
   INSERT INTO managers (name, tg_chat_id, email, phone)
   VALUES (''Новый менеджер'', ''987654321'', ''new@plastic.ru'', ''+7 999 123-45-70'');
';

-- Готово!

