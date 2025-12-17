"use client"

import { createBrowserClient } from "@supabase/ssr"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export function createClient() {
	if (!supabaseUrl || !supabaseKey) {
		console.warn('[Supabase] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY not set. Please configure .env.local file.')
		// Возвращаем клиент с пустыми значениями для разработки
		return createBrowserClient(
			supabaseUrl || "https://placeholder.supabase.co",
			supabaseKey || "placeholder-key"
		)
	}
	return createBrowserClient(supabaseUrl, supabaseKey)
}


