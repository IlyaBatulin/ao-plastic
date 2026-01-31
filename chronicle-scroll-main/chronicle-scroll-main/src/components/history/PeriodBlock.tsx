import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { HistoryPeriod } from "@/data/historyPeriods";
import Timeline from "./Timeline";

interface PeriodBlockProps {
  period: HistoryPeriod;
  image: string;
}

const PeriodBlock = ({ period, image }: PeriodBlockProps) => {
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
    ["100%", "100%", "45%", "45%", "45%"]
  );
  
  const imageHeight = useTransform(
    scrollYProgress, 
    [0, 0.15, 0.4, 0.85, 1], 
    ["100%", "100%", "50%", "50%", "50%"]
  );

  // Image position (top-left corner when shrunk)
  const imageTop = useTransform(
    scrollYProgress,
    [0, 0.15, 0.4, 0.85, 1],
    ["0%", "0%", "8%", "8%", "8%"]
  );

  const imageLeft = useTransform(
    scrollYProgress,
    [0, 0.15, 0.4, 0.85, 1],
    ["0%", "0%", "5%", "5%", "5%"]
  );

  const imageBorderRadius = useTransform(
    scrollYProgress,
    [0, 0.15, 0.4],
    [0, 0, 16]
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

  // Timeline visibility - appears on the right side
  const timelineOpacity = useTransform(
    scrollYProgress, 
    [0.35, 0.5], 
    [0, 1]
  );
  
  const timelineX = useTransform(
    scrollYProgress, 
    [0.35, 0.5], 
    [80, 0]
  );

  // Check if timeline should animate its items
  const progress = scrollYProgress.get();
  const isTimelineVisible = progress > 0.4;

  return (
    <div 
      ref={containerRef} 
      className="relative"
      style={{ height: "250vh" }}
    >
      {/* Sticky container - holds everything in place */}
      <div className="sticky top-0 h-screen overflow-hidden bg-background">
        
        {/* Image container - animates size and position */}
        <motion.div
          className="absolute overflow-hidden"
          style={{
            width: imageWidth,
            height: imageHeight,
            top: imageTop,
            left: imageLeft,
            borderRadius: imageBorderRadius,
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
          className="absolute left-[5%] z-10"
          style={{ 
            opacity: periodLabelOpacity,
            top: "calc(8% + 52vh)",
          }}
        >
          <span className="text-primary text-sm md:text-base font-medium tracking-widest uppercase">
            {period.title}
          </span>
          <h3 className="text-xl md:text-2xl font-semibold text-foreground mt-1 max-w-[40%]">
            {period.subtitle}
          </h3>
        </motion.div>

        {/* Timeline - appears on right side, vertically centered */}
        <motion.div
          className="absolute right-[5%] md:right-[8%] lg:right-[10%] top-1/2 -translate-y-1/2 max-w-lg w-[45%]"
          style={{ 
            opacity: timelineOpacity,
            x: timelineX 
          }}
        >
          <Timeline 
            events={period.timeline} 
            isVisible={isTimelineVisible}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default PeriodBlock;
