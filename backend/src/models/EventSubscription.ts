import {
  EventCategory,
  EVENT_CATEGORIES,
  EVENT_CATEGORY_KEYS,
} from "@event-map/shared/dist/src/eventTypes.js";
import { model, Schema, Types } from "mongoose";

export type WithSubscription<T> = T & { isSubscribed: boolean };
export interface IEventSubscription {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  eventId: Types.ObjectId;
  category: EventCategory;
  subCategory?: string;
  startDate: Date; // when the subscription starts
  endDate?: Date; // when the subscription ends
  isActive: boolean;
  notifyByEmail: boolean;
  unsubscribeToken?: string;
  unsubscribeTokenExpiresOn?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const EventSubscriptionSchema = new Schema<IEventSubscription>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    category: {
      type: String,
      enum: Object.values(EVENT_CATEGORY_KEYS),
      required: true,
    },
    subCategory: {
      type: String,
      validate: {
        validator(value: string) {
          const allSubCategories = Object.values(EVENT_CATEGORIES).flatMap(
            (c) => c.subcategories,
          ) as readonly string[];

          return allSubCategories.includes(value);
        },
        message: "Invalid subCategory",
      },
    },

    startDate: {
      type: Date,
      default: () => new Date(),
      required: true,
    },
    endDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    notifyByEmail: {
      type: Boolean,
    },
    unsubscribeToken: {
      type: String,
    },
    unsubscribeTokenExpiresOn: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

// ❗ защита от дубликатов
EventSubscriptionSchema.index({ userId: 1, eventId: 1 }, { unique: true });

EventSubscriptionSchema.index(
  { unsubscribeTokenExpiresOn: 1 },
  { expireAfterSeconds: 0 },
);

const EventSubscription = model<IEventSubscription>(
  "EventSubscription",
  EventSubscriptionSchema,
);
export default EventSubscription;
