import { Types, Schema, model } from "mongoose";
import { MEDIA_TYPES, type MediaType } from "./MediaType.enum.js";

export interface IMediaDocument {
  _id: Types.ObjectId;
  public_id: string; // Cloudinary ID
  url: string;
  type: MediaType;
  owner: Types.ObjectId; // userId
  createdAt: Date;
  referenceCount: number;
}

const mediaSchema = new Schema<IMediaDocument>(
  {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: MEDIA_TYPES,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    referenceCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Media = model<IMediaDocument>("Media", mediaSchema);
export default Media;
