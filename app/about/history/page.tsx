"use client";

import { heroData, historyPeriods } from "@/data/historyPeriods22";
import HeroBlock22 from "@/components/history22/HeroBlock22";
import PeriodBlock22 from "@/components/history22/PeriodBlock22";

// Period images mapping
const periodImages: Record<string, string> = {
  "period-1": "/images/history/period-1959-1992.jpeg",
  "period-2": "/images/history/period-2001-2009.jpeg",
  "period-3": "/images/history/period-2010-2014.jpeg",
  "period-4": "/images/history/period-2019-present.jpeg",
};

const History22 = () => {
  // Lenis теперь работает глобально из app/layout.tsx

  return (
    <main className="bg-background min-h-screen">
      {/* Hero Section with scrolling text */}
      <HeroBlock22
        title={heroData.heroTitle}
        subtitle={heroData.heroSubTitle}
        textSlides={heroData.heroTextSlides}
      />

      {/* Period Blocks */}
      {historyPeriods.map((period) => (
        <PeriodBlock22
          key={period.id}
          period={period}
          image={periodImages[period.id]}
        />
      ))}

      {/* Footer section */}
      <footer className="bg-background py-24 md:py-32">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-6">
            Наша история продолжается
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Более 60 лет мы создаём инновационные решения для промышленности. 
            Впереди — новые горизонты и технологические прорывы.
          </p>
          <div className="mt-12 flex justify-center gap-4">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse" style={{ animationDelay: "0.2s" }} />
            <div className="w-2 h-2 rounded-full bg-primary/30 animate-pulse" style={{ animationDelay: "0.4s" }} />
          </div>
        </div>
      </footer>
    </main>
  );
};

export default History22;
