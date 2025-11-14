/**
 * Скрипт для получения Chat ID в Telegram
 * Использование:
 * 1. Добавьте TG_BOT_TOKEN в .env.local
 * 2. Запустите: npm run get-chat-id
 * 3. Отправьте любое сообщение боту в Telegram
 * 4. Нажмите Enter в терминале
 */

const dotenv = require('dotenv')
const path = require('path')

// Загружаем переменные окружения
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const TG_BOT_TOKEN = process.env.TG_BOT_TOKEN

if (!TG_BOT_TOKEN) {
  console.error('❌ Ошибка: TG_BOT_TOKEN не найден в .env.local')
  console.log('\n📝 Добавьте в .env.local:')
  console.log('TG_BOT_TOKEN=ваш_токен_бота')
  process.exit(1)
}

console.log('🤖 Проверка настроек бота...')
console.log(`Токен: ${TG_BOT_TOKEN.substring(0, 10)}...`)

async function getUpdates() {
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TG_BOT_TOKEN}/getUpdates`
    )

    if (!response.ok) {
      const error = await response.json()
      console.error('❌ Ошибка от Telegram API:', error.description)
      if (error.error_code === 401) {
        console.error('\n💡 Возможно, токен неверный. Проверьте TG_BOT_TOKEN в .env.local')
      }
      process.exit(1)
    }

    const data = await response.json()
    
    if (!data.ok) {
      console.error('❌ Telegram вернул ошибку:', data)
      process.exit(1)
    }

    const updates = data.result || []
    
    if (updates.length === 0) {
      console.log('\n⏳ Сообщений пока нет.')
      console.log('\n📱 Инструкция:')
      console.log('1. Найдите своего бота в Telegram')
      console.log('2. Отправьте ему любое сообщение (например, /start)')
      console.log('3. Нажмите Enter здесь, чтобы проверить снова')
      
      // Ждем Enter
      process.stdin.resume()
      process.stdin.once('data', getUpdates)
      return
    }

    console.log('\n✅ Найдены чаты:\n')
    
    const uniqueChats = new Map()
    
    updates.forEach((update) => {
      const chat = update.message?.chat || update.callback_query?.message?.chat
      if (chat && !uniqueChats.has(chat.id)) {
        uniqueChats.set(chat.id, chat)
      }
    })

    for (const [chatId, chat] of uniqueChats) {
      const chatType = chat.type === 'private' ? '👤 Личный' : '👥 Группа'
      const chatName = chat.first_name || chat.title || 'Без имени'
      
      console.log(`${chatType}: ${chatName}`)
      console.log(`   Chat ID: ${chatId}`)
      console.log(`   Username: @${chat.username || 'не указан'}`)
      console.log('')
    }

    if (uniqueChats.size === 1) {
      const [chatId] = uniqueChats.keys()
      console.log('✅ Добавьте в .env.local:')
      console.log(`TG_DEFAULT_CHAT_ID=${chatId}`)
    } else {
      console.log('⚠️  Найдено несколько чатов. Выберите нужный Chat ID.')
    }

    console.log('\n✅ Готово!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Ошибка при запросе к Telegram API:', error)
    process.exit(1)
  }
}

getUpdates()

