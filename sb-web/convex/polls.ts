import { Infer, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { withUser } from "./authUtils";
import { GenericDatabaseReader, GenericDatabaseWriter } from "convex/server";
import { DataModel, Id } from "./_generated/dataModel";
import {
  getAll,
  getManyFrom,
  getManyVia,
  getOneFromOrThrow,
} from "convex-helpers/server/relationships";
import { asyncMap } from "convex-helpers";
import { pruneNull } from "convex-helpers";
import { throwIfNotMember } from "./tripUtils";

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
      return {
        tripPollId,
        ...poll,
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
    selectedOptions: v.array(v.id("pollOptions")),
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
      await respondToPoll(
        ctx.db,
        tripPoll.pollId,
        user.userId,
        args.selectedOptions,
      );
    });
  },
});

export const respondToItineraryItemPoll = mutation({
  args: {
    itineraryItemPollId: v.id("itineraryItemPolls"),
    selectedOptions: v.array(v.id("pollOptions")),
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
      await respondToPoll(
        ctx.db,
        itemPoll.pollId,
        user.userId,
        args.selectedOptions,
      );
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

const getDetailedPoll = async (
  db: GenericDatabaseReader<DataModel>,
  pollId: Id<"polls">,
) => {
  const poll = await getOneFromOrThrow(db, "polls", "by_id", pollId, "_id");
  const options = await getManyFrom(db, "pollOptions", "by_pollId", pollId);
  const allResponses = pruneNull(
    await asyncMap(options, (o) =>
      getManyFrom(db, "pollResponses", "by_optionId", o._id),
    ),
  ).flatMap((v) => v);
  // const groupedResponses = allResponses.reduce((acc, val) => {
  //   const current = acc[val.optionId] ?? [];
  //   acc[val.optionId] = [...current, val.userId];
  //   return acc;
  // }, {} as Record<Id<"pollOptions">, Id<"users">[]>);
  return {
    ...poll,
    options,
    responses: allResponses,
  };
};

const respondToPoll = async (
  db: GenericDatabaseWriter<DataModel>,
  pollId: Id<"polls">,
  userId: Id<"users">,
  selectedOptions: Id<"pollOptions">[],
) => {
  const poll = await getDetailedPoll(db, pollId);
  const currentChoices = poll.responses.filter((r) => r.userId === userId);
  await asyncMap(
    currentChoices.filter((co) => !selectedOptions.includes(co.optionId)),
    (c) => db.delete(c._id),
  );
  await asyncMap(
    selectedOptions.filter(
      (so) => !currentChoices.some((c) => c.optionId === so),
    ),
    (o) => db.insert("pollResponses", { userId: userId, optionId: o }),
  );
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
