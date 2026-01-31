import { forwardRef } from "react";
import type { TimelineEvent } from "@/data/historyPeriods";
import TimelineItem from "./TimelineItem";

interface TimelineProps {
  events: TimelineEvent[];
  isVisible: boolean;
}

const Timeline = forwardRef<HTMLDivElement, TimelineProps>(({ events, isVisible }, ref) => {
  return (
    <div ref={ref} className="relative">
      {events.map((event, index) => (
        <TimelineItem
          key={`${event.year}-${index}`}
          event={event}
          index={index}
          isVisible={isVisible}
        />
      ))}
    </div>
  );
});

Timeline.displayName = "Timeline";

export default Timeline;
