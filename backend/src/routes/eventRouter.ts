import express from "express";
import { createEvent,getAllEvents,deleteEventById,getEventById,updateEventById, getMyEvents, getJoinedEvents,
    joinEvent,leaveEvent,getUpcommingEvents,getEventsByCategory, subscribeToEvent,
    confirmUnsubscribeFromEvent,
    unsubscribeFromEventByLink
} from "../controllers/eventController.js";
import { uploadEventMedia } from "../middlewares/uploadEventMedia.js";
import { authMiddleware } from "../middlewares/auth.middleware.js"
import { optionalAuth } from "../middlewares/optionalAuth.middleware.js";


const  eventRouter = express.Router();

eventRouter.route('/').get(optionalAuth ,getAllEvents);
eventRouter.route('/:category/:subCategory').get(getEventsByCategory);
eventRouter.route('/create-event').post(authMiddleware, uploadEventMedia, createEvent);
eventRouter.route('/my-events').get( authMiddleware, getMyEvents);
eventRouter.route('/joined').get( authMiddleware, getJoinedEvents);
eventRouter.route('/upcomming').get(getUpcommingEvents);
//unsubscribe from event by link
eventRouter.route('/unsubscribe').get(unsubscribeFromEventByLink);
// 
 eventRouter.route('/unsubscribe-confirm').post(unsubscribeFromEventByLink);
 eventRouter.post('/:id/unsubscribe', authMiddleware, confirmUnsubscribeFromEvent);
eventRouter.route('/:id').delete(authMiddleware,deleteEventById).get(getEventById).put(authMiddleware,uploadEventMedia,updateEventById);
eventRouter.post('/:id/subscribe', authMiddleware, subscribeToEvent);




eventRouter.route('/:id/join').post(authMiddleware, joinEvent).delete(authMiddleware, leaveEvent);
 
export default eventRouter;