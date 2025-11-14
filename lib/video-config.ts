// Конфигурация видео для категорий и подкатегорий
export const videoConfig: Record<string, string> = {
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
  
  return videoConfig[key1] || videoConfig[key2] || videoConfig[key3]
}

