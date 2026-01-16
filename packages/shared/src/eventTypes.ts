export const EVENT_TYPES = [
  "Sports",
  "Music",
  "Art",
  "Wedding",
  "Culture",
  "Technology",
  "Food",
  "Travel",
  "Children_events",
  "Other",
] as const;



export type EventType = typeof EVENT_TYPES[number];

export const EVENT_STATUS = [
  "draft",
  "published",
  "cancelled",
] as const;

export type EventStatus = typeof EVENT_STATUS[number];

export const EVENT_CATEGORIES = {
  sports:{
  label:"Sports", subcategories: ["Football", "Basketball", "Tennis", "Running", "Cycling", "Swimming","Other"]},
  music:{label:"Music", subcategories: ["Rock", "Pop", "Jazz", "Classical","Other"]},
  art:{label:"Art", subcategories: ["Exhibition", "Painting", "Sculpture","Other"]},
  wedding:{label:"Wedding", subcategories: ["Ceremony", "Party","Other"]},
  culture:{label:"Culture", subcategories: ["Theater", "Movie", "Opera","Other"]},
  technology:{label:"Technology", subcategories: ["Meetup", "Conference", "Workshop","Other"]},
  food:{label:"Food", subcategories: ["Tasting", "Street food", "Cooking class","Other"]},
  travel:{label:"Travel", subcategories: ["City tour", "Hiking", "Excursion","Other"]},
  children_events:{label:"Children_events", subcategories: ["Birthday", "School event", "Workshop","Other"]},
  other:{label:"Other", subcategories: ["Other"]},
} as const;

export type EventCategory = keyof typeof EVENT_CATEGORIES;
export type EventSubCategory<T extends EventCategory> =
  typeof EVENT_CATEGORIES[T]["subcategories"][number];