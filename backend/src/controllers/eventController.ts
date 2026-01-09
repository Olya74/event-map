import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../exeptions/errorHandlung.js";
import eventService from "../services/event-service.js";
import { Types } from "mongoose";
import GetAllEventsQuery from "src/services/types/GetAllEventsQuery.js";




const getAllEvents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 1, sortBy = "createdAt", sortDirection = "desc" } = req.query;
    const queryParams:GetAllEventsQuery = {page: Number(page), limit: Number(limit), sortBy: String(sortBy), sortDirection: String(sortDirection) as "asc" | "desc"};
    const events = await eventService.getAllEvents(queryParams);
   
    res.status(200).json(events);
  } catch (error) {
    next(error);
  }
};

const createEvent = async (req: Request, res: Response, next: NextFunction) => {
  const body = req.body;
 
  try {
    if (!body.title || !body.date || !body.userId) {
      return next(ErrorHandler.ValidationError("Missing required fields"));
    }
    const files = (req.files as Express.Multer.File[]) || [];
    const parsedDate = new Date(body.date);
    if (isNaN(parsedDate.getTime())) {
      throw ErrorHandler.ValidationError("Invalid date format");
    }
    body.date = parsedDate;
    const newEvent = await eventService.createEvent(body, files);
    res
      .status(201)
      .json({ message: "Event created successfully", event: newEvent });
  } catch (error) {
    next(error);
  }
};

const getEventById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const event = await eventService.getEventById(req.params.id);
    if (!event) {
      return next(ErrorHandler.ValidationError("Event not found"));
    }
    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
};
const updateEventById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.params.id) {
      return next(ErrorHandler.ValidationError("Event ID is required"));
    }
    const existingMediaIds: Types.ObjectId[] = JSON.parse(
      req.body.existingMedia || "[]"
    ).map((id: string) => new Types.ObjectId(id));

    const files = (req.files as Express.Multer.File[]) || [];

    const event = await eventService.updateEvent(
      req.params.id,
      req.body,
      existingMediaIds,
      files
    );
    res.json(event);
  } catch (error) {
    next(error);
  }
};

const deleteEventById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await eventService.deleteEventById(req.params.id);
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    next(error);
  }
};
const getMyEvents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
     if (!userId) {
      throw ErrorHandler.ValidationError("Unauthorized");
    }
    const myEvents = await eventService.getMyEvents(userId);
    res.status(200).json(myEvents);
  } catch (error) {
    next(error);
  }
};
const getJoinedEvents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
     if (!userId) {
      throw ErrorHandler.ValidationError("Unauthorized");
    }
    const joinedEvents = await eventService.getJoinedEvents(userId);
    res.status(200).json(joinedEvents);
  } catch (error) {
    next(error);
  }
};
const joinEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const eventId = req.params.id;
    if (!userId) {
      throw ErrorHandler.ValidationError("Unauthorized");
    }
    await eventService.joinEvent(eventId, userId);
    res.status(200).json({ message: "Successfully joined the event" });
  } catch (error) {
    next(error);
  }
};
const leaveEvent = async (req: Request, res: Response, next: NextFunction) => {
  console.log("leaveEvent controller called");
  try {
    const userId = req.user?.id;
    const eventId = req.params.id;
    if (!userId) {
      throw ErrorHandler.ValidationError("Unauthorized");
    }
    await eventService.leaveEvent(eventId, userId);
    res.status(200).json({ message: "Successfully left the event" });
  } catch (error) {
    next(error);
  }
};
export {
  createEvent,
  getAllEvents,
  deleteEventById,
  getEventById,
  updateEventById,
  getMyEvents,
  getJoinedEvents,
  joinEvent,
  leaveEvent
};
