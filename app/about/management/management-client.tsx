"use client"

import { useState } from "react"
import type { ManagementTeamMemberPublic } from "@/types/database"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ManagementClientProps {
  members: ManagementTeamMemberPublic[]
}

export function ManagementClient({ members }: ManagementClientProps) {
  const [selectedMember, setSelectedMember] = useState<ManagementTeamMemberPublic | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleCardClick = (member: ManagementTeamMemberPublic) => {
    setSelectedMember(member)
    setIsDialogOpen(true)
  }

  // Генерируем инициалы для placeholder
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n.charAt(0))
      .join("")
      .substring(0, 2)
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto px-4">
        {members.map((member, index) => (
          <div
            key={member.id}
            className="group relative flex flex-col bg-gradient-to-br from-primary/10 to-[#0f172a]/5 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-primary/20 hover:border-[#60a5fa]/50"
            style={{
              animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
            }}
          >
            {/* Фото */}
            <div className="relative h-96 overflow-hidden flex-shrink-0">
              <img
                src={member.image_url || `/placeholder.svg?height=400&width=400&text=${getInitials(member.full_name)}`}
                alt={member.full_name}
                className={`w-full h-full object-cover ${index === 9 ? 'object-center' : 'object-top'} group-hover:scale-110 transition-transform duration-700`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/90 via-[#0f172a]/40 to-transparent" />
            </div>

            {/* Информация под фото */}
            <div className="flex flex-col p-8 bg-gradient-to-br from-primary/5 to-transparent flex-grow">
              <div className="flex-grow mb-4">
                <h3 className="text-2xl font-bold mb-3 text-primary dark:text-white group-hover:text-[#2563eb] dark:group-hover:text-[#60a5fa] transition-colors">
                  {member.full_name}
                </h3>
                <p className="text-base text-foreground/70 dark:text-[#93c5fd] line-clamp-2 font-medium">
                  {member.position}
                </p>
              </div>

              <Button
                onClick={() => handleCardClick(member)}
                className="w-full bg-gradient-to-r from-primary to-[#1e40af] hover:from-[#1e40af] hover:to-[#1d4ed8] text-white font-bold py-7 rounded-2xl transition-all shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-[#60a5fa]/40"
                size="lg"
              >
                Биография
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Модальное окно - на весь экран */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="!max-w-none !max-h-none w-screen h-screen p-0 gap-0 rounded-none bg-gradient-to-br from-white/95 to-white/90 dark:from-slate-900/95 dark:to-slate-800/90">
          {selectedMember && (
            <>
              <div className="flex flex-col md:flex-row h-full w-full">
                  {/* Левая часть - Фото (30%) */}
                  <div className="md:w-[30%] bg-gradient-to-br from-primary to-[#0f172a] p-6 md:p-8 flex flex-col items-center justify-center">
                    {selectedMember.image_url && (
                      <div className="mb-6">
                        <img
                          src={selectedMember.image_url}
                          alt={selectedMember.full_name}
                          className="w-72 h-72 md:w-96 md:h-96 rounded-3xl object-cover border-8 border-white/20 shadow-2xl"
                        />
                      </div>
                    )}
                    <div className="text-center space-y-3">
                      <DialogTitle className="text-2xl md:text-3xl font-bold text-white leading-tight">
                        {selectedMember.full_name}
                      </DialogTitle>
                      <DialogDescription className="text-lg md:text-xl text-[#93c5fd] font-semibold">
                        {selectedMember.position}
                      </DialogDescription>
                    </div>
                  </div>

                  {/* Правая часть - Биография (70%) */}
                  <ScrollArea className="md:w-[70%] h-full">
                    <div className="p-4 md:p-6 space-y-6">
                      {selectedMember.bio && (
                        <div>
                          <h4 className="text-3xl font-bold mb-6 text-primary dark:text-[#60a5fa] border-b-4 border-primary/20 pb-4">
                            Биография
                          </h4>
                          <div className="prose prose-lg max-w-none">
                            <p className="text-foreground/90 leading-relaxed whitespace-pre-line text-base md:text-lg">
                              {selectedMember.bio}
                            </p>
                          </div>
                        </div>
                      )}

                      {(selectedMember.email || selectedMember.phone) && (
                        <div className="mt-8 pt-6 border-t-2 border-primary/20">
                          <h4 className="text-2xl font-bold mb-4 text-primary dark:text-[#60a5fa]">
                            Контактная информация
                          </h4>
                          <div className="space-y-3">
                            {selectedMember.email && (
                              <div className="flex items-center gap-3 text-base md:text-lg">
                                <span className="font-semibold min-w-[100px] text-primary dark:text-[#60a5fa]">Email:</span>
                                <a
                                  href={`mailto:${selectedMember.email}`}
                                  className="text-[#2563eb] hover:underline"
                                >
                                  {selectedMember.email}
                                </a>
                              </div>
                            )}
                            {selectedMember.phone && (
                              <div className="flex items-center gap-3 text-base md:text-lg">
                                <span className="font-semibold min-w-[100px] text-primary dark:text-[#60a5fa]">Телефон:</span>
                                <a
                                  href={`tel:${selectedMember.phone}`}
                                  className="text-[#2563eb] hover:underline"
                                >
                                  {selectedMember.phone}
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  )
}
