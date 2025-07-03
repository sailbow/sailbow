import { Infer, v } from "convex/values";
import { mutation } from "../_generated/server";
import { withUser } from "../authUtils";
import { GenericDatabaseReader, GenericDatabaseWriter } from "convex/server";
import { DataModel, Id } from "../_generated/dataModel";

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
