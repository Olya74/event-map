import type { IEvent } from "src/app/models/IEvent";
import EventItem from "./EventItem";

function EventList({
  events,
  emptyText,
}: {
  events?: IEvent[];
  emptyText?: string;
}) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] gap-6 ">
      {events && events.length > 0 ? (
        events.map((event) => <EventItem key={event._id} event={event} />)
      ) : (
        <p className="text-center text-gray-500">
          {emptyText || "No events available"}
        </p>
      )}
    </div>
  );
}

export default EventList;
