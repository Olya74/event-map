import { useGetUpcommingEventsQuery } from "../EventService";
import EventList from "./EventsList";
import { useState } from "react";

function UpcommingEvents() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const { data: events } = useGetUpcommingEventsQuery({ page, limit });
  return (
    <div>
      <h2 className="text-center text-xl lg:font-extrabold lg:text-3xl mb-6 text-red-400">
        Upcoming Events
      </h2>
      <EventList events={events || []} emptyText="No upcoming events" />
      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-8 ">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 rounded-lg border disabled:opacity-40"
        >
          ← Previous
        </button>

        <span className="text-sm font-medium">Page {page}</span>

        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={!events || events.length < limit}
          className="px-4 py-2 rounded-lg border disabled:opacity-40"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

export default UpcommingEvents;
