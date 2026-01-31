import { forwardRef } from "react";
import { motion } from "framer-motion";
import type { TimelineEvent } from "@/data/historyPeriods22";

interface TimelineItemProps {
  event: TimelineEvent;
  index: number;
  isVisible: boolean;
}

const TimelineItem22 = forwardRef<HTMLDivElement, TimelineItemProps>(
  ({ event, index, isVisible }, ref) => {
    return (
      <motion.div
        ref={ref}
        className="relative flex gap-3 md:gap-4"
        initial={{ opacity: 0, x: 40 }}
        animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
        transition={{ 
          duration: 0.6, 
          delay: index * 0.1,
          ease: [0.25, 0.1, 0.25, 1]
        }}
      >
        {/* Timeline dot and line */}
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="timeline-dot w-2 h-2 md:w-2.5 md:h-2.5 rounded-full" />
          <div className="timeline-line w-px flex-1 min-h-[25px] md:min-h-[30px]" />
        </div>
        
        {/* Content */}
        <div className="pb-2.5 md:pb-3 flex-1 min-w-0">
          <span className="timeline-year block mb-0.5 text-lg md:text-xl lg:text-2xl font-bold text-primary">{event.year}</span>
          <p className="timeline-description text-[11px] md:text-xs lg:text-sm leading-snug text-foreground/80">{event.description}</p>
        </div>
      </motion.div>
    );
  }
);

TimelineItem22.displayName = "TimelineItem22";

export default TimelineItem22;
