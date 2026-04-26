import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { HistoryPeriod } from "@/data/historyPeriods22";
import Timeline22 from "./Timeline22";
import Infographic22 from "./Infographic22";

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
  // Phase 3 (0.4-0.85): Image stays in corner, timeline + infographic visible
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

  // Infographic visibility - appears from BOTTOM after timeline, then HOLDS
  const infographicOpacity = useTransform(
    scrollYProgress,
    [0.5, 0.65, 0.85, 0.9],
    [0, 1, 1, 0]
  );

  const infographicY = useTransform(
    scrollYProgress,
    [0.5, 0.65, 0.85, 0.9],
    [250, 0, 0, 0]
  );

  return (
    <div 
      ref={containerRef} 
      className="relative"
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
          <span className="text-primary text-sm md:text-base font-medium tracking-widest uppercase">
            {period.title}
          </span>
          <h3 className="text-xl md:text-2xl font-semibold text-foreground mt-1 max-w-[38vw]">
            {period.subtitle}
          </h3>
        </motion.div>

        {/* Right side content container */}
        <div className="absolute right-[5%] md:right-[7%] top-[12%] bottom-[4%] w-[40%] flex flex-col gap-4">
          {/* Timeline */}
          <motion.div
            className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-1 pt-1 pb-1 scroll-pt-2 no-scrollbar"
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

          {/* Infographic */}
          <motion.div
            className="flex-shrink-0"
            style={{
              opacity: infographicOpacity,
              y: infographicY
            }}
          >
            <Infographic22
              items={period.infographic}
              isVisible={true}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PeriodBlock22;
