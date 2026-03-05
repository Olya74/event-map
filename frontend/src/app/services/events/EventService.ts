import type { IEvent } from "../../models/IEvent";
import { apiSlice } from "../../api/apiSlice";
import type { EventQueryResponse, EventResponse } from "../../models/IEvent";

export const eventAPI = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getAllEvents: build.query<EventResponse, EventQueryResponse>({
      query: ({ page, limit, sortBy, sortDirection, fromDate }) => {
        let url = `/events?page=${page}&limit=${limit}&sortBy=${sortBy}&sortDirection=${sortDirection}`;
        if (fromDate) url += `&fromDate=${encodeURIComponent(fromDate)}`;
        return url;
      },
      providesTags: () => [{ type: "AllEvents" }],
    }),

    getEventsByCategory: build.query<
      EventResponse,
      {
        category: string;
        subCategory: string;
        queryParams: EventQueryResponse;
      }
    >({
      query: ({ category, subCategory, queryParams }) =>
        `/events/${category}/${subCategory}?page=${queryParams.page}&limit=${queryParams.limit}&sortBy=${queryParams.sortBy}&sortDirection=${queryParams.sortDirection}`,
      providesTags: () => [{ type: "EventByCategory" }],
    }),
    createEvent: build.mutation<any, FormData>({
      query: (formData) => ({
        url: "/events/create-event",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "AllEvents", id: "LIST" }],
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
    subscribeToEvent: build.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/events/${id}/subscribe`,
        method: "POST",
      }),
      // invalidatesTags: (result, error, id) => [{ type: "SubscribedEvent", id }],
      invalidatesTags: (result, error, id) => [
        { type: "Event", id },
        { type: "MyEvents" },
        { type: "JoinedEvents" },
        { type: "AllEvents" },
      ],
    }),
    unsubscribeFromEvent: build.mutation<
      { message: string; title: string },
      string
    >({
      query: (id) => ({
        url: `/events/${id}/unsubscribe`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Event", id },
        { type: "MyEvents" },
        { type: "JoinedEvents" },
        { type: "AllEvents" },
      ],
    }),
    confirmUnsubscribeFromEvent: build.mutation<
      { message: string; title: string },
      string
    >({
      query: (token) => ({
        url: `/events/unsubscribe-confirm?token=${token}`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Event", id },
        { type: "MyEvents" },
        { type: "JoinedEvents" },
        { type: "AllEvents" },
      ],
    }),
    deleteEvent: build.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/events/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Event", id },
        { type: "MyEvents" },
        { type: "JoinedEvents" },
        { type: "AllEvents", id },
      ],
    }),
    getMyEvents: build.query<EventResponse, void>({
      query: () => `/events/my-events`,
      providesTags: () => [{ type: "MyEvents" }],
    }),
    getJoinedEvents: build.query<IEvent[], void>({
      query: () => "/events/joined",
      providesTags: () => [{ type: "JoinedEvents" }],
    }),
    joinEvent: build.mutation<
      { message: string; event: IEvent },
      { eventId: string; userId: string }
    >({
      query: ({ eventId }) => ({
        url: `/events/${eventId}/join`,
        method: "POST",
      }),
      invalidatesTags: () => [{ type: "Event" }, { type: "JoinedEvents" }],
      async onQueryStarted({ eventId, userId }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          eventAPI.util.updateQueryData("getEventById", eventId, (draft) => {
            if (!draft.attendees.includes(userId)) {
              draft.attendees.push(userId);
            }
          }),
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
      invalidatesTags: () => [{ type: "Event" }, { type: "JoinedEvents" }],
      async onQueryStarted({ eventId, userId }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          eventAPI.util.updateQueryData("getEventById", eventId, (draft) => {
            draft.attendees = draft.attendees.filter((id) => id !== userId);
          }),
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
  useGetEventsByCategoryQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useGetEventByIdQuery,
  useGetMyEventsQuery,
  useGetJoinedEventsQuery,
  useJoinEventMutation,
  useLeaveEventMutation,
  useSubscribeToEventMutation,
  useUnsubscribeFromEventMutation,
  useConfirmUnsubscribeFromEventMutation,
} = eventAPI;
