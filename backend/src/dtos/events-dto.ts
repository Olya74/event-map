import { type EventCategory } from "@event-map/shared";
import { Types } from "mongoose";

export interface CreateEventDTO {
  title: string;
  description: string;
  date: Date | string;
  category:EventCategory | string;
  subCategory?: string;
  lat?: number;
  lng?: number;
  street?: string;
  number?: number;
  zip?: number;
  userId: Types.ObjectId;
}

export type UpdateEventDTO = Partial<CreateEventDTO>;
