import { Schema, Types, model } from "mongoose";
import { EVENT_TYPES, type EventType } from "@event-map/shared";



export interface IEventDocument {
  _id: Types.ObjectId;
        title: string;
        description: string;
        eventType: EventType;
        date: Date;
        media:Types.ObjectId[];
        location: {
          lat: number;
          lng: number;
        };
        creator: Types.ObjectId;
        attendees: Types.ObjectId[];
        maxAttendees: number;
        isPaid: boolean;
        price?: number;
        status:"draft" | "published" | "cancelled";
        address: {
          street?: string;
          number?: string;
          zip?: string;
          city?: string;
          country?: string;
        };
}
const eventSchema = new Schema<IEventDocument>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  eventType: {
    type: String,
    enum: EVENT_TYPES,
    default: "other",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  media:[{
    type: Schema.Types.ObjectId,
    ref: "Media",
    default: [],
  }],
  location: {
    lat: Number,
    lng: Number,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  attendees: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],
  maxAttendees: {
    type: Number,
    default: 100,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  price: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["draft", "published", "cancelled"],
    default: "draft",
  },
  address: {
    street: { type: String },
    number: { type: String ,default: "Not specified" },
    zip: { type: String ,default:"Not specified"},
    city: { type: String, default: "Berlin" },
    country: { type: String, default: "Germany" }
  }
}, { timestamps: true });

const Event = model<IEventDocument>("Event", eventSchema);
export default Event;
