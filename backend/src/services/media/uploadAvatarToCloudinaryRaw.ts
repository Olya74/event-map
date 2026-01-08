import cloudinary from "../../config/cloudinary.js";
import type { Types } from "mongoose";
import fs from "fs/promises";
import { CloudinaryDeleteDTO } from "./types/cloudinaryDeleteDto.js";
import ErrorHandler from "../../exeptions/errorHandlung.js";

export const uploadAvatarToCloudinaryRaw = async (
  file: Express.Multer.File,
  userId: Types.ObjectId,
  folderName: string
): Promise<CloudinaryDeleteDTO> => {
  if (!file) {
    throw ErrorHandler.ValidationError("No file provided");
  }
try {
  const result = await cloudinary.uploader.upload(file.path, {
    resource_type: file.mimetype.startsWith("video") ? "video" : "image",
    folder: `event-map/${folderName}/${userId}`,
  });

  await fs.unlink(file.path);

  if (!result.public_id || !result.secure_url) {
    throw ErrorHandler.UploadToCloudinaryError(
      `Cloudinary upload failed for file: ${file.originalname}`
    );
  }
  const uploaded: CloudinaryDeleteDTO = {
    public_id: result.public_id,
    url: result.secure_url,
    type: file.mimetype.startsWith("video") ? "video" : "image",
  };
   return uploaded;
} catch (error) {
  await fs.unlink(file.path);
  throw error;
}

 
};
