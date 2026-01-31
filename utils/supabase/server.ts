import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { SupabaseClient } from "@supabase/supabase-js"

/**
 * Выполняет функцию с автоматическим повтором при сетевых ошибках
 * @param fn - функция для выполнения
 * @param maxRetries - максимальное количество попыток (по умолчанию 3)
 * @param retryDelay - задержка между попытками в мс (по умолчанию 1000)
 */
export async function withRetry<T>(
	fn: () => Promise<T>,
	maxRetries: number = 3,
	retryDelay: number = 1000
): Promise<T> {
	let lastError: Error | null = null
	
	for (let attempt = 0; attempt < maxRetries; attempt++) {
		try {
			return await fn()
		} catch (error: any) {
			lastError = error
			
			// Проверяем, является ли это сетевой ошибкой
			const isNetworkError = 
				error?.code === 'ECONNRESET' ||
				error?.code === 'ETIMEDOUT' ||
				error?.code === 'ENOTFOUND' ||
				error?.message?.includes('terminated') ||
				error?.message?.includes('fetch failed')
			
			// Если это последняя попытка или не сетевая ошибка, пробрасываем ошибку
			if (attempt === maxRetries - 1 || !isNetworkError) {
				throw error
			}
			
			// Логируем попытку повтора
			console.warn(`[Supabase Retry] Attempt ${attempt + 1}/${maxRetries} failed, retrying in ${retryDelay}ms...`, error.message)
			
			// Ждем перед следующей попыткой (с экспоненциальной задержкой)
			await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)))
		}
	}
	
	throw lastError
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Singleton для кэширования обычного клиента
let clientInstance: SupabaseClient | null = null

// Singleton для кэширования service клиента
let serviceClientInstance: SupabaseClient | null = null

export function createClient() {
	// Возвращаем кэшированный клиент, если он уже создан
	if (clientInstance) {
		return clientInstance
	}

	if (!supabaseUrl || !supabaseKey) {
		console.warn('[Supabase] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY not set. Please configure .env.local file.')
		// Создаем клиент с пустыми значениями для разработки
		// В продакшене это должно быть настроено
		clientInstance = createSupabaseClient(
			supabaseUrl || "https://placeholder.supabase.co",
			supabaseKey || "placeholder-key"
		)
		return clientInstance
	}

	// Создаем и кэшируем клиент с настройками таймаутов и retry
	clientInstance = createSupabaseClient(supabaseUrl, supabaseKey, {
		db: {
			schema: 'public'
		},
		global: {
			headers: {
				'x-client-info': 'supabase-js-server'
			}
		},
		auth: {
			persistSession: false,
			autoRefreshToken: false
		}
	})
	return clientInstance
}

/**
 * Создает клиент Supabase с service role key для серверных операций
 * ОБХОДИТ ВСЕ RLS ПОЛИТИКИ - использовать ТОЛЬКО в API routes!
 * 
 * Требует переменную окружения: SUPABASE_SERVICE_ROLE_KEY
 */
export function createServiceClient() {
	// Возвращаем кэшированный service клиент, если он уже создан
	if (serviceClientInstance) {
		return serviceClientInstance
	}

	const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
	
	if (!serviceKey) {
		console.warn('[Supabase] SUPABASE_SERVICE_ROLE_KEY not set, falling back to anon key')
		return createClient()
	}
	
	if (!supabaseUrl) {
		console.warn('[Supabase] NEXT_PUBLIC_SUPABASE_URL not set')
		return createClient()
	}
	
	// Создаем и кэшируем service клиент с настройками таймаутов
	serviceClientInstance = createSupabaseClient(supabaseUrl, serviceKey, {
		db: {
			schema: 'public'
		},
		global: {
			headers: {
				'x-client-info': 'supabase-js-service'
			}
		},
		auth: {
			persistSession: false,
			autoRefreshToken: false
		}
	})
	return serviceClientInstance
}


