import { Types } from "mongoose";
import ErrorHandler from "../exeptions/errorHandlung.js";
import User, { IUser } from "../models/User.js";
import mongoose from "mongoose";
import { CloudinaryDeleteDTO } from "./media/types/cloudinaryDeleteDto.js";
import { uploadAvatarToCloudinaryRaw } from "./media/uploadAvatarToCloudinaryRaw.js";
import Media, { IMediaDocument } from "../models/Media.js";
import cloudinary from "../config/cloudinary.js";
import { IAvatar } from "../models/IAvatar.js";
import mailService from "./mail-service.js";


class UserService {
  getUsers = async () => {
    const users = await User.find().populate("avatar");
    if (!users) {
      throw ErrorHandler.NotFoundError("No users found");
    }
    return users;
  };

  updateNotificationSettings = async (
    userId: string,
     email_notifications: boolean, 
     push_notifications: boolean 
  ) => {
    if(!userId) {
      throw ErrorHandler.ValidationError("User ID is required");
    }
    if (
  typeof email_notifications !== "boolean" ||
  typeof push_notifications !== "boolean"
) {
  throw ErrorHandler.ValidationError("Invalid settings");
}

    const user = await User.findById(userId);
    if (!user) {
      throw ErrorHandler.NotFoundError("User not found");
    }
    

user.notification_settings.email_notifications = email_notifications;
user.notification_settings.push_notifications = push_notifications;

    await user.save();
    return { message: "Notification settings updated successfully" };
  };

  createAvatar = async (
    file: Express.Multer.File,
    userId: Types.ObjectId,
    folderName: string
  ): Promise<IAvatar> => {
    if (!userId) {
      throw ErrorHandler.ValidationError("User ID is required");
    }
    if (!file) {
      throw ErrorHandler.ValidationError("No file provided");
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    let oldAvatarToDelete: IMediaDocument | null = null;
    let uploadedResult: CloudinaryDeleteDTO | null = null;
    try {
      const user = await User.findById(userId).session(session);
      if (!user) {
        throw ErrorHandler.NotFoundError("User not found");
      }

      // ☁️ upload (side-effect)
      uploadedResult = await uploadAvatarToCloudinaryRaw(
        file,
        user._id,
        folderName
      );

      // 🗂 DB
      const media = await Media.create(
        [
          {
            url: uploadedResult.url,
            public_id: uploadedResult.public_id,
            type: uploadedResult.type,
            owner: user._id,
            referenceCount: 1,
          },
        ],
        { session }
      );

      // ⚠️ старый аватар
      if (user.avatar) {
        oldAvatarToDelete = await Media.findByIdAndDelete(user.avatar).session(
          session
        );
      }

      user.avatar = media[0]._id;
      await user.save({ session });

      await session.commitTransaction();

      // 🔥 Cloudinary cleanup старого аватара ПОСЛЕ commit
      if (oldAvatarToDelete) {
        const response = await cloudinary.uploader.destroy(
          oldAvatarToDelete.public_id,
          {
            resource_type: oldAvatarToDelete.type,
          }
        );

        if (response.result !== "ok" && response.result !== "not found") {
          throw new Error(
            `Cloudinary delete failed: ${oldAvatarToDelete.public_id}`
          );
        }
      }

      return {
        url: media[0].url,
        publicId: media[0].public_id,
        id: media[0]._id.toString(),
        type: media[0].type,
      };
    } catch (error) {
      await session.abortTransaction();

      // ❗ cleanup нового upload
      if (uploadedResult) {
        try {
          await cloudinary.uploader.destroy(uploadedResult.public_id, {
            resource_type: uploadedResult.type,
          });
        } catch (cleanupErr) {
          console.error("Avatar cleanup failed", cleanupErr);
        }
      }

      throw error;
    } finally {
      session.endSession();
    }
  };

  getUserById = async (userId: string) => {
    const user = await User.findById(userId).populate("avatar");
    if (!user) {
      throw ErrorHandler.NotFoundError("User not found");
    }
    return user;
  };
  sendEmail = async (from:string,to: string, subject: string, text: string) => {
    try {
     await mailService.sendMail(from,to, subject, text);
          
    
    console.log(`Sending email from ${from} to ${to} with subject "${subject}"`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw ErrorHandler.SendEmailError();
  }
    return { message: "Email sent successfully" };
  }
}
const userService = new UserService();
export default userService;
