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

class EventService {
  // Get all events with populated media
  async getAllEvents({
    page,
    limit,
    sortDirection,
    sortBy,
  }: GetAllEventsQuery) {
    const skip = (page - 1) * limit;
    const events = await Event.find()
      .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .populate("media");
    if (!events) {
      throw ErrorHandler.NotFoundError("No events found");
    }
    return events;
  }

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
        // ☁️ side-effect ДО транзакции
        if (files && files.length > 0) {
          uploadedCloudinary = await uploadToCloudinaryRaw(
            files,
            eventData.userId,
            "events"
          );
        }

        session = await mongoose.startSession();
        session.startTransaction();

        const mediaIds =
          uploadedCloudinary.length > 0
            ? await createMediaFromUpload(
                uploadedCloudinary,
                eventData.userId,
                session
              )
            : [];
        const newEvent = await Event.create(
          [
            {
              title: eventData.title,
              description: eventData.description,
              eventType: eventData.eventType,
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
          { session }
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
          session
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
    files: Express.Multer.File[]
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
        (id) => !existingMediaIds.some((e) => e.equals(id))
      );
      await deleteFromCloudinary(
        await prepareMediaForDeletion(removedMediaIds, session)
      );
      uploadedCloudinary = await uploadToCloudinaryRaw(
        files,
        event.creator,
        "events"
      );

      const uploadedMediaIds = uploadedCloudinary.length
        ? await createMediaFromUpload(
            uploadedCloudinary,
            event.creator,
            session
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
  async getMyEvents(userId: Types.ObjectId) {
    const events = await Event.find({ creator: userId }).populate("media");
    if (events.length === 0) {
      return [];
    }
    return events;
  }
  async getJoinedEvents(userId: Types.ObjectId) {
    const events = await Event.find({ attendees: userId }).populate("media");
    if (events.length === 0) {
      return [];
    }
    return events;
  }
  async joinEvent(eventId: string, userId: Types.ObjectId) {
    const event = await Event.findById(eventId);
    if (!event) {
      throw ErrorHandler.NotFoundError("Event not found");
    } 
    if (event.attendees.includes(userId)) {
      throw ErrorHandler.ValidationError("User already joined the event");
    } 
    event.attendees.push(userId);
    await event.save();
    return { message: "Successfully joined the event.", event };
  }
  async leaveEvent(eventId: string, userId: Types.ObjectId) {
    const event = await Event.findById(eventId);
    if (!event) {
      throw ErrorHandler.NotFoundError("Event not found");
    } 
    if (!event.attendees.includes(userId)) {
      throw ErrorHandler.ValidationError("User is not an attendee of the event");
    }
    event.attendees = event.attendees.filter((id) => !id.equals(userId));
    await event.save();
    return { message: "Successfully left the event." };
  }
}
export default new EventService();
