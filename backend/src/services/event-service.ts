import { geocodeAddress } from "../utils/functions.js";
import ErrorHandler from "../exeptions/errorHandlung.js";
import mongoose, { ClientSession, Types } from "mongoose";
import { CloudinaryDeleteDTO } from "../services/media/types/cloudinaryDeleteDto.js";
import { uploadToCloudinaryRaw } from "../services/media/uploadToCloudinaryRaw.js";
import { createMediaFromUpload } from "../services/media/createMediaFromUpload.js";
import Event from "../models/Event.js";
import { deleteFromCloudinary } from "../services/media/deleteFromCloudinary.js";
import { CreateEventDTO } from "../dtos/events-dto.js";
import { prepareMediaForDeletion } from "../services/media/prepareMediaForDeletion.js";
import { IEventDocument } from "../models/Event.js";
import GetAllEventsQuery from "./types/GetAllEventsQuery.js";
import capitalizeFirstLetter from "../utils/capitalizeFirstLetter.js";
import mailService from "./mail-service.js";
import User from "../models/User.js";
import EventSubscription, {
  WithSubscription,
} from "../models/EventSubscription.js";
import TokenService from "./token-service.js";

class EventService {
  private attachSubscriptionFlag<T extends { _id: { toString(): string } }>(
    events: T[],
    subscribedEventIds: Set<string>,
  ): WithSubscription<T>[] {
    return events.map((e) => ({
      ...e,
      isSubscribed: subscribedEventIds.has(e._id.toString()),
    }));
  }

  async getAllEvents(
    { page, limit, sortBy, sortDirection, fromDate }: GetAllEventsQuery,
    userId?: string,
  ) {
    const skip = (page - 1) * limit;
    const query: any = {};
    if (fromDate) {
      query.date = { $gte: new Date(fromDate) }; // 🔹 only future events
    }
    // 1️⃣ Get events with pagination and sorting
    const events = await Event.find(query)
      .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .populate("media")
      .lean();

    const subscriptions = await EventSubscription.find({
      userId: userId,
      isActive: true,
    }).select("eventId");

    const subscribedEventIds = new Set(
      subscriptions.map((s) => s.eventId.toString()),
    );

    //2️⃣adding isSubscribed
    return this.attachSubscriptionFlag(events, subscribedEventIds);
  }

  // Get events by category and sub-category
  async getEventsByCategory(
    category: string,
    subCategory: string,
    { page, limit, sortBy, sortDirection }: GetAllEventsQuery,
  ) {
    subCategory = subCategory.split("-").map(capitalizeFirstLetter).join(" ");
    const skip = (page - 1) * limit;
    const events = await Event.find({
      category: category,
      subCategory: subCategory,
    })
      .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .populate("media");
    if (!events) {
      throw ErrorHandler.NotFoundError(
        "No events found for the specified category and sub-category",
      );
    }
    return events;
  }

  async subscribeToEvent(eventId: string, userId: string) {
    if (!Types.ObjectId.isValid(eventId)) {
      throw ErrorHandler.ValidationError("Invalid event id");
    }
    const userObjectId = new Types.ObjectId(userId);
    const eventObjectId = new Types.ObjectId(eventId);
    const session = await mongoose.startSession();

    let userEmail = "";
    let eventTitle = "";
    let notifyByEmail = false;

    try {
      await session.withTransaction(async () => {
        const event = await Event.findById(eventObjectId).session(session);
        if (!event) throw ErrorHandler.NotFoundError("Event not found");

        eventTitle = event.title;

        const existingSubscription = await EventSubscription.findOne({
          userId,
          eventId: eventObjectId,
        }).session(session);

        if (existingSubscription?.isActive) {
          throw ErrorHandler.ValidationError("User already subscribed");
        }

        if (existingSubscription) {
          existingSubscription.isActive = true;
          existingSubscription.endDate = event.date;
          await existingSubscription.save({ session });
        } else {
          await EventSubscription.create(
            [
              {
                userId: userObjectId,
                eventId: eventObjectId,
                category: event.category,
                ...(event.subCategory && { subCategory: event.subCategory }),
                endDate: event.date,
                isActive: true,
              },
            ],
            { session },
          );
        }

        const user = await User.findById(userId).session(session);
        if (!user) throw ErrorHandler.NotFoundError("User not found");

        userEmail = user.email;
        notifyByEmail =
          user.notification_settings?.email_notifications ?? false;
      });

      const token = await new TokenService().generateUnsubscribeToken(
        userId,
        eventId,
      );
      if (notifyByEmail) {
        await mailService.sendEventSubscriptionEmail(
          userEmail,
          eventTitle,
          `${process.env.CLIENT_URL}/unsubscribe?token=${token}`,
        );
      }
      return { message: "Subscribed to event successfully" };
    } finally {
      session.endSession();
    }
  }

