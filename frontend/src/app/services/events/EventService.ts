import type { IEvent } from "../../models/IEvent";
import { apiSlice } from "../../api/apiSlice";
import type { EventQueryResponse, EventResponse } from "../../models/IEvent";

export const eventAPI = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getAllEvents: build.query<EventResponse, EventQueryResponse>({
      query: ({ page, limit, sortBy, sortDirection }) =>
        `/events?page=${page}&limit=${limit}&sortBy=${sortBy}&sortDirection=${sortDirection}`,
      providesTags: () => [{ type: "Event" }],
    }),
    createEvent: build.mutation<any, FormData>({
      query: (formData) => ({
        url: "/events/create-event",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Event", id: "LIST" }],
    }),
    getEventById: build.query<IEvent, string>({
      query: (id) => `/events/${id}`,
      providesTags: (result, error, id) =>
        result
          ? [{ type: "Event", id }]
          : error?.status === 401
          ? ["UNAUTHORIZED"]
          : ["UNKNOWN_ERROR"],
    }),
    updateEvent: build.mutation<void, { id: string; updatedEvent: FormData }>({
      query: ({ id, updatedEvent }) => ({
        url: `/events/${id}`,
        method: "PUT",
        body: updatedEvent,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Event", id }],
    }),
    deleteEvent: build.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/events/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Event", id }],
    }),
    getMyEvents: build.query<EventResponse, void>({
      query: () => `/events/my-events`,
      providesTags: () => [{ type: "Event" }],
    }),
    getJoinedEvents: build.query<IEvent[], void>({
      query: () => "/events/joined",
      providesTags: () => [{ type: "Event" }],
    }),
  }),
});

export const {
  useGetAllEventsQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useGetEventByIdQuery,
  useGetMyEventsQuery,
  useGetJoinedEventsQuery,
} = eventAPI;
