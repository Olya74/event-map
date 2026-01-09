import express from "express";
import { createEvent,getAllEvents,deleteEventById,getEventById,updateEventById, getMyEvents, getJoinedEvents,joinEvent,leaveEvent} from "../controllers/eventController.js";
import { uploadEventMedia } from "../middlewares/uploadEventMedia.js";
import { authMiddleware } from "../middlewares/auth.middleware.js"


const  eventRouter = express.Router();

eventRouter.route('/').get(getAllEvents);
eventRouter.route('/create-event').post(authMiddleware, uploadEventMedia, createEvent);
eventRouter.route('/my-events').get( authMiddleware, getMyEvents);
eventRouter.route('/joined').get( authMiddleware, getJoinedEvents);
eventRouter.route('/:id').delete(authMiddleware,deleteEventById).get(getEventById).put(authMiddleware,uploadEventMedia,updateEventById);
eventRouter.route('/:id/join').post(authMiddleware, joinEvent).delete(authMiddleware, leaveEvent);
 
export default eventRouter;