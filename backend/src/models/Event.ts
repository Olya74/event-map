import { Schema, Types, model } from "mongoose";
import { EVENT_CATEGORIES, type  EventCategory } from "@event-map/shared";


const EVENT_CATEGORY_KEYS = Object.keys(
  EVENT_CATEGORIES
) as EventCategory[];

export interface IEventDocument {
  _id: Types.ObjectId;
        title: string;
        description: string;
       category: EventCategory;         
       subCategory?: string; 
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
  category: {
      type: String,
       enum: Object.keys(EVENT_CATEGORIES),
      required: true,
    },
subCategory: {
  type: String,
  validate: {
    validator(value: string) {
      const allSubCategories = Object.values(EVENT_CATEGORIES)
        .flatMap(c => c.subcategories) as readonly string[];

      return allSubCategories.includes(value);
    },
    message: "Invalid subCategory",
  },
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