  async unsubscribeFromEvent(eventId: string, userId: string) {
    const userObjectId = new Types.ObjectId(userId);
    if (!Types.ObjectId.isValid(eventId)) {
      throw ErrorHandler.ValidationError("Invalid event id");
    }
    const session = await mongoose.startSession();
    let userEmail = "";
    let eventTitle = "";
    let notifyByEmail = false;

    try {
      await session.withTransaction(async () => {
        const event = await Event.findById(eventId).session(session);
        if (!event) throw ErrorHandler.NotFoundError("Event not found");

        eventTitle = event.title;

        const subscription = await EventSubscription.findOneAndUpdate(
          { userId: userObjectId, eventId, isActive: true },
          { isActive: false },
          { session },
        );

        if (!subscription || !subscription.isActive) {
          return {
            message: "You are already unsubscribed",
          };
        }

        await Event.updateOne(
          { _id: eventId },
          { $pull: { attendees: userId } },
          { session },
        );

        const user = await User.findById(userId).session(session);
        if (!user) throw ErrorHandler.NotFoundError("User not found");

        userEmail = user.email;
        notifyByEmail =
          user.notification_settings?.email_notifications ?? false;
      });

      if (notifyByEmail) {
        await mailService.sendEventUnsubscriptionEmail(userEmail, eventTitle);
      }

      return { message: "Unsubscribed successfully", eventTitle };
    } finally {
      session.endSession();
    }
  }

  // Create a new event

  async createEvent(eventData: CreateEventDTO, files: Express.Multer.File[]) {
    // 📍 location
    let location: { lat: number; lng: number };
    try {
      if (!eventData.lat || !eventData.lng) {
        const addressString = [
          eventData.street,
          eventData.number,
          eventData.zip,
          "Berlin",
          "Germany",
        ]
          .filter(Boolean)
          .join(", ");

        location = await geocodeAddress(addressString);
      } else {
        location = {
          lat: Number(eventData.lat),
          lng: Number(eventData.lng),
        };
      }
      let uploadedCloudinary: CloudinaryDeleteDTO[] = [];
      let session: ClientSession | null = null;
      try {
        // ☁️ side-effect before transaction: upload files to Cloudinary
        if (files && files.length > 0) {
          uploadedCloudinary = await uploadToCloudinaryRaw(
            files,
            eventData.userId,
            "events",
          );
        }

        session = await mongoose.startSession();
        session.startTransaction();

        const mediaIds =
          uploadedCloudinary.length > 0
            ? await createMediaFromUpload(
                uploadedCloudinary,
                eventData.userId,
                session,
              )
            : [];
        const newEvent = await Event.create(
          [
            {
              title: eventData.title,
              description: eventData.description,
              category: eventData.category,
              subCategory: eventData.subCategory,
              date: eventData.date,
              media: mediaIds,
              location: location,
              creator: eventData.userId,
              address: {
                street: eventData.street,
                number: eventData.number || "Not specified",
                zip: eventData.zip || "Not specified",
              },
            },
          ],
          { session },
        );

        await session.commitTransaction();
        return newEvent[0];
      } catch (error) {
        if (session) {
          await session.abortTransaction();
        }

        // 🔥 cleanup Cloudinary
        if (uploadedCloudinary.length > 0) {
          await deleteFromCloudinary(uploadedCloudinary);
        }

        throw error;
      } finally {
        if (session) {
          session.endSession();
        }
      }
    } catch (error) {
      throw ErrorHandler.ValidationError("Invalid address provided");
    }
  }

