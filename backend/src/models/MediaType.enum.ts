export const MEDIA_TYPES = ["image", "video", "audio", "document"] as const;
export type MediaType = typeof MEDIA_TYPES[number];