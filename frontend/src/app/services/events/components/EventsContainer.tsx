import { useState,useEffect } from "react";
import type { JSX } from "react";
import { useGetAllEventsQuery, useGetEventsByCategoryQuery } from "../EventService";
import Loader from "../../../../components/loading/Loader";
import EventsList from "./EventsList";
import { useParams } from "react-router-dom";
import { useRefreshQuery } from "../../../features/auth/authApiSlice";
import { useAppSelector } from "../../../hooks/hooks";
import { selectedCurrentUser } from "../../../features/auth/authSlice";


interface EventsContainerProps {
  upcomingOnly?: boolean; // 🔹 если true — показываем только будущие события
}

function EventsContainer({ upcomingOnly = false }: EventsContainerProps): JSX.Element {
  const [limit, setLimit] = useState(6);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  // 🔹 Добавляем параметр fromDate для будущих событий
  const fromDate = upcomingOnly ? new Date().toISOString().split("T")[0] : undefined;
  const queryParams = { limit, page, sortBy, sortDirection, fromDate };
  const { category, subCategory } = useParams<{
    category?: string;
    subCategory?: string;
  }>();
  const currentUser = useAppSelector(selectedCurrentUser);
  // 🔹 Получаем текущего пользователя через refreshQuery
  const { data: refreshData, isSuccess: refreshSuccess } = useRefreshQuery();
  const userId = refreshSuccess ? refreshData.userData.user.id : undefined;

  let eventsQuery: ReturnType<typeof useGetAllEventsQuery> | ReturnType<typeof useGetEventsByCategoryQuery>;
  if (category && subCategory) {
    eventsQuery = useGetEventsByCategoryQuery({
      category,
      subCategory,
      queryParams,
    });
  } else {
    eventsQuery = useGetAllEventsQuery(
      { ...queryParams},
     currentUser ? { skip: !refreshSuccess } : undefined // ждём пока подгрузится пользователь
     
      
    );
  }

  const { data: events, isLoading, isError,refetch } = eventsQuery;
  
useEffect(() => {
  if (refreshSuccess) {
    refetch();
  }
}, [refreshSuccess, refetch]);
   
  return (
    <section className="max-w-[160rem] mx-auto px-4 py-6 ">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-6 text-center">
        {upcomingOnly ? "Upcoming Events" : "Events"}
      </h1>

      {/* Controls */}
      {/* {!upcomingOnly && ( */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-gray-200 p-4 rounded-xl shadow max-w-4xl mx-auto  justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">Sort by</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              <option value="createdAt">Created</option>
              <option value="title">Title</option>
              <option value="date">Date</option>
              <option value="eventType">Type</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">Direction</span>
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
            <span className="text-sm font-medium">Per page</span>
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
      {/* )} */}

      {/* Content */}
      {isLoading && (
        <div className="h-48 bg-gray-500 rounded-xl animate-pulse flex items-center justify-center mt-6">
          <Loader />
        </div>
      )}

      {isError && (
        <p className="text-center text-red-600">Failed to load events</p>
      )}

      <EventsList events={events || []} emptyText="No events found" />

      {/* Pagination */}
      {/* {!upcomingOnly && ( */}
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
      {/* )} */}
    </section>
  );
}

export default EventsContainer;

