export const EVENT_TYPES = [
  "sports",
  "music",
  "art",
  "wedding",
  "culture",
  "technology",
  "food",
  "travel",
  "children_events",
  "other",
] as const;

export type EventType = typeof EVENT_TYPES[number];

export const EVENT_STATUS = [
  "draft",
  "published",
  "cancelled",
] as const;

export type EventStatus = typeof EVENT_STATUS[number];