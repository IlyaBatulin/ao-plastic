"use client"

import { Factory, FlaskConical, Leaf, Award, Truck, HeadphonesIcon } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function About() {
  const { t } = useLanguage()

  const features = [
    {
      icon: Award,
      key: "feature1",
    },
    {
      icon: FlaskConical,
      key: "feature2",
    },
    {
      icon: Factory,
      key: "feature3",
    },
    {
      icon: HeadphonesIcon,
      key: "feature4",
    },
    {
      icon: Truck,
      key: "feature5",
    },
    {
      icon: Leaf,
      key: "feature6",
    },
  ]
  return (
    <section id="about" className="py-24 lg:py-32 bg-gradient-to-b from-secondary via-primary/5 to-secondary">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-8 text-balance">{t("homePage.about.title")}</h2>
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p dangerouslySetInnerHTML={{ __html: t("homePage.about.paragraph1") }} />
            <p dangerouslySetInnerHTML={{ __html: t("homePage.about.paragraph2") }} />
            <p dangerouslySetInnerHTML={{ __html: t("homePage.about.paragraph3") }} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mt-16 lg:mt-24">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-background rounded-2xl p-8 border-2 border-primary/10 hover:border-primary/30 shadow-blue-sm hover:shadow-blue-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <feature.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                {t(`homePage.about.${feature.key}.title`)}
              </h3>
              <p className="text-muted-foreground leading-relaxed">{t(`homePage.about.${feature.key}.description`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
