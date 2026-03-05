import express from 'express';
import { uploadUserAvatar } from '../middlewares/uploadUserAvatar.js';
import { getUsers,createAvatar, getUserById,updateNotificationSettings } from '../controllers/userController.js';
import { authMiddleware } from "../middlewares/auth.middleware.js"


const userRouter = express.Router();



userRouter.route('/').get(getUsers);
userRouter.route('/create-avatar').post(authMiddleware, uploadUserAvatar, createAvatar);
userRouter.route("/notification-settings").patch(authMiddleware,updateNotificationSettings)
userRouter.route("/users/:id").get(authMiddleware, getUserById);

export default userRouter;