import { createClient as createSupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export function createClient() {
	if (!supabaseUrl || !supabaseKey) {
		console.warn('[Supabase] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY not set. Please configure .env.local file.')
		// Возвращаем клиент с пустыми значениями для разработки
		// В продакшене это должно быть настроено
		return createSupabaseClient(
			supabaseUrl || "https://placeholder.supabase.co",
			supabaseKey || "placeholder-key"
		)
	}
	return createSupabaseClient(supabaseUrl, supabaseKey)
}

/**
 * Создает клиент Supabase с service role key для серверных операций
 * ОБХОДИТ ВСЕ RLS ПОЛИТИКИ - использовать ТОЛЬКО в API routes!
 * 
 * Требует переменную окружения: SUPABASE_SERVICE_ROLE_KEY
 */
export function createServiceClient() {
	const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
	
	if (!serviceKey) {
		console.warn('[Supabase] SUPABASE_SERVICE_ROLE_KEY not set, falling back to anon key')
		return createClient()
	}
	
	if (!supabaseUrl) {
		console.warn('[Supabase] NEXT_PUBLIC_SUPABASE_URL not set')
		return createClient()
	}
	
	return createSupabaseClient(supabaseUrl, serviceKey)
}


