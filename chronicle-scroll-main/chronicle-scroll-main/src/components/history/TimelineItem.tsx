import { forwardRef } from "react";
import { motion } from "framer-motion";
import type { TimelineEvent } from "@/data/historyPeriods";

interface TimelineItemProps {
  event: TimelineEvent;
  index: number;
  isVisible: boolean;
}

const TimelineItem = forwardRef<HTMLDivElement, TimelineItemProps>(
  ({ event, index, isVisible }, ref) => {
    return (
      <motion.div
        ref={ref}
        className="relative flex gap-4 md:gap-6"
        initial={{ opacity: 0, x: 40 }}
        animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
        transition={{ 
          duration: 0.5, 
          delay: index * 0.08,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      >
        {/* Timeline dot and line */}
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="timeline-dot w-2.5 h-2.5 md:w-3 md:h-3 rounded-full" />
          <div className="timeline-line w-px flex-1 min-h-[40px] md:min-h-[50px]" />
        </div>
        
        {/* Content */}
        <div className="pb-6 md:pb-8 flex-1 min-w-0">
          <span className="timeline-year block mb-1 text-xl md:text-2xl">{event.year}</span>
          <p className="timeline-description text-sm md:text-base leading-relaxed">{event.description}</p>
        </div>
      </motion.div>
    );
  }
);

TimelineItem.displayName = "TimelineItem";

export default TimelineItem;
