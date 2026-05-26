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
        className="relative flex gap-2.5 sm:gap-3"
        initial={{ opacity: 0, x: 40 }}
        animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
        transition={{
          duration: 0.6,
          delay: index * 0.1,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      >
        <div className="flex flex-col items-center flex-shrink-0 pt-1">
          <div className="timeline-dot w-2 h-2 md:w-2.5 md:h-2.5 rounded-full" />
          <div className="timeline-line w-px flex-1 min-h-[26px] md:min-h-[34px]" />
        </div>

        <div className="pb-2.5 md:pb-3 flex-1 min-w-0">
          <div className="rounded-lg border border-border/50 bg-card/80 px-3 py-3 sm:px-4 sm:py-3.5 md:px-5 md:py-4">
            <span className="timeline-year block mb-1 text-base sm:text-lg md:text-xl font-bold">
              {event.year}
            </span>
            <p className="timeline-description text-xs sm:text-sm md:text-base leading-relaxed">
              {event.description}
            </p>
          </div>
        </div>
      </motion.div>
    );
  }
);

TimelineItem22.displayName = "TimelineItem22";

export default TimelineItem22;
