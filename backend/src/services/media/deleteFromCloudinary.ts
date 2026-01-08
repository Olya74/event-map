import cloudinary from "../../config/cloudinary.js";
import { CloudinaryDeleteDTO } from "./types/cloudinaryDeleteDto.js";


export const deleteFromCloudinary = async (
  media: CloudinaryDeleteDTO[]
): Promise<void> => {
  for (const item of media) {
    const response = await cloudinary.uploader.destroy(
      item.public_id,
      {
        resource_type: item.type,
      }
    );

    if (
      response.result !== "ok" &&
      response.result !== "not found"
    ) {
      throw new Error(
        `Cloudinary delete failed: ${item.public_id}`
      );
    }
  }
};

