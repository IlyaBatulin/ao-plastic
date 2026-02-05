// Типы для таблиц базы данных

export interface ManagementTeamMember {
  id: string
  full_name: string
  position: string
  bio: string | null
  email: string | null
  phone: string | null
  image_url: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ManagementTeamMemberPublic {
  id: string
  full_name: string
  position: string
  bio: string | null
  email: string | null
  phone: string | null
  image_url: string | null
  sort_order: number
}

export type ExtrusionProductType =
  | 'Сепаратор'
  | 'Трубка'
  | 'Шланг'
  | 'Окантовка'
  | 'Профиль'
  | 'Втулка'
  | 'Прокладка'
  | 'Облицовка'
  | 'Накладка'
  | 'Молдинг'

export type LengthKind = 'coil' | 'fixed'

export interface ExtrusionProduct {
  id: number
  type: ExtrusionProductType
  subtype: string | null
  name: string
  size_raw: string | null
  size_a_mm: number | null
  size_b_mm: number | null
  size_note: string | null
  code: string
  length_raw: string
  length_kind: LengthKind
  length_mm: number | null
  length_tolerance_raw: string | null
  source_no: number | null
  is_active: boolean
  created_at: string
}
