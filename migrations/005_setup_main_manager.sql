-- ============================================================
-- НАСТРОЙКА: Менеджеры с реальными Telegram Chat ID
-- ============================================================

-- Добавляем менеджеров
INSERT INTO public.managers (id, name, tg_chat_id, email, phone)
VALUES 
  (1, 'Главный менеджер', '8273490886', 'manager@plastic.ru', '+7 999 123-45-67'),
  (2, 'Менеджер по АБС', '994095389', 'abs@plastic.ru', '+7 999 123-45-68')
ON CONFLICT (id) DO UPDATE
SET tg_chat_id = EXCLUDED.tg_chat_id,
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone;

-- Правила маршрутизации: АБС → менеджер #2, всё остальное → менеджер #1
INSERT INTO public.routing_rules (category_id, manager_id, priority, is_active)
VALUES 
  ('abs', 2, 10, true),          -- АБС → Менеджер #2
  (null, 1, 100, true)           -- По умолчанию → Главный менеджер
ON CONFLICT DO NOTHING;

-- Готово! Заказы распределяются по менеджерам:
-- - АБС-пластики → Менеджер #2 (994095389)
-- - Всё остальное → Главный менеджер (8273490886)

