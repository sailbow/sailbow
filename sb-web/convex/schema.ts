import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { migrationsTable } from "convex-helpers/server/migrations";

export const roleSchema = v.union(
  v.literal("captain"),
  v.literal("firstMate"),
  v.literal("crewMember"),
);

export const locationValidator = v.object({
  placeId: v.string(),
  primaryText: v.string(),
  secondaryText: v.optional(v.string()),
  icon: v.optional(
    v.object({
      url: v.string(),
      background: v.string(),
    }),
  ),
  geo: v.optional(
    v.object({
      lat: v.number(),
      lng: v.number(),
    }),
  ),
  photo: v.optional(v.string()),
  website: v.optional(v.string()),
});

export const tripSchema = {
  name: v.string(),
  slug: v.optional(v.string()),
  description: v.string(),
  dates: v.optional(
    v.object({
      start: v.number(),
      end: v.number(),
    }),
  ),
  banner: v.union(
    v.null(),
    v.object({
      alt: v.string(),
      thumbnail: v.string(),
      small: v.string(),
      regular: v.string(),
      full: v.string(),
    }),
  ),
  location: v.optional(locationValidator),
};

export const inviteSchema = {
  tripId: v.id("trips"),
  email: v.string(),
  role: v.union(v.literal("crewMember"), v.literal("firstMate")),
  invitedByUserId: v.id("users"),
  status: v.union(
    v.literal("pending"),
    v.literal("declined"),
    v.literal("accepted"),
  ),
};

export const crewMemberSchema = {
  tripId: v.id("trips"),
  userId: v.string(),
  email: v.string(),
  role: roleSchema,
};

export const announcementSchema = {
  tripId: v.id("trips"),
  title: v.optional(v.string()),
  text: v.string(),
};

export const userSchema = {
  externalId: v.string(),
  firstName: v.string(),
  lastName: v.string(),
  imageUrl: v.string(),
  email: v.string(),
};

export const itineraryItemSchema = v.object({
  tripId: v.id("trips"),
  title: v.string(),
  date: v.number(),
  start: v.optional(v.string()),
  end: v.optional(v.string()),
  time: v.union(v.null(), v.string()),
  location: v.union(v.null(), v.string()),
  details: v.union(v.null(), v.string()),
});

export const itineraryItemSchemaV2 = v.object({
  tripId: v.id("trips"),
  title: v.string(),
  startDate: v.number(),
  endDate: v.union(v.number(), v.null()),
  type: v.union(v.null(), v.string()),
  location: v.optional(locationValidator),
  details: v.union(v.null(), v.string()),
});

const baseNotification = {
  userId: v.id("users"),
  dismissed: v.boolean(),
};

const invitationNotificationSchema = {
  ...baseNotification,
  type: v.literal("invite"),
  data: v.object({
    inviteId: v.id("invitations"),
  }),
};

const announcementNotificationSchema = {
  ...baseNotification,
  type: v.literal("announcement"),
  data: v.object({
    announcementId: v.id("announcements"),
    announcerName: v.string(),
    tripId: v.id("trips"),
  }),
};

const tripPollNotificationSchema = {
  ...baseNotification,
  type: v.literal("tripPoll"),
  data: v.object({
    tripId: v.id("trips"),
    tripPollId: v.id("tripPolls"),
    postedByName: v.string(),
  }),
};

export const notificationsSchema = v.union(
  v.object(invitationNotificationSchema),
  v.object(announcementNotificationSchema),
  v.object(tripPollNotificationSchema),
);

export const pollSchema = v.object({
  title: v.string(),
  settings: v.object({
    allowMultiple: v.boolean(),
    incognitoResponses: v.boolean(),
  }),
  owner: v.id("users"),
});

export const pollOptionsSchema = v.object({
  pollId: v.id("polls"),
  value: v.string(),
});

export const pollResponseSchema = v.object({
  pollId: v.id("polls"),
  userId: v.id("users"),
  choices: v.array(v.id("pollOptions")),
});

export default defineSchema({
  migrations: migrationsTable,

  users: defineTable(userSchema)
    .index("by_externalId", ["externalId"])
    .index("by_email", ["email"]),

  trips: defineTable(tripSchema).searchIndex("search_trip_name", {
    searchField: "name",
  }),

  invitations: defineTable(inviteSchema)
    .index("by_tripId", ["tripId"])
    .index("by_email", ["email"])
    .index("by_email_and_tripId", ["email", "tripId"]),

  notifications: defineTable(notificationsSchema).index("by_userId", [
    "userId",
  ]),

  crews: defineTable(crewMemberSchema)
    .index("by_userId", ["userId"])
    .index("by_userId_and_tripId", ["userId", "tripId"])
    .index("by_tripId", ["tripId"])
    .index("by_email", ["email"])
    .index("by_email_and_tripId", ["email", "tripId"]),

  announcements: defineTable({
    ...announcementSchema,
    createdBy: v.id("users"),
  }).index("by_tripId", ["tripId"]),

  itineraryItems: defineTable(itineraryItemSchema).index("by_tripId", [
    "tripId",
  ]),
  itineraryItemsV2: defineTable(itineraryItemSchemaV2).index("by_tripId", [
    "tripId",
  ]),
  polls: defineTable(pollSchema),
  pollOptions: defineTable(pollOptionsSchema).index("by_pollId", ["pollId"]),
  pollResponses: defineTable(pollResponseSchema)
    .index("by_pollId", ["pollId"])
    .index("by_userId_pollId", ["userId", "pollId"]),
  tripPolls: defineTable({
    tripId: v.id("trips"),
    pollId: v.id("polls"),
  }).index("by_tripId", ["tripId"]),
  itineraryItemPolls: defineTable({
    itineraryItemId: v.id("itineraryItemsV2"),
    pollId: v.id("polls"),
  }),
});
