import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { HistoryPeriod } from "@/data/historyPeriods22";
import Timeline22 from "./Timeline22";

interface PeriodBlockProps {
  period: HistoryPeriod;
  image: string;
}

const PeriodBlock22 = ({ period, image }: PeriodBlockProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Phase 1 (0-0.15): Image fullscreen, static
  // Phase 2 (0.15-0.4): Image shrinks to top-left corner
  // Phase 3 (0.4-0.85): Image stays in corner, timeline visible
  // Phase 4 (0.85-1.0): Everything scrolls away

  // Image container size (percentage of viewport)
  const imageWidth = useTransform(
    scrollYProgress, 
    [0, 0.15, 0.4, 0.85, 1], 
    ["100%", "100%", "38%", "38%", "38%"]
  );
  
  const imageHeight = useTransform(
    scrollYProgress, 
    [0, 0.15, 0.4, 0.85, 1], 
    ["100%", "100%", "44%", "44%", "44%"]
  );

  // Image position (top-left corner when shrunk)
  const imageTop = useTransform(
    scrollYProgress,
    [0, 0.15, 0.4, 0.85, 1],
	["0%", "0%", "10%", "10%", "10%"]
  );

  const imageLeft = useTransform(
    scrollYProgress,
    [0, 0.15, 0.4, 0.85, 1],
    ["0%", "0%", "4%", "4%", "4%"]
  );

  const imageBorderRadius = useTransform(
    scrollYProgress,
    [0, 0.15, 0.4],
    [0, 0, 16]
  );

  const imageBorderWidth = useTransform(
    scrollYProgress,
    [0, 0.15, 0.4],
    [0, 0, 2]
  );

  // Title overlay transforms (visible when fullscreen)
  const titleOpacity = useTransform(
    scrollYProgress, 
    [0, 0.1, 0.2], 
    [1, 1, 0]
  );

  // Period label (shown when image is shrunk) - positioned below the image
  const periodLabelOpacity = useTransform(
    scrollYProgress,
    [0.3, 0.45],
    [0, 1]
  );

  // Timeline visibility - appears from BOTTOM after image shrinks, then HOLDS
  const timelineOpacity = useTransform(
    scrollYProgress, 
    [0.4, 0.55, 0.8, 0.85], 
    [0, 1, 1, 0]
  );
  
  // Не уводим в минус по Y — иначе верхние годы вылезают за вьюпорт/обрезаются
  const timelineY = useTransform(
    scrollYProgress, 
    [0.4, 0.55, 0.8, 0.85], 
    [200, 0, 0, 0]
  );

  return (
    <>
    <section className="md:hidden border-t border-border/60 bg-background px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg">
          <img
            src={image}
            alt={period.title}
            className="h-full w-full object-cover image-industrial"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/10 to-transparent" />
        </div>

        <div className="mt-7">
          <span className="text-caption text-primary">
            {period.title}
          </span>
          <h2 className="mt-2 text-2xl font-semibold leading-tight text-foreground">
            {period.subtitle}
          </h2>
        </div>

        <div className="mt-7">
          <Timeline22 events={period.timeline} isVisible={true} />
        </div>
      </div>
    </section>

    <div 
      ref={containerRef} 
      className="relative hidden md:block"
      style={{ height: "280vh" }}
    >
      {/* Sticky container - holds everything in place */}
      <div className="sticky top-0 h-screen overflow-hidden bg-background">
        
        {/* Image container - animates size and position */}
        <motion.div
          className="absolute overflow-hidden shadow-2xl rounded-2xl"
          style={{
            width: imageWidth,
            height: imageHeight,
            top: imageTop,
            left: imageLeft,
            borderRadius: imageBorderRadius,
            borderWidth: imageBorderWidth,
            borderColor: "rgba(15, 23, 42, 0.12)",
            boxSizing: "border-box",
          }}
        >
          <img
            src={image}
            alt={period.title}
            className="w-full h-full object-cover image-industrial"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />

          {/* Title overlay on fullscreen image */}
          <motion.div 
            className="absolute inset-0 flex flex-col items-center justify-center px-6"
            style={{ opacity: titleOpacity }}
          >
            <span className="text-primary text-lg md:text-xl font-medium tracking-widest uppercase mb-4">
              {period.title}
            </span>
            <h2 className="text-period-title text-center mb-4">{period.subtitle}</h2>
          </motion.div>
        </motion.div>

        {/* Period label when image is shrunk - positioned to the left */}
        <motion.div
          className="absolute left-[4%] z-10"
          style={{ 
            opacity: periodLabelOpacity,
            top: "calc(6% + 50vh)",
          }}
        >
          <span className="text-caption text-primary">
            {period.title}
          </span>
          <h3 className="text-xl md:text-2xl font-semibold text-foreground mt-1 max-w-[38vw]">
            {period.subtitle}
          </h3>
        </motion.div>

        {/* Right side — timeline only */}
        <div className="absolute right-[5%] md:right-[7%] top-[12%] bottom-[4%] w-[40%]">
          <motion.div
            className="h-full overflow-y-auto overflow-x-hidden pr-1 pt-1 pb-1 scroll-pt-2 no-scrollbar"
            style={{ 
              opacity: timelineOpacity,
              y: timelineY 
            }}
          >
            <Timeline22 
              events={period.timeline} 
              isVisible={true}
            />
          </motion.div>
        </div>
      </div>
    </div>
    </>
  );
};

export default PeriodBlock22;
