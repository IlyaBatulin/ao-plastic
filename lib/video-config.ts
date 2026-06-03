// Дефолтное видео для hero категории (если у категории нет своего)
export const DEFAULT_CATEGORY_VIDEO = '/videos/xoztov.mp4'

// Конфигурация видео для категорий и подкатегорий
export const videoConfig: Record<string, string> = {
  // Категория: Стирол — тот же фон, что у «КОРС и Бентол»
  styrene: "/videos/bentolmain.mp4",

  // Категория: Полистирол
  'polystyrene': '/videos/polystyrene-category.mp4',
  
  // Подкатегории Полистирола
  'polystyrene/ps-psv-s': '/videos/polystyrene-psv-s.mp4',
  'polystyrene/ps-psv-l': '/videos/polystyrene-psv-l.mp4',
  'polystyrene/ps-pse-1': '/videos/polystyrene-pse-1.mp4',
  
  // Категория: АБС-пластики
  'abs': '/videos/abs-category.mp4',
  
  // Подкатегории АБС
  'abs/abs-injection': '/videos/abs-injection.mp4',
  'abs/abs-extrusion': '/videos/abs-extrusion.mp4',
  'abs/abs-custom': '/videos/abs-custom.mp4',

  // Категория: Хозяйственные товары
  'hoztovary': '/videos/xoztov.mp4',

  // ДМС и экструзионные изделия — фон с промышленными пластиковыми трубками
  "machine-parts": "/videos/plastic-tubes-in-industrial.mp4",
  // Экструзионные изделия (синие трубки / профили)
  "machine-parts/parts-extrusion": "/videos/plastic-tubes-in-industrial.mp4",
  "machine-parts/extrusion": "/videos/plastic-tubes-in-industrial.mp4",
  "machine-parts/extrusion-parts": "/videos/plastic-tubes-in-industrial.mp4",
  // КОРС и Бентол — отдельный ролик
  kors: "/videos/bentolmain.mp4",
  "custom-abs": "/videos/mainlogo.mp4",
}

// Вспомогательная функция для получения видео по категории и подкатегории
export function getCategoryVideo(categoryId: string, subcategoryId?: string): string | undefined {
  if (!subcategoryId) {
    return videoConfig[categoryId]
  }
  
  // Пробуем разные варианты ключа
  const key1 = `${categoryId}/${subcategoryId}`
  
  // Для полистирола пробуем с префиксом ps- (если slug без префикса)
  const key2 = subcategoryId.startsWith('ps-') ? key1 : `${categoryId}/ps-${subcategoryId}`
  
  // Для АБС slug уже содержит префикс abs-, поэтому просто используем key1
  // Но на всякий случай пробуем и без префикса
  const key3 = subcategoryId.startsWith('abs-') ? key1 : `${categoryId}/abs-${subcategoryId}`
  
  const specific = videoConfig[key1] || videoConfig[key2] || videoConfig[key3]
  if (specific) return specific
  // Подкатегория без своего ролика — фон как у категории (ДМС и др.)
  return videoConfig[categoryId]
}

