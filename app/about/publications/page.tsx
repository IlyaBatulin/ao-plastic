import { Footer } from "@/components/footer"
import { FileText, ExternalLink } from "lucide-react"
import { publications } from "@/data/publications"
import { BackgroundPaths } from "@/components/ui/background-paths"

export default function PublicationsPage() {
  return (
    <>
      <BackgroundPaths />
      <div className="min-h-screen bg-transparent">
        <section className="pt-32 pb-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              {/* Выделенный заголовок */}
              <div className="mb-16 text-center">
                <h1 className="text-6xl md:text-7xl font-bold mb-6 text-[#1e3a8a] dark:text-[#3b82f6] animate-in fade-in slide-in-from-bottom-4 duration-700">
                  Публикации
                </h1>
                <p className="text-xl md:text-2xl text-foreground/70 leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200">
                  Новости и статьи о деятельности «Пластика»
                </p>
                <div className="mt-6 h-0.5 w-24 mx-auto bg-[#1e3a8a] dark:bg-[#3b82f6] animate-in fade-in duration-700 delay-300" />
              </div>

              <div className="space-y-8">
                {publications.map((pub, index) => (
                  <div
                    key={index}
                    className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-semibold mb-1">{pub.title}</h3>
                        {pub.subtitle && (
                          <p className="text-muted-foreground text-sm mb-3">{pub.subtitle}</p>
                        )}
                        <div className="flex flex-wrap gap-2 mt-3">
                          {pub.links.map((link, linkIndex) => (
                            <a
                              key={linkIndex}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-sm text-foreground transition-colors"
                            >
                              {link.label}
                              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
}
