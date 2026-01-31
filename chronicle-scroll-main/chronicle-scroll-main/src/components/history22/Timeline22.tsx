import { forwardRef } from "react";
import type { TimelineEvent } from "@/data/historyPeriods22";
import TimelineItem22 from "./TimelineItem22";

interface TimelineProps {
  events: TimelineEvent[];
}

const Timeline22 = forwardRef<HTMLDivElement, TimelineProps>(({ events }, ref) => {
  return (
    <div ref={ref} className="relative">
      {events.map((event, index) => (
        <TimelineItem22
          key={`${event.year}-${index}`}
          event={event}
          index={index}
        />
      ))}
    </div>
  );
});

Timeline22.displayName = "Timeline22";

export default Timeline22;
