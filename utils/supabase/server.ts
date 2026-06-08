import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { SupabaseClient } from "@supabase/supabase-js"

/**
 * Выполняет функцию с автоматическим повтором при сетевых ошибках
 * @param fn - функция для выполнения
 * @param maxRetries - максимальное количество попыток (по умолчанию 3)
 * @param retryDelay - задержка между попытками в мс (по умолчанию 1000)
 */
const SUPABASE_QUERY_TIMEOUT_MS = 8_000

function isNetworkError(error: unknown): boolean {
	if (!error || typeof error !== "object") return false
	const err = error as { code?: string; message?: string; cause?: { code?: string } }
	return (
		err.code === "ECONNRESET" ||
		err.code === "ETIMEDOUT" ||
		err.code === "ENOTFOUND" ||
		err.cause?.code === "ECONNRESET" ||
		err.cause?.code === "ETIMEDOUT" ||
		(err.message?.includes("terminated") ?? false) ||
		(err.message?.includes("fetch failed") ?? false) ||
		(err.message?.includes("Timeout") ?? false)
	)
}

export async function withTimeout<T>(
	promise: Promise<T>,
	ms: number,
	label: string
): Promise<T> {
	let timeoutId: ReturnType<typeof setTimeout> | undefined
	try {
		return await Promise.race([
			promise,
			new Promise<T>((_, reject) => {
				timeoutId = setTimeout(
					() => reject(new Error(`[Supabase Timeout] ${label} after ${ms}ms`)),
					ms
				)
			}),
		])
	} finally {
		if (timeoutId) clearTimeout(timeoutId)
	}
}

export async function withRetry<T>(
	fn: () => Promise<T>,
	maxRetries: number = 3,
	retryDelay: number = 1000
): Promise<T> {
	let lastError: Error | null = null
	
	for (let attempt = 0; attempt < maxRetries; attempt++) {
		try {
			return await fn()
		} catch (error: unknown) {
			lastError = error instanceof Error ? error : new Error(String(error))
			
			if (attempt === maxRetries - 1 || !isNetworkError(error)) {
				throw error
			}
			
			console.warn(
				`[Supabase Retry] Attempt ${attempt + 1}/${maxRetries} failed, retrying in ${retryDelay}ms...`,
				lastError.message
			)
			
			await new Promise((resolve) => setTimeout(resolve, retryDelay * (attempt + 1)))
		}
	}
	
	throw lastError
}

/** Запрос к Supabase с таймаутом и повтором при сетевых сбоях. */
export async function supabaseQuery<T>(
	label: string,
	fn: () => Promise<T>
): Promise<T> {
	return withRetry(
		() => withTimeout(fn(), SUPABASE_QUERY_TIMEOUT_MS, label),
		2,
		400
	)
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