  // Delete event by ID
  async deleteEventById(eventId: string) {
    let mediaToDelete: CloudinaryDeleteDTO[] = [];
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        const event = await Event.findById(eventId).session(session);
        if (!event) {
          throw ErrorHandler.ValidationError("Event not found");
        }

        mediaToDelete = await prepareMediaForDeletion(
          event.media ?? [],
          session,
        );

        await Event.findByIdAndDelete(eventId).session(session);
      });
    } finally {
      session.endSession();
    }

    await deleteFromCloudinary(mediaToDelete);
  }

  // Update event by ID
  async updateEvent(
    eventId: string,
    eventData: Partial<IEventDocument>,
    existingMediaIds: Types.ObjectId[],
    files: Express.Multer.File[],
  ) {
    const session = await mongoose.startSession();
    session.startTransaction();
    let uploadedCloudinary: CloudinaryDeleteDTO[] = [];

    try {
      const event = await Event.findById(eventId).session(session);
      if (!event) {
        throw ErrorHandler.ValidationError("Event not found");
      }
      const oldMediaIds = event.media.map((id) => id);
      const removedMediaIds = oldMediaIds.filter(
        (id) => !existingMediaIds.some((e) => e.equals(id)),
      );
      await deleteFromCloudinary(
        await prepareMediaForDeletion(removedMediaIds, session),
      );
      uploadedCloudinary = await uploadToCloudinaryRaw(
        files,
        event.creator,
        "events",
      );

      const uploadedMediaIds = uploadedCloudinary.length
        ? await createMediaFromUpload(
            uploadedCloudinary,
            event.creator,
            session,
          )
        : [];
      Object.assign(event, eventData);
      event.media = [...existingMediaIds, ...uploadedMediaIds];
      await event.save({ session });
      await session.commitTransaction();
      return event;
    } catch (error) {
      await session.abortTransaction();

      // 🔥 cleanup Cloudinary
      if (uploadedCloudinary.length) {
        await deleteFromCloudinary(uploadedCloudinary);
      }

      throw error;
    } finally {
      session.endSession();
    }
  }
  async getEventById(eventId: string) {
    const event = await Event.findById({ _id: eventId }).populate("media");
    if (!event) {
      throw ErrorHandler.NotFoundError("Event not found");
    }
    return event;
  }
  async getMyEvents(userId: string) {
    const events = await Event.find({ creator: userId }).populate("media");
    if (events.length === 0) {
      return [];
    }
    return events;
  }
  async getJoinedEvents(userId: string) {
    const subscriptions = await EventSubscription.find({
      userId: userId,
      isActive: true,
    }).select("eventId");

    const subscribedEventIds = new Set(
      subscriptions.map((s) => s.eventId.toString()),
    );
    const events = await Event.find({ attendees: userId })
      .populate("media")
      .lean();
    if (events.length === 0) {
      return [];
    }

    return this.attachSubscriptionFlag(events, subscribedEventIds);
  }
  async joinEvent(eventId: string, userId: string) {
    const event = await Event.findById(eventId);
    if (!event) {
      throw ErrorHandler.NotFoundError("Event not found");
    }
    if (event.attendees.some((id) => id.equals(userId))) {
      throw ErrorHandler.ValidationError("User already joined the event");
    }
    event.attendees.push(new Types.ObjectId(userId));
    await event.save();
    return { message: "Successfully joined the event.", event };
  }
  async leaveEvent(eventId: string, userId: string) {
    const event = await Event.findById(eventId);
    if (!event) {
      throw ErrorHandler.NotFoundError("Event not found");
    }
    if (!event.attendees.some((id) => id.equals(userId))) {
      throw ErrorHandler.ValidationError(
        "User is not an attendee of the event",
      );
    }
    event.attendees = event.attendees.filter((id) => !id.equals(userId));
    await event.save();
    return { message: "Successfully left the event." };
  }

  // Get upcomming events
  async getUpcommingEvents(page: number, limit: number) {
    const currentDate = new Date();
    const skip = (page - 1) * limit;
    const events = await Event.find({ date: { $gte: currentDate } })
      .sort({ date: 1 })
      .skip(skip)
      .limit(limit)
      .populate("media");

    if (events.length === 0) {
      return [];
    }
    return events;
  }
}
export default new EventService();
