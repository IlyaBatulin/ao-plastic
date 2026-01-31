import { Footer } from "@/components/footer"
import { createClient } from "@/utils/supabase/server"
import type { ManagementTeamMemberPublic } from "@/types/database"
import { ManagementClient } from "./management-client"
import { BackgroundPaths } from "@/components/ui/background-paths"

async function getManagementTeam(): Promise<ManagementTeamMemberPublic[]> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from("management_team")
      .select("id, full_name, position, bio, email, phone, image_url, sort_order")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
    
    if (error) {
      console.error("Ошибка при получении руководства:", error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.error("Ошибка при подключении к базе данных:", error)
    return []
  }
}

export default async function ManagementPage() {
  const members = await getManagementTeam()

  return (
    <>
      <BackgroundPaths />
      
      <div className="min-h-screen bg-transparent">
        <section className="pt-32 pb-24">
          <div className="container mx-auto px-4 lg:px-8">
            {/* Заголовок в стиле вакансий */}
            <div className="mb-16 text-center">
              <h1 className="text-6xl md:text-7xl font-bold mb-6 text-[#1e3a8a] dark:text-[#3b82f6] animate-in fade-in slide-in-from-bottom-4 duration-700">
                Руководство
              </h1>
              <p className="text-xl md:text-2xl text-foreground/70 leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200">
                Наша команда профессионалов с многолетним опытом в индустрии пластиковых материалов
              </p>
              <div className="mt-6 h-0.5 w-24 mx-auto bg-[#1e3a8a] dark:bg-[#3b82f6] animate-in fade-in duration-700 delay-300" />
            </div>

            {members.length > 0 ? (
              <ManagementClient members={members} />
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Информация о руководстве временно недоступна
                </p>
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
}
