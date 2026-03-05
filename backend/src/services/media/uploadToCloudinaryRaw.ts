import cloudinary from "../../config/cloudinary.js";
import type {Types } from "mongoose";
import fs from "fs/promises";
import { CloudinaryDeleteDTO } from "./types/cloudinaryDeleteDto.js";
import ErrorHandler from "../../exeptions/errorHandlung.js";

export const uploadToCloudinaryRaw = async (
  files: Express.Multer.File[],
  userId: Types.ObjectId,
  folderName: string
): Promise<CloudinaryDeleteDTO[]> => {
  if (!files || files.length === 0) return [];

  const uploaded: CloudinaryDeleteDTO[] = [];

  for (const file of files) {
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: file.mimetype.startsWith("video") ? "video" : "image",
       folder: `event-map/${folderName}/${userId}`,
       transformation: [
  {
    width: 1600,
    height: 900,
    crop: "fill",
    gravity: "auto", // автофокус
    quality: "auto",
    fetch_format: "auto"
  }
]
  //        transformation: [
  //   {
  //     width: 1600,
  //     crop: "limit",     // не увеличивает маленькие изображения
  //     quality: "auto",   // авто-оптимизация
  //     fetch_format: "auto" // webp/avif автоматически
  //   }
  // ]
    });

    await fs.unlink(file.path);

      if (!result.public_id || !result.secure_url) {
      throw ErrorHandler.UploadToCloudinaryError(
        `Cloudinary upload failed for file: ${file.originalname}`
      );
    }
    uploaded.push({
      public_id: result.public_id,
      url: result.secure_url,
      type: file.mimetype.startsWith("video") ? "video" : "image",
    });
  }

  return uploaded;
};

