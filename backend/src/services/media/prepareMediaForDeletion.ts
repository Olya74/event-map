import { Types } from "mongoose";
import { ClientSession } from "mongoose";
import Media  from "../../models/Media.js";
import { CloudinaryDeleteDTO } from "./types/cloudinaryDeleteDto.js";

export const prepareMediaForDeletion = async (
  mediaIds: Types.ObjectId[],
  session: ClientSession
): Promise<CloudinaryDeleteDTO[]> => {
  const mediaDocs = await Media.find({
    _id: { $in: mediaIds },
  }).session(session);

  const toDelete: CloudinaryDeleteDTO[] = [];

  for (const media of mediaDocs) {
    if (media.referenceCount > 1) {
      await Media.findByIdAndUpdate(
        media._id,
        { $inc: { referenceCount: -1 } },
        { session }
      );
    } else {
      toDelete.push({
        public_id: media.public_id,
        url: media.url,
        type: media.type === "video" ? "video" : "image",
      });

      await Media.findByIdAndDelete(media._id, { session });
    }
  }

  return toDelete;
};
