import type {Types } from "mongoose";
import Media from "../../models/Media.js";
import { CloudinaryDeleteDTO } from "./types/cloudinaryDeleteDto.js";
import { ClientSession } from "mongoose";

export const createMediaFromUpload = async (
  uploads: CloudinaryDeleteDTO[],
  userId: Types.ObjectId,
  session: ClientSession
): Promise<Types.ObjectId[]> => {
  const docs = await Media.insertMany(
    uploads.map(u => ({
      public_id: u.public_id,
      url: u.url,
      type: u.type,
      owner: userId,
      referenceCount: 1,
    })),
    { session }
  );

  return docs.map(d => d._id);
};
