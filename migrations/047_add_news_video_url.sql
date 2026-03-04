-- Добавление поля для превью видео в новостях

alter table public.news add column if not exists video_url text;

comment on column public.news.video_url is 'URL видео для превью (YouTube, Vimeo и т.д.)';
