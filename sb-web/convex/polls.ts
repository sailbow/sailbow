import { Infer, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { withUser } from "./authUtils";
import { GenericDatabaseReader, GenericDatabaseWriter } from "convex/server";
import { DataModel, Id } from "./_generated/dataModel";
import {
  getAll,
  getManyFrom,
  getManyVia,
  getOneFrom,
  getOneFromOrThrow,
  getOrThrow,
} from "convex-helpers/server/relationships";
import { asyncMap } from "convex-helpers";
import { pruneNull } from "convex-helpers";
import { throwIfNotMember } from "./tripUtils";
import { getTripCrew } from "./trips/queries";

const basePollInput = v.object({
  title: v.string(),
  settings: v.object({
    allowMultiple: v.boolean(),
    incognitoResponses: v.boolean(),
  }),
  options: v.array(v.string()),
});

type PollInput = Infer<typeof basePollInput>;

export const createTripPoll = mutation({
  args: {
    tripId: v.id("trips"),
    ...basePollInput.fields,
  },
  handler: async (ctx, args) => {
    return await withUser(ctx.auth, ctx.db, async (user) => {
      await throwIfNotMember(user, args.tripId, ctx.db);
      const { tripId, ...pollInput } = args;
      const poll = await createPoll(ctx.db, user.userId, pollInput);
      const tripPollId = await ctx.db.insert("tripPolls", {
        tripId: args.tripId,
        pollId: poll.pollId,
      });

      const crew = await ctx.db
        .query("crews")
        .withIndex("by_tripId", (q) => q.eq("tripId", args.tripId))
        .collect();

      await Promise.all(
        crew.map(async (cm) => {
          if (cm.userId !== user.userId) {
            const targetUser = await ctx.db.get(cm.userId as Id<"users">);
            if (targetUser) {
              await ctx.db.insert("notifications", {
                type: "tripPoll",
                userId: targetUser._id,
                dismissed: false,
                data: {
                  tripId: args.tripId,
                  tripPollId: tripPollId,
                  postedByName: user.fullName,
                },
              });
            }
          }
        }),
      );
      return {
        tripPollId,
        ...poll,
      };
    });
  },
});

export const getTripPoll = query({
  args: {
    tripPollId: v.id("tripPolls"),
  },
  handler: async (ctx, args) => {
    return withUser(ctx.auth, ctx.db, async (user) => {
      const tripPoll = await getOneFromOrThrow(
        ctx.db,
        "tripPolls",
        "by_id",
        args.tripPollId,
        "_id",
      );
      await throwIfNotMember(user, tripPoll.tripId, ctx.db);
      const poll = await getDetailedPoll(ctx.db, tripPoll.pollId);
      return {
        ...poll,
        tripPollId: tripPoll._id,
      };
    });
  },
});

export const createItineraryItemPoll = mutation({
  args: {
    itineraryItemId: v.id("itineraryItemsV2"),
    ...basePollInput.fields,
  },
  handler: async (ctx, args) => {
    return await withUser(ctx.auth, ctx.db, async (user) => {
      const { itineraryItemId, ...pollInput } = args;
      const itinItem = await getOneFromOrThrow(
        ctx.db,
        "itineraryItemsV2",
        "by_id",
        itineraryItemId,
        "_id",
      );
      await throwIfNotMember(user, itinItem.tripId, ctx.db);
      const poll = await createPoll(ctx.db, user.userId, pollInput);
      const itineraryItemPollId = await ctx.db.insert("itineraryItemPolls", {
        itineraryItemId,
        pollId: poll.pollId,
      });
      return {
        itineraryItemPollId,
        ...poll,
      };
    });
  },
});

export const respondToTripPoll = mutation({
  args: {
    tripPollId: v.id("tripPolls"),
    choices: v.array(v.id("pollOptions")),
  },
  handler: (ctx, args) => {
    return withUser(ctx.auth, ctx.db, async (user) => {
      const tripPoll = await getOneFromOrThrow(
        ctx.db,
        "tripPolls",
        "by_id",
        args.tripPollId,
        "_id",
      );
      await throwIfNotMember(user, tripPoll.tripId, ctx.db);
      await respondToPoll(ctx.db, {
        pollId: tripPoll.pollId,
        userId: user.userId,
        choices: args.choices,
      });
    });
  },
});

export const respondToItineraryItemPoll = mutation({
  args: {
    itineraryItemPollId: v.id("itineraryItemPolls"),
    choices: v.array(v.id("pollOptions")),
  },
  handler: (ctx, args) => {
    return withUser(ctx.auth, ctx.db, async (user) => {
      const itemPoll = await getOneFromOrThrow(
        ctx.db,
        "itineraryItemPolls",
        "by_id",
        args.itineraryItemPollId,
        "_id",
      );
      const itinItem = await getOneFromOrThrow(
        ctx.db,
        "itineraryItemsV2",
        "by_id",
        itemPoll.itineraryItemId,
        "_id",
      );
      await throwIfNotMember(user, itinItem.tripId, ctx.db);
      await respondToPoll(ctx.db, {
        pollId: itemPoll.pollId,
        userId: user.userId,
        choices: args.choices,
      });
    });
  },
});

export const getTripPolls = query({
  args: {
    tripId: v.id("trips"),
  },
  handler: async (ctx, args) => {
    return withUser(ctx.auth, ctx.db, async (user) => {
      await throwIfNotMember(user, args.tripId, ctx.db);
      return pruneNull(
        await asyncMap(
          getManyFrom(ctx.db, "tripPolls", "by_tripId", args.tripId),
          async (tripPoll) => {
            const { _id, ...poll } = await getDetailedPoll(
              ctx.db,
              tripPoll.pollId,
            );
            return {
              tripPollId: tripPoll._id,
              ...poll,
            };
          },
        ),
      ).sort((a, b) => b._creationTime - a._creationTime);
    });
  },
});

export const deleteTripPoll = mutation({
  args: {
    tripPollId: v.id("tripPolls"),
  },
  handler: async ({ auth, db }, { tripPollId }) => {
    return withUser(auth, db, async (user) => {
      const tripPoll = await getOneFromOrThrow(
        db,
        "tripPolls",
        "by_id",
        tripPollId,
        "_id",
      );
      const poll = await getDetailedPoll(db, tripPoll.pollId);
      const membership = await throwIfNotMember(user, tripPoll.tripId, db);
      if (
        !["captain", "firstMate"].includes(membership.role) &&
        poll.owner !== user.userId
      ) {
        throw new Error("You are not allowed to delete this poll!");
      }
      await db.delete(tripPoll._id);
      await Promise.all([
        Promise.all(poll.responses.map((r) => db.delete(r._id))),
        Promise.all(poll.options.map((o) => db.delete(o._id))),
        db.delete(poll._id),
      ]);
    });
  },
});

export const getItinItemPoll = query({
  args: {
    itineraryItemId: v.id("itineraryItemsV2"),
  },
  handler: async (ctx, args) => {
    return withUser(ctx.auth, ctx.db, async (user) => {
      const item = await ctx.db.get(args.itineraryItemId);
      if (!item) throw new Error("Cannot delete item that does not exist");
      await throwIfNotMember(user, item.tripId, ctx.db);
      const itemPoll = await getOneFrom(
        ctx.db,
        "itineraryItemPolls",
        "byItineraryItemId",
        args.itineraryItemId,
        "itineraryItemId",
      );
      if (!itemPoll) return null;
      const poll = await getDetailedPoll(ctx.db, itemPoll.pollId);
      return {
        ...poll,
        itineraryItemPollId: itemPoll._id,
      };
    });
  },
});

export const respondToItinItemPoll = mutation({
  args: {
    itineraryItemPollId: v.id("itineraryItemPolls"),
    choices: v.array(v.id("pollOptions")),
  },
  handler: (ctx, args) => {
    return withUser(ctx.auth, ctx.db, async (user) => {
      const itemPoll = await getOneFromOrThrow(
        ctx.db,
        "itineraryItemPolls",
        "by_id",
        args.itineraryItemPollId,
        "_id",
      );
      const item = await getOneFromOrThrow(
        ctx.db,
        "itineraryItemsV2",
        "by_id",
        itemPoll.itineraryItemId,
        "_id",
      );
      await throwIfNotMember(user, item.tripId, ctx.db);
      await respondToPoll(ctx.db, {
        pollId: itemPoll.pollId,
        userId: user.userId,
        choices: args.choices,
      });
    });
  },
});

const getDetailedPoll = async (
  db: GenericDatabaseReader<DataModel>,
  pollId: Id<"polls">,
) => {
  const poll = await getOneFromOrThrow(db, "polls", "by_id", pollId, "_id");
  const options = await getManyFrom(db, "pollOptions", "by_pollId", pollId);
  const responses = await getManyFrom(db, "pollResponses", "by_pollId", pollId);
  // const groupedResponses = allResponses.reduce((acc, val) => {
  //   const current = acc[val.optionId] ?? [];
  //   acc[val.optionId] = [...current, val.userId];
  //   return acc;
  // }, {} as Record<Id<"pollOptions">, Id<"users">[]>);
  return {
    ...poll,
    options,
    responses,
  };
};

type PollResponse = {
  pollId: Id<"polls">;
  userId: Id<"users">;
  choices: Id<"pollOptions">[];
};

const respondToPoll = async (
  db: GenericDatabaseWriter<DataModel>,
  response: PollResponse,
) => {
  const { pollId, choices, userId } = response;
  const poll = await getDetailedPoll(db, pollId);
  const existingResponse = poll.responses.find((r) => r.userId === userId);
  if (existingResponse) {
    await db.patch(existingResponse._id, { choices });
  } else {
    await db.insert("pollResponses", {
      userId,
      pollId,
      choices,
    });
  }
};

const createPoll = async (
  db: GenericDatabaseWriter<DataModel>,
  userId: Id<"users">,
  input: PollInput,
) => {
  const { options, ...poll } = input;
  const pollId = await db.insert("polls", {
    ...poll,
    owner: userId,
  });
  const newOptions = await Promise.all(
    options.map(async (value) => {
      const _id = await db.insert("pollOptions", { pollId, value });
      return { _id, pollId, value };
    }),
  );

  return {
    ...input,
    pollId,
    owner: userId,
    options: newOptions,
  };
};
