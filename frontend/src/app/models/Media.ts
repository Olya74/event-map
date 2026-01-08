import type { MediaType } from "./media-types";

export interface IMedia {
  _id: string; // Mongo _id
  publicId?: string; // Cloudinary public ID
  url: string;
  type: MediaType;
}
