"use client"

import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Singleton для кэширования клиента
let clientInstance: SupabaseClient | null = null

export function createClient() {
	// Возвращаем кэшированный клиент, если он уже создан
	if (clientInstance) {
		return clientInstance
	}

	if (!supabaseUrl || !supabaseKey) {
		console.warn('[Supabase] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY not set. Please configure .env.local file.')
		// Создаем клиент с пустыми значениями для разработки
		clientInstance = createBrowserClient(
			supabaseUrl || "https://placeholder.supabase.co",
			supabaseKey || "placeholder-key"
		)
		return clientInstance
	}

	// Создаем и кэшируем клиент
	clientInstance = createBrowserClient(supabaseUrl, supabaseKey)
	return clientInstance
}


