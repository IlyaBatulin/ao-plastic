# Оптимизация Scroll-Driven Video

## Проблема LCP
LCP 3.12s из-за загрузки большого видео. Реализованы оптимизации:

- **Lazy Loading**: видео загружается только когда секция видна
- **Poster изображение**: показывается легкое изображение вместо видео
- **preload="none"**: не загружать видео до необходимости

## Использование

```tsx
<ScrollVideo
  src="/videos/factory-scroll.mp4"
  poster="/images/factory-poster.jpg" // ОБЯЗАТЕЛЬНО для LCP
  scrollHeight={3000}
  lazy={true}
/>
```

## Оптимизация видео

### Создать poster изображение:
```bash
ffmpeg -i factory-scroll.mp4 -ss 00:00:00 -vframes 1 factory-poster.jpg
```
- Формат: WebP или JPEG
- Размер: максимум 1920x1080px
- Вес: не более 200KB

### Сжать видео:
```bash
ffmpeg -i factory-scroll.mp4 \
  -c:v libx264 -preset slow -crf 23 \
  -c:a aac -b:a 128k \
  -movflags +faststart \
  -vf "scale=1920:1080" \
  factory-scroll-optimized.mp4
```

**Рекомендации:**
- Разрешение: максимум 1920x1080
- Размер файла: 5-10 MB
- Формат: H.264 (MP4)
- Длительность: 10-30 секунд

## Ожидаемый результат
LCP: с 3.12s до < 2.5s

