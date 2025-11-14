import { createClient as createSupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export function createClient() {
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
	
	return createSupabaseClient(supabaseUrl, serviceKey)
}


