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
