"use client"

import { useLanguage } from "@/contexts/language-context"

export function VideoShowcase() {
  const { t } = useLanguage()
  // ID из ссылки: https://m.vkvideo.ru/video-212692272_456239018
  // owner_id: 212692272, video_id: 456239018
  // Для групп VK используем отрицательный oid
  const ownerId = -212692272
  const videoId = 456239018

  return (
    <section id="video" className="py-24 lg:py-32 bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              {t("homePage.video.title")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("homePage.video.description")}
            </p>
          </div>

          {/* VK Video Embed with beautiful blue frame */}
          <div className="relative w-full aspect-video rounded-3xl overflow-visible border-4 border-blue-200/60 bg-gradient-to-br from-blue-50/30 via-white/20 to-blue-100/30 p-2 shadow-[0_0_40px_rgba(59,130,246,0.5),0_0_80px_rgba(59,130,246,0.3),0_0_120px_rgba(59,130,246,0.2)]">
            <div className="absolute inset-0 rounded-2xl overflow-hidden border-2 border-blue-300/40 shadow-inner">
              <iframe
                src={`https://vk.com/video_ext.php?oid=${ownerId}&id=${videoId}`}
                width="100%"
                height="100%"
                frameBorder="0"
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full rounded-2xl"
                title={t("homePage.video.title")}
              />
            </div>
            {/* Декоративные уголки */}
            <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-blue-300/60 rounded-tl-3xl" />
            <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-blue-300/60 rounded-tr-3xl" />
            <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-blue-300/60 rounded-bl-3xl" />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-blue-300/60 rounded-br-3xl" />
          </div>
        </div>
      </div>
    </section>
  )
}

