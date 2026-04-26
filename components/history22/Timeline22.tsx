import { forwardRef } from "react";
import type { TimelineEvent } from "@/data/historyPeriods22";
import TimelineItem22 from "./TimelineItem22";

interface TimelineProps {
  events: TimelineEvent[];
  isVisible: boolean;
}

const Timeline22 = forwardRef<HTMLDivElement, TimelineProps>(({ events, isVisible }, ref) => {
  return (
    <div ref={ref} className="relative pt-1 pb-3">
      {events.map((event, index) => (
        <TimelineItem22
          key={`${event.year}-${index}`}
          event={event}
          index={index}
          isVisible={isVisible}
        />
      ))}
    </div>
  );
});

Timeline22.displayName = "Timeline22";

export default Timeline22;
