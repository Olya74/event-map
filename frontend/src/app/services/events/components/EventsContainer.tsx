import { useState } from "react";
import type { JSX } from "react";
import { useGetAllEventsQuery } from "../EventService";
import Loader from "../../../../components/loading/Loader";
import EventsList from "./EventsList";

function EventsContainer(): JSX.Element {
  const [limit, setLimit] = useState(6);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const {
    data: events,
    isLoading,
    isError,
  } = useGetAllEventsQuery({ limit, page, sortBy, sortDirection });

  return (
    <section className="max-w-[160rem] mx-auto px-4 py-6 ">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-6 text-center ">Events</h1>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-white p-4 rounded-xl shadow max-w-4xl mx-auto justify-between">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Sort by</label>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
            }}
            className="border rounded-lg px-3 py-2"
          >
            <option value="createdAt">Created</option>
            <option value="title">Title</option>
            <option value="date">Date</option>
            <option value="eventType">Type</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Direction</label>
          <select
            value={sortDirection}
            onChange={(e) => {
              setSortDirection(e.target.value as "asc" | "desc");
              setPage(1);
            }}
            className="border rounded-lg px-3 py-2"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Per page</label>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="border rounded-lg px-3 py-2"
          >
            <option value={6}>6</option>
            <option value={12}>12</option>
            <option value={24}>24</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {isLoading && (
        <div className="h-48 bg-gray-500 rounded-xl animate-pulse flex items-center justify-center mt-6">
          <Loader />
        </div>
      )}

      {isError && (
        <p className="text-center text-red-600">Failed to load events</p>
      )}

      {events?.length === 0 && (
        <p className="text-center text-gray-500">No events found</p>
      )}

      <EventsList events={events} emptyText="No events found" />

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-8">
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
    </section>
  );
}

export default EventsContainer;
