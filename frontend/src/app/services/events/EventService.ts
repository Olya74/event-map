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
    getUpcommingEvents: build.query<
      EventResponse,
      { page: number; limit: number }
    >({
      query: ({ page, limit }) =>
        `/events/upcomming?page=${page}&limit=${limit}`,
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
    joinEvent: build.mutation<
      { message: string; event: IEvent },
      { eventId: string; userId: string }
    >({
      query: ({ eventId }) => ({
        url: `/events/${eventId}/join`,
        method: "POST",
      }),
      invalidatesTags: () => [{ type: "Event" }],
      async onQueryStarted({ eventId, userId }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          eventAPI.util.updateQueryData("getEventById", eventId, (draft) => {
            if (!draft.attendees.includes(userId)) {
              draft.attendees.push(userId);
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),

    leaveEvent: build.mutation<
      { message: string },
      { eventId: string; userId: string }
    >({
      query: ({ eventId, userId }) => ({
        url: `/events/${eventId}/join`,
        method: "DELETE",
      }),
      invalidatesTags: () => [{ type: "Event" }],
      async onQueryStarted({ eventId, userId }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          eventAPI.util.updateQueryData("getEventById", eventId, (draft) => {
            draft.attendees = draft.attendees.filter((id) => id !== userId);
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
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
  useJoinEventMutation,
  useLeaveEventMutation,
  useGetUpcommingEventsQuery,
} = eventAPI;
