/**
 * Скрипт для тестирования отправки сообщений через Telegram бота
 * Использование: npm run test-tg
 */

const dotenv = require('dotenv')
const path = require('path')

// Загружаем переменные окружения
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const TG_BOT_TOKEN = process.env.TG_BOT_TOKEN
const TG_DEFAULT_CHAT_ID = process.env.TG_DEFAULT_CHAT_ID

if (!TG_BOT_TOKEN) {
  console.error('❌ Ошибка: TG_BOT_TOKEN не найден в .env.local')
  process.exit(1)
}

if (!TG_DEFAULT_CHAT_ID) {
  console.error('❌ Ошибка: TG_DEFAULT_CHAT_ID не найден в .env.local')
  process.exit(1)
}

console.log('🤖 Тестирование отправки сообщения...')
console.log(`Токен: ${TG_BOT_TOKEN.substring(0, 10)}...`)
console.log(`Chat ID: ${TG_DEFAULT_CHAT_ID}\n`)

async function sendTestMessage() {
  try {
    const testMessage = `🧪 *Тестовое сообщение*

Это проверка работы Telegram бота для уведомлений о заказах.

✅ Если вы получили это сообщение, интеграция работает корректно!`
    
    const response = await fetch(
      `https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TG_DEFAULT_CHAT_ID,
          text: testMessage,
          parse_mode: 'Markdown',
        }),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      console.error('❌ Ошибка отправки:', error.description)
      if (error.error_code === 400) {
        console.error('\n💡 Возможно, Chat ID неверный или бот не был запущен.')
        console.error('Отправьте любое сообщение боту в Telegram и попробуйте снова.')
      }
      process.exit(1)
    }

    const data = await response.json()
    if (data.ok) {
      console.log('✅ Сообщение успешно отправлено!')
      console.log('Проверьте Telegram для подтверждения.')
    } else {
      console.error('❌ Ошибка:', data)
      process.exit(1)
    }
  } catch (error) {
    console.error('❌ Ошибка при отправке:', error)
    process.exit(1)
  }
}

sendTestMessage()

