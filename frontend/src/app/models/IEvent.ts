import { type IMedia } from "./Media";
import { type EventType, type EventStatus } from "@event-map/shared";

export type EventResponse = IEvent[];
export type EventQueryResponse = {
  page: number;
  sortBy: string;
  sortDirection: "asc" | "desc";
  limit: number;
};

export interface IEvent {
  _id: string;
  title: string;
  description: string;
  date: string; 
  media: IMedia[];
  eventType: EventType;
  location: {
    lat: number;
    lng: number;
  };
  address?: {
    street?: string;
    number?: string;
    zip?: string;
  };
  creator: string;
  attendees: string[];
  maxAttendees: number;
  isPaid: boolean;
  price?: number;
  status: EventStatus;
}

export interface CreateEventDTO {
  title: string;
  description: string;
  date: Date | string;
  eventType: EventType;
  street?: string;
  number?: string;
  zip?: string;
}

export type UpdateEventDTO = Partial<IEvent> & { _id: string };
